from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from .schemas import (
    TutorInput, TutorResponse, StudentRequirements,
    TutorReviewCreate, TutorReviewResponse
)
from auth.dependencies import get_current_user, get_optional_user
from config.database import get_supabase
from features.guidedLearning.services import TutorReviewService, calculate_similarity, rank_tutors
from typing import Optional

router = APIRouter(prefix="/guided-learning", tags=["guided-learning"])

@router.post("/add-review", response_model=TutorReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: TutorReviewCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new tutor review (authenticated users only)
    """
    try:
        # Check if user already reviewed this tutor for this course
        supabase = get_supabase()
        existing_review = supabase.table("tutor_reviews").select("id").eq(
            "tutor_id", review_data.tutor_id
        ).eq(
            "reviewer_user_id", current_user["user_id"]
        ).eq(
            "course_name", review_data.course_name
        ).execute()
        
        if existing_review.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reviewed this tutor for this course"
            )
        
        # Create review using updated service
        review = TutorReviewService.create_review(
            tutor_id=review_data.tutor_id,
            reviewer_user_id=current_user["user_id"],
            course_name=review_data.course_name,
            rating=review_data.rating,
            comment=review_data.comment
        )
        return review
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating review: {str(e)}")

@router.get("/tutor/{tutor_id}/reviews", response_model=List[TutorReviewResponse])
async def get_tutor_reviews(tutor_id: int):
    """
    Get all reviews for a specific tutor
    """
    try:
        supabase = get_supabase()
        
        response = supabase.table("tutor_reviews").select("*").eq(
            "tutor_id", tutor_id
        ).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reviews: {str(e)}")

@router.post("/find-tutor/", response_model=List[TutorResponse])
async def find_tutor(requirement: StudentRequirements, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Find tutors matching student requirements
    """
    try:
        supabase = get_supabase()

        # Get all tutors
        tutors_response = supabase.table("tutors").select("*").execute()
        
        if not tutors_response.data:
            return []
        
        scored_tutors = []
        for tutor_data in tutors_response.data:
       
            score = calculate_similarity(tutor_data, requirement)
   
            if score > 0:
                scored_tutors.append((tutor_data, score))

        # Sort by score (highest first)
        scored_tutors.sort(key=lambda x: x[1], reverse=True)

        # Return just the tutor data
        result_tutors = [tutor_data for tutor_data, score in scored_tutors]
      
        return result_tutors
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding tutors: {str(e)}")

# find and rank tutors by different strategies
@router.post("/find-tutor/ranked/", response_model=dict)
async def find_tutor_ranked(requirement: StudentRequirements, current_user: Dict[str, Any] = Depends(get_current_user)):
   
    try:
        supabase = get_supabase()
        
        tutors_response = supabase.table("tutors").select("*").execute()
        
        if not tutors_response.data:
            return {
                "best_similarity": [],
                "best_price": [],
                "best_experience": [],
                "best_credits": []
            }
        
        rankings = rank_tutors(tutors_response.data, requirement)
        
        return rankings
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding tutors: {str(e)}")

@router.get("/tutors/", response_model=List[TutorResponse])
async def get_all_tutors(
    limit: Optional[int] = None,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Get all tutors, sorted by rating and credits"""
    try:
        supabase = get_supabase()
        
        query = supabase.table("tutors").select("*").order(
            "avg_rating", desc=True
        ).order("credits", desc=True)
        
        if limit:
            query = query.limit(limit)
            
        response = query.execute()
        return response.data if response.data else []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tutors: {str(e)}")

# only authenticated users can register to become a tutor
@router.post("/add_tutor/", response_model=TutorResponse)
async def add_tutor(
    input_data: TutorInput,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
 
    try:
        supabase = get_supabase()
        
        # Check if user already has a tutor profile
        existing_profile = supabase.table("tutors").select("id").eq(
            "user_id", current_user["user_id"]
        ).execute()
        
        if existing_profile.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a tutor profile"
            )
        
        # Create tutor profile with user info from authentication
        tutor_data = {
            "user_id": current_user["user_id"],
            "name": input_data.name,
            "email": current_user.get("email", ""),
            "teaching_mode": input_data.teaching_mode,
            "subject": input_data.subject,
            "experience": input_data.experience,
            "credits": input_data.credits,
            "hourly_rate": input_data.hourly_rate,
            "avg_rating": 0.0,  # Default
            "review_count": 0,  # Default
            "teaching_style": []  # Default
        }
        
        response = supabase.table("tutors").insert(tutor_data).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Failed to create tutor")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating tutor: {str(e)}")
    
@router.get("/subjects/", response_model=List[str])
async def get_available_subjects(current_user: Dict[str, Any] = Depends(get_optional_user)):
    """
    Get all unique subjects taught by tutors
    """
    try:
        supabase = get_supabase()
        
        # Get all tutors with their subjects
        response = supabase.table("tutors").select("subject").execute()
        
        if not response.data:
            return []
        
        # Extract unique subjects from all tutors
        all_subjects = set()
        for tutor in response.data:
            if tutor.get("subject"):
                # Assuming subject is stored as a list
                if isinstance(tutor["subject"], list):
                    all_subjects.update(tutor["subject"])
                else:
                    # If subject is stored as a string
                    all_subjects.add(tutor["subject"])
        
        # Return sorted list of unique subjects
        return sorted(list(all_subjects))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching subjects: {str(e)}")
    
@router.get("/teaching-styles/", response_model=List[str])
async def get_available_teaching_styles(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get all unique teaching styles from tutors
    """
    try:
        supabase = get_supabase()
        
        # Get all tutors with their teaching styles
        response = supabase.table("tutors").select("teaching_style").execute()
        
        if not response.data:
            return []
        
        # Extract unique teaching styles from all tutors
        all_teaching_styles = set()
        for tutor in response.data:
            if tutor.get("teaching_style"):
                # Assuming teaching_style is stored as a list
                if isinstance(tutor["teaching_style"], list):
                    all_teaching_styles.update(tutor["teaching_style"])
                else:
                    # If teaching_style is stored as a string
                    all_teaching_styles.add(tutor["teaching_style"])
        
        # Return sorted list of unique teaching styles
        return sorted(list(all_teaching_styles))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching teaching styles: {str(e)}")
    
@router.get("/tutors/{tutor_id}/details/")
async def get_tutor_details(
    tutor_id: int,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """
    Get detailed tutor information including latest review
    """
    try:
        supabase = get_supabase()
        
        # Get tutor basic info
        tutor_response = supabase.table("tutors").select("*").eq("id", tutor_id).execute()
        
        if not tutor_response.data:
            raise HTTPException(status_code=404, detail="Tutor not found")
        
        tutor = tutor_response.data[0]
        
        # Get latest review comment
        latest_review_response = supabase.table("tutor_reviews").select("comment, created_at").eq(
            "tutor_id", tutor_id
        ).order("created_at", desc=True).limit(1).execute()
        
        latest_review_comment = ""
        if latest_review_response.data and latest_review_response.data[0]["comment"]:
            latest_review_comment = latest_review_response.data[0]["comment"]
        
        # Combine all data
        tutor_details = {
            **tutor,
            "average_rating": float(tutor["avg_rating"]) if tutor["avg_rating"] else 0.0,
            "latest_review": latest_review_comment or "No review yet."
        }
        
        return tutor_details
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tutor details: {str(e)}")