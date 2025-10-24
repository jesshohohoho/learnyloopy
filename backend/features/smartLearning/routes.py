from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from config.database import get_supabase
from features.smartLearning.schemas import Question, ReviewRequest
from features.smartLearning.services import read_pdf, read_docx, FlashcardService, DocumentService, MockTestService
from datetime import datetime, timezone
from auth.dependencies import require_user_id, get_current_user
from typing import Dict, Any, List
from config.database import get_supabase


router = APIRouter(prefix="/smart-learning", tags=["smart-learning"])

flashcard_service = FlashcardService()
document_service = DocumentService()
mock_test_service = MockTestService()

@router.post("/ask_question")
def ask_question(q: Question, user_id: str = Depends(require_user_id)):
    try:
        supabase = get_supabase()
        result = document_service.ask_question(supabase, user_id, q.subject, q.text)
        return result
    except HTTPException:
        # Re-raise HTTP exceptions with proper error messages
        raise
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

# --- Upload/retrieve documents ---
@router.post("/documents/upload")
async def upload_material(subject: str = Form(...), file: UploadFile = File(...), user_id: str = Depends(require_user_id)):
    """Upload material and automatically generate flashcards"""
    try:
        # ✅ Step 1: Process the uploaded file
        if file.filename.endswith(".pdf"):
            text = read_pdf(file)
        elif file.filename.endswith(".docx"):
            text = read_docx(file)
        elif file.filename.endswith(".txt"):
            text = (await file.read()).decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Check if document is too large
        if len(text) > 5000:  # ~50k characters limit
            raise HTTPException(
                status_code=400,
                detail="Document is too large. Please upload a smaller document or split it into parts."
            )

        # Add document to database
        supabase = get_supabase()
        doc = document_service.add_document_to_db(supabase, user_id, text, subject)
        
        # Automatically generate flashcards for this subject
        try:
            flashcard_result = flashcard_service.generate_flashcards_from_documents(supabase, user_id, subject)
            
            if "error" in flashcard_result:
                # Document uploaded but flashcard generation failed
                return {
                    "id": doc["id"],
                    "subject": subject,
                    "message": "Material uploaded successfully",
                    "flashcard_status": "failed",
                    "flashcard_error": flashcard_result["error"]
                }
            else:
                # Both document upload and flashcard generation successful
                return {
                    "id": doc["id"],
                    "subject": subject,
                    "message": "Material uploaded and flashcards generated successfully",
                    "flashcard_status": "success",
                    "flashcards_created": len(flashcard_result.get("Flashcards", [])),
                    "flashcard_details": flashcard_result
                }
                
        except HTTPException:
            # If flashcard generation hits rate limit, still return success for upload
            raise

        except Exception as flashcard_error:
            # Document uploaded but flashcard generation encountered an exception
            print(f"Flashcard generation error: {str(flashcard_error)}")
            return {
                "id": doc["id"],
                "subject": subject,
                "message": "Material uploaded successfully, but flashcard generation failed",
                "flashcard_status": "failed",
                "flashcard_error": str(flashcard_error)
            }
    
    except HTTPException:
            raise
    except Exception as e:
        # Document upload failed
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
@router.get("/documents/{subject_name}")
def get_documents(subject_name: str, user_id: str = Depends(require_user_id)):
    # Get subject with user_id filter
    supabase = get_supabase()
    subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
    if not subject_response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    subject = subject_response.data[0]
    
    # Get documents for this subject
    documents_response = supabase.table("uploaded_documents").select("id, text").eq("subject_id", subject["id"]).execute()
    
    documents = [
        {"id": doc["id"], "text-preview": doc["text"][:200]}
        for doc in documents_response.data
    ]

    return {"subject": subject["name"], "documents": documents}

# Show users' subjects in class material card
@router.get("/subjects/", response_model=List[str])
async def get_user_subjects(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get all subjects for the authenticated user"""
    try:
        supabase = get_supabase()
        
        # Get distinct subjects from user's documents/materials
        response = supabase.table("subjects").select("name").eq(
            "user_id", current_user["user_id"]
        ).execute()
        
        subjects = [item["name"] for item in response.data] if response.data else []
        
        return subjects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching subjects: {str(e)}")

# --- flashcard ---

@router.get("/flashcards/review/{subject_name}")
def get_due_flashcards(subject_name: str, user_id: str = Depends(require_user_id)):
    current_time = datetime.now(timezone.utc).isoformat()
    
    # Get subject first with user_id filter
    supabase = get_supabase()
    subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
    if not subject_response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    subject = subject_response.data[0]
    
    # Fetch flashcards for the given subject that are due
    flashcards_response = (
        supabase.table("flashcards")
        .select("*")
        .eq("subject_id", subject["id"])
        .lte("due", current_time)
        .execute()
    )
    
    if not flashcards_response.data:
        raise HTTPException(status_code=404, detail="No due flashcards found for this subject")

    return [
        {
            "id": f["id"],
            "question": f["question"],
            "answer": f["answer"],
            "due": f["due"]
        }
        for f in flashcards_response.data
    ]

@router.post("/flashcards/review/{flashcard_id}")
def review_flashcard(flashcard_id: int, request: ReviewRequest, user_id: str = Depends(require_user_id)):
    try:
        supabase = get_supabase()
        result = flashcard_service.review_flashcard(flashcard_id, request, user_id, supabase)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/flashcards/view/{subject_name}")
def view_flashcards(subject_name: str, user_id: str = Depends(require_user_id)):
    # Get subject first with user_id filter
    supabase = get_supabase()
    subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
    if not subject_response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    subject = subject_response.data[0]
    
    # Get flashcards for this subject
    flashcards_response = supabase.table("flashcards").select("*").eq("subject_id", subject["id"]).execute()
    
    return [
        {
            "id": f["id"],
            "question": f["question"],
            "answer": f["answer"],
            "due": f["due"]
        }
        for f in flashcards_response.data
    ]

# --- Conduct mock test and get performance ---

@router.post("/test/generate/{subject_name}")
async def generate_mock_test(subject_name: str, user_id: str = Depends(require_user_id)):
    """Generate mock test questions for a subject"""
    try:
        supabase = get_supabase()
        result = mock_test_service.generate_mock_test(supabase, user_id, subject_name)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate mock test. Please try again later."
        )

@router.post("/test/result/{subject_name}")
async def store_mock_test_result(
    subject_name: str, 
    result_data: dict,
    user_id: str = Depends(require_user_id)
):
    """Store mock test result and optionally create flashcards from wrong answers"""
    supabase = get_supabase()
    result = mock_test_service.store_mock_test_result(
        supabase, user_id, subject_name, result_data, flashcard_service
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result