from groq import Groq
import re
import json
from PyPDF2 import PdfReader
import docx
from io import BytesIO
from fastapi import UploadFile, HTTPException
from fsrs import Scheduler, Card, Rating
from datetime import datetime, timedelta
from features.smartLearning.schemas import ReviewRequest
import numpy as np
from typing import List, Dict
import os
from dotenv import load_dotenv
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from google.oauth2 import service_account
import vertexai


# --- Document Service ---

class DocumentService:
    def add_document_to_db(self, supabase, user_id: str, text: str, subject_name: str):
        # Check if subject exists for this user, create if not
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        
        if not subject_response.data:
            # Create new subject for this user
            subject_insert = supabase.table("subjects").insert({"name": subject_name, "user_id": user_id}).execute()
            subject = subject_insert.data[0]
        else:
            subject = subject_response.data[0]

        # Generate embedding and add document
        emb = get_embedding(text)
        doc_insert = supabase.table("uploaded_documents").insert({
            "text": text,
            "embedding": emb,
            "subject_id": subject["id"]
        }).execute()
        
        return doc_insert.data[0]

    def search_documents(self, supabase, query: str, top_k: int = 3):
        q_emb = get_embedding(query)
        
        # Get all documents with embeddings
        all_docs_response = supabase.table("uploaded_documents").select("*").execute()
        
        # Calculate similarities and get top_k
        similarities = []
        for doc in all_docs_response.data:
            if doc["embedding"]:
                # Calculate L2 distance (convert to similarity)
                # Handle case where embedding might be stored as string
                doc_embedding = doc["embedding"]
                if isinstance(doc_embedding, str):
                    try:
                        doc_embedding = json.loads(doc_embedding)
                    except:
                        continue
                
                doc_emb = np.array(doc_embedding, dtype=np.float32)
                query_emb = np.array(q_emb, dtype=np.float32)
                distance = np.linalg.norm(doc_emb - query_emb)
                similarities.append((distance, doc))
        
        # Sort by distance (ascending) and take top_k
        similarities.sort(key=lambda x: x[0])
        top_docs = [doc for _, doc in similarities[:top_k]]
        
        return [doc["text"] for doc in top_docs]

    def ask_question(self, supabase, user_id: str, subject_name: str, question_text: str):
        try:
            # Get subject for this user
            subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
            if not subject_response.data:
                raise ValueError(f"Subject '{subject_name}' not found. Please upload study materials first. ")
            
            subject = subject_response.data[0]
            
            # Get embedding for question
            q_emb = get_embedding(question_text)
            
            # Get documents for this subject
            documents_response = supabase.table("uploaded_documents").select("*").eq("subject_id", subject["id"]).execute()
            
            if not documents_response.data:
                raise ValueError(f"No documents found for subject '{subject_name}'. Please upload study materials first. ")
            
            # Calculate similarities and get top 3
            similarities = []
            for doc in documents_response.data:
                if doc["embedding"]:
                    # Handle case where embedding might be stored as string
                    doc_embedding = doc["embedding"]
                    if isinstance(doc_embedding, str):
                        try:
                            doc_embedding = json.loads(doc_embedding)
                        except:
                            continue
                    
                    doc_emb = np.array(doc_embedding, dtype=np.float32)
                    query_emb = np.array(q_emb, dtype=np.float32)
                    distance = np.linalg.norm(doc_emb - query_emb)
                    similarities.append((distance, doc))
            
            # Sort by distance and take top 3
            similarities.sort(key=lambda x: x[0])
            top_docs = [doc for _, doc in similarities[:3]]
            
            docs = [doc["text"] for doc in top_docs]
            context = "\n".join(docs)
            guidance_response = query_guidance_tutor(question_text, context)
            
            # Parse the JSON response
            try:
                guidance_json = json.loads(guidance_response)
                
                # Extract the actual guidance text
                if "hint" in guidance_json:
                    answer_text = guidance_json["hint"]
                elif "steps" in guidance_json:
                    answer_text = guidance_json["steps"]
                else:
                    answer_text = "I'm having trouble processing your question. Try rephrasing it or asking more specifically."
                    
            except json.JSONDecodeError:
                answer_text = "I'm having trouble processing your question. Try rephrasing it or asking more specifically."

            return {
                "question": question_text,
                "subject": subject_name,
                "answer": answer_text,
                "retrieved_docs": docs,
            }
        except HTTPException:
            # Re-raise HTTP exceptions (rate limit, auth errors, etc.)
            raise
        except ValueError:
            # Re-raise value errors (subject not found, etc.)
            raise
        except Exception as e:
            # Catch unexpected errors
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process your question: {str(e)}"
            )

# --- Embedding model ---

load_dotenv()

# Initialize Vertex AI with explicit credentials
def init_vertex_ai():
    # Get configuration from environment variables
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
    location = os.getenv('GOOGLE_CLOUD_LOCATION')
    
    if not creds_path:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not set!")
    
    if not os.path.exists(creds_path):
        raise ValueError(f"Credentials file not found at: {creds_path}")
    
    # Load credentials from file
    credentials = service_account.Credentials.from_service_account_file(creds_path)
    
    # Get project_id from file if not in env
    if not project_id:
        with open(creds_path) as f:
            project_id = json.load(f).get('project_id')
    
    if not project_id:
        raise ValueError("GOOGLE_CLOUD_PROJECT not set and not found in credentials!")
    
    # Initialize Vertex AI
    vertexai.init(project=project_id, credentials=credentials, location=location)
    print(f"✅ Vertex AI initialized: project={project_id}, location={location}")

# Call this once when your app starts
init_vertex_ai()


# Switch to google cloud api for embedding task
def get_embedding(text: str, dimensionality: int = 768) -> list[float]:
    task = "RETRIEVAL_DOCUMENT"
    model = TextEmbeddingModel.from_pretrained("gemini-embedding-001")
    text_input = TextEmbeddingInput(text, task)
    embedding = model.get_embeddings([text_input], output_dimensionality=dimensionality)

    return embedding[0].values

# --- Groq Large Language Model ---

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def query_groq(user_text: str, context: str = "") -> str:
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant using RAG."},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {user_text}"}
            ],
            temperature=0.3,
            max_completion_tokens=1300,
            top_p=0.95,
            stream=False,
        )
        return completion.choices[0].message.content
    except Exception as e:
        error_message = str(e).lower()
        
        # Handle rate limit / quota errors (Error 413)
        if 'rate_limit' in error_message or 'quota' in error_message or '413' in error_message:
            raise HTTPException(
                status_code=503,  # Service Unavailable
                detail="Sorry! Our AI service is currently busy. Please try again in a few moments."
            )
        
        # Handle authentication errors
        elif 'authentication' in error_message or 'unauthorized' in error_message or '401' in error_message:
            raise HTTPException(
                status_code=401,
                detail="Session expired. Please sign out and log in again."
            )
        
        # Handle token/content too large
        elif 'token' in error_message or 'too large' in error_message:
            raise HTTPException(
                status_code=400,
                detail="Your question or document is too long. Please try with shorter content."
            )
        
        # Generic error
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to get an answer. Please try rephrasing your question or try again later."
            )

def query_guidance_tutor(question_text: str, context: str = "") -> str:
    """Query the guidance-focused AI tutor that gives hints instead of direct answers"""
    try:
        completion = groq_client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a guidance-focused AI tutor. \nDo NOT give direct solutions or definitions. \nInstead, give hints or guiding steps that help the student think for themselves. \nAlways output valid JSON.\n\nSchema:\n- For conceptual/explanatory questions: { \"hint\": string }\n- For procedural/problem-solving questions: { \"steps\": string }\n\nExamples:\n\nQ: What is the difference between correlation and causation?  \nA (correct): { \"hint\": \"Ask yourself: do the variables just move together, or does one actually make the other happen?\" }  \nA (incorrect): { \"hint\": \"Correlation is when two variables change together, while causation means one causes the other.\" }  # Too direct\n\nQ: Solve x² + 3x + 2 = 0  \nA (correct): { \"steps\": \"1. Think about factoring the quadratic. 2. What two numbers multiply to 2 and add to 3?\" }  \nA (incorrect): { \"steps\": \"The factors are (x+1)(x+2), so the solutions are -1 and -2.\" }  # Too direct"
                },
                {
                    "role": "user",
                    "content": f"Context from materials: {context}\n\nStudent question: {question_text}"
                }
            ],
            temperature=0.6,
            max_completion_tokens=1024,
            top_p=0.95,
            stream=False,
            response_format={"type": "json_object"},
            stop=None
        )
        
        return completion.choices[0].message.content
    except Exception as e:
        error_message = str(e).lower()
        
        # Handle rate limit / quota errors (Error 413)
        if 'rate_limit' in error_message or 'quota' in error_message or '413' in error_message:
            raise HTTPException(
                status_code=503,
                detail="Sorry! Our AI service is currently busy. Please try again in a few moments."
            )
        
        # Handle authentication errors
        elif 'authentication' in error_message or 'unauthorized' in error_message or '401' in error_message:
            raise HTTPException(
                status_code=401,
                detail="Session expired. Please sign out and log in again."
            )
        
        # Handle token/content too large
        elif 'token' in error_message or 'too large' in error_message:
            raise HTTPException(
                status_code=400,
                detail="Your question or document is too long. Please try with shorter content."
            )
        
        # Generic error
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to get guidance. Please try rephrasing your question or try again later."
            )

def extract_json_array(text):
    """Extract and parse JSON array from LLM response"""
    
    # 1. Try to find JSON in code blocks
    match = re.search(r'```(?:json)?\s*(\[[\s\S]*?\])\s*```', text, re.IGNORECASE)
    if match:
        json_str = match.group(1)
    else:
        # 2. Try to find raw JSON array (match balanced brackets)
        # Find the first [ and then find its matching ]
        start = text.find('[')
        if start == -1:
            raise ValueError("No JSON array found in text.")
        
        bracket_count = 0
        end = start
        for i in range(start, len(text)):
            if text[i] == '[':
                bracket_count += 1
            elif text[i] == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end = i + 1
                    break
        
        if bracket_count != 0:
            raise ValueError("Unbalanced brackets in JSON array.")
        
        json_str = text[start:end]
    
    # 3. Clean up common LLM mistakes
    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)  # Remove trailing commas
    json_str = re.sub(r'\n\s*\n', '\n', json_str)  # Remove extra newlines
    
    # 4. Try to parse
    try:
        data = json.loads(json_str)
        if isinstance(data, list):
            return data
        else:
            raise ValueError("Parsed JSON is not an array.")
    except json.JSONDecodeError as e:
        # 5. Fallback: try to extract individual objects
        print(f"JSON parse error: {e}")
        print(f"Trying to recover partial data...")
        
        objects = []
        # Find all complete JSON objects
        for match in re.finditer(r'\{[^{}]*"question"[^{}]*"options"[^{}]*"answer"[^{}]*\}', json_str):
            try:
                obj = json.loads(match.group(0))
                objects.append(obj)
            except:
                continue
        
        if objects:
            return objects
        else:
            raise ValueError(f"Could not parse JSON: {e}\nText: {json_str[:500]}")

# --- PDF/DOCX readers ---
def read_pdf(file=UploadFile):
    reader = PdfReader(file.file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            page_text = " ".join(page_text.split())
            text += page_text + "\n"
    return text.strip()

def read_docx(upload_file):
    # Read all bytes into memory
    file_bytes = upload_file.file.read()
    # Wrap in BytesIO so python-docx can handle it
    doc = docx.Document(BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

# --- Flashcards ---

class FlashcardService:
    def __init__(self):
        self.scheduler = Scheduler(
            parameters = (
                0.2172, 1.1771, 3.2602, 16.1507, 7.0114, 0.57, 2.0966, 0.0069, 1.5261, 0.112,
                1.0178, 1.849, 0.1133, 0.3127, 2.2934, 0.2191, 3.0004, 0.7536, 0.3332, 0.1437,
                0.2,
            ),
            desired_retention = 0.9, # card will be scheduled when P(correct) falls to this value
            learning_steps = (timedelta(minutes=1), timedelta(minutes=10)),
            relearning_steps = (timedelta(minutes=10),),
            maximum_interval = 365,
            enable_fuzzing = True
        )
    
    def generate_flashcards_from_documents(self, supabase, user_id: str, subject_name: str):
        # Get subject for this user
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        if not subject_response.data:
            return {"error": "Subject not found"}
        
        subject = subject_response.data[0]
        
        # Get all documents for this subject
        documents_response = supabase.table("uploaded_documents").select("text").eq("subject_id", subject["id"]).execute()
        all_text = " ".join([doc["text"] for doc in documents_response.data])

        prompt = f"""
        You are a flashcard generator. Read the material and output ONLY valid JSON in this exact format:

        [
        {{"question": "Q text", "answer": "A text"}},
        {{"question": "Q text", "answer": "A text"}}
        ]

        CRITICAL INSTRUCTIONS:
        - Output ONLY the JSON array, nothing else
        - No thinking tags like <think> or </think>
        - No explanations, no commentary, no extra text
        - No markdown formatting
        - Ensure the JSON is valid and properly formatted

        Subject: {subject_name}
        Material: {all_text}
        """

        result = query_groq("Return flashcards in Q&A pairs", prompt)
        flashcards_data = self._parse_flashcard_json(result, subject_name)

        # Save flashcards to database
        saved_flashcards = []
        
        for flashcard_data in flashcards_data:
            card = Card()
            flashcard_insert = supabase.table("flashcards").insert({
                "question": flashcard_data["question"],
                "answer": flashcard_data["answer"],
                "due": card.due.isoformat(),
                "subject_id": subject["id"]
            }).execute()
            
            flashcard = flashcard_insert.data[0]
            saved_flashcards.append({
                "id": flashcard["id"],
                "question": flashcard["question"],
                "answer": flashcard["answer"],
                "due": flashcard["due"]
            })

        return {
            "Subject": subject["name"],
            "Flashcards": saved_flashcards,
            "message": f"Successfully created {len(saved_flashcards)} flashcards"
        }
    
    def create_flashcards_from_mock_test(self, supabase, user_id: str, subject_name: str, wrong_answers: List[Dict]):
        """Create flashcards from mock test wrong answers"""
        try:
            # Get subject of mock test
            subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
            if not subject_response.data:
                return {"error": "Subject not found"}
            
            subject = subject_response.data[0]
            
            saved_flashcards = []
            
            for wrong_answer in wrong_answers:
                # Extract the mock test question, all options, and correct answer
                question = wrong_answer.get("question", "")
                correct_answer = wrong_answer.get("answer", "")  # The correct answer
                options = wrong_answer.get("options", [])

                if not question or not correct_answer:
                    continue
                
                # Create simple flashcard - just question and correct answer
                flashcard_question = question

                # Include all options with correct answer 
                options_text = "\n".join(options) if options else ""
                flashcard_answer = f"""Options:
                {options_text}

                Correct Answer: {correct_answer}"""
                
                # Create new flashcard with default FSRS values
                card = Card()
                flashcard_insert = supabase.table("flashcards").insert({
                    "question": flashcard_question,
                    "answer": flashcard_answer,
                    "due": card.due.isoformat(),
                    "subject_id": subject["id"]
                }).execute()
                
                if flashcard_insert.data:
                    flashcard = flashcard_insert.data[0]
                    saved_flashcards.append({
                        "id": flashcard["id"],
                        "question": flashcard["question"],
                        "answer": flashcard["answer"],
                        "due": flashcard["due"]
                    })
            
            return {
                "subject": subject["name"],
                "flashcards_created": len(saved_flashcards),
                "flashcards": saved_flashcards,
                "message": f"Successfully created {len(saved_flashcards)} flashcards from mock test mistakes"
            }
            
        except Exception as e:
            return {"error": f"Failed to create flashcards from mock test: {str(e)}"}
    
    def review_flashcard(self, flashcard_id: int, request: ReviewRequest, user_id: str, supabase):
        rating = request.rating
        
        # Get flashcard and verify ownership through subject
        flashcard_response = supabase.table("flashcards").select("*, subjects(user_id)").eq("id", flashcard_id).execute()
        if not flashcard_response.data:
            raise ValueError("Flashcard not found")
        
        flashcard = flashcard_response.data[0]
        
        # Check if flashcard belongs to the user
        if flashcard["subjects"]["user_id"] != user_id:
            raise ValueError("Flashcard not found")

        card = Card()
        card.due = datetime.fromisoformat(flashcard["due"].replace('Z', '+00:00'))

        rating_enum = Rating(rating)
        card, review_log = self.scheduler.review_card(card, rating_enum)
        
        # Update flashcard due date
        supabase.table("flashcards").update({
            "due": card.due.isoformat()
        }).eq("id", flashcard_id).execute()

        return {
            "id": flashcard["id"],
            "rating": review_log.rating,
            "reviewed_at": str(review_log.review_datetime),
            "next_due": str(card.due.isoformat()),
        }

    def _parse_flashcard_json(self, result: str, subject_name: str):
        try:
            # First, find the JSON array pattern (with escaped quotes)
            json_match = re.search(r'\[\s*\{.*\}\s*\]', result, re.DOTALL)
            if json_match:
                # Extract the matched string
                escaped_json = json_match.group()
                # Convert escaped JSON to proper JSON by removing backslashes
                proper_json = escaped_json.replace('\\"', '"')
                # Parse JSON
                flashcards_data = json.loads(proper_json)
            else:
                # Fallback: try to parse the whole response after cleaning
                proper_json = result.replace('\\"', '"')
                # Strip any junk before/after the JSON
                proper_json = re.sub(r'^[^{[]*', '', proper_json)
                proper_json = re.sub(r'[^}\]]*$', '', proper_json)
                flashcards_data = json.loads(proper_json)

            return flashcards_data

        except json.JSONDecodeError as e:
            return {
                "error": f"Failed to parse JSON: {str(e)}",
                "raw_response": result,
                "subject": subject_name
            }

# --- Mock test ---
class MockTestService:
    def generate_mock_test(self, supabase, user_id: str, subject_name: str):
        """Generate mock test questions for a subject"""
        try:
            # Get subject with user_id filter
            subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
            if not subject_response.data:
                return {"error": "Subject not found"}
            
            subject = subject_response.data[0]
            
            # Get all documents for this subject
            documents_response = supabase.table("uploaded_documents").select("text").eq("subject_id", subject["id"]).execute()
            all_text = " ".join([doc["text"] for doc in documents_response.data])

            if not all_text.strip():
                return {"error": "No documents found for this subject"}

            prompt = f"""
            Return only a valid JSON array of 5 mock test questions in this format:
            [
                {{
                    "question": "Question text",
                    "options": ["a) ...", "b) ...", "c) ...", "d) ..."],
                    "answer": "a) ..."
                }},
                ...
            ]
            Subject: {subject['name']}
            Resources: {all_text}
            """
            
            result = query_groq("Generate mock test in JSON array", prompt)
            questions = extract_json_array(result)
            
            organized = []
            for q in questions:
                organized.append({
                    "question": q.get("question", ""),
                    "options": q.get("options", []),
                    "answer": q.get("answer", "")
                })

            return {
                "Subject": subject["name"], 
                "Mock test": organized
            }
            
        except Exception as e:
            return {"error": f"Failed to generate mock test: {str(e)}"}

    def store_mock_test_result(self, supabase, user_id: str, subject_name: str, result_data: dict, flashcard_service):
        """Store mock test result and optionally create flashcards"""
        try:
            # Get subject with user_id filter
            subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
            if not subject_response.data:
                return {"error": "Subject not found"}
            
            subject = subject_response.data[0]
            
            # Extract data from request
            result_percentage = result_data.get("result_percentage")
            wrong_answers = result_data.get("wrong_answers", [])
            create_flashcards = result_data.get("create_flashcards_from_wrong", False)
            
            if result_percentage is None or not (0 <= result_percentage <= 100):
                return {"error": "Invalid result_percentage. Must be between 0-100"}
            
            # Store/update performance result
            existing_performance = supabase.table("performance").select("*").eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
            
            if existing_performance.data:
                performance_data = {
                    "mock_test": result_percentage,
                    "updated_at": "now()"
                }
                supabase.table("performance").update(performance_data).eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
            else:
                performance_data = {
                    "user_id": user_id,
                    "subject_id": subject["id"],
                    "subject_name": subject_name,
                    "mock_test": result_percentage
                }
                supabase.table("performance").insert(performance_data).execute()
            
            # Create flashcards from wrong answers if requested
            flashcard_result = None
            if create_flashcards and wrong_answers:
                flashcard_result = flashcard_service.create_flashcards_from_mock_test(
                    supabase, user_id, subject_name, wrong_answers
                )
            
            # Prepare response
            response_data = {
                "success": True,
                "message": f"Mock test result stored successfully for {subject_name}",
                "mock_test": result_percentage
            }
            
            if flashcard_result:
                if "error" in flashcard_result:
                    response_data["flashcard_status"] = "failed"
                    response_data["flashcard_error"] = flashcard_result["error"]
                else:
                    response_data["flashcard_status"] = "success"
                    response_data["flashcards_created"] = flashcard_result["flashcards_created"]
                    response_data["flashcard_message"] = flashcard_result["message"]
            
            return response_data
                
        except Exception as e:
            return {"error": f"Failed to store result: {str(e)}"}