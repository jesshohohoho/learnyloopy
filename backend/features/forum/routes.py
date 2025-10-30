# features/forum/routes.py - With Supabase Authentication
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from config.database import get_supabase
from features.forum.schemas import (ForumQuestionCreate, ForumQuestionResponse, 
                            ForumQuestionWithComments, ForumCommentCreate, 
                            ForumCommentResponse)
from auth.dependencies import get_current_user, get_optional_user, require_user_id

router = APIRouter(prefix="/forum", tags=["forum"])

@router.get("/questions", response_model=List[ForumQuestionResponse])
async def list_all_questions(user: dict = Depends(get_optional_user)):
    """
    Get all questions in the forum, ordered by creation date (newest first)
    """
    try:
        supabase = get_supabase()
        response = supabase.table("forum_questions").select("*").order("created_at", desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")


@router.post("/questions", response_model=ForumQuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: ForumQuestionCreate, 
    user: dict = Depends(get_current_user)
):
    """
    Create a new question in the forum - Requires authentication
    """
    try:
        supabase = get_supabase()
        
        # Validate user data
        user_id = user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="User ID missing from authentication payload"
            )
        
        # Get display name with proper fallback
        display_name = (
            user.get("user_metadata", {}).get("display_name") or 
            user.get("display_name") or 
            user.get("email") or 
            "Anonymous"
        )
        
        # Convert Pydantic model to dict and add user info
        question_dict = question_data.dict()
        question_dict["user_id"] = user_id
        question_dict["display_name"] = display_name

        response = supabase.table("forum_questions").insert(question_dict).execute()
        
        # Check if insertion was successful
        if not response.data or len(response.data) == 0:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Failed to create question - no data returned"
            )
        
        created_question = response.data[0]
        return created_question
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/questions/{question_id}", response_model=ForumQuestionWithComments)
async def get_question_with_comments(
    question_id: int,
    user: dict = Depends(get_optional_user)
):
    """
    Get a specific question with all its comments - Public endpoint
    """
    try:
        supabase = get_supabase()
        
        # Get question with comments using join
        response = supabase.table("forum_questions").select(
            "*, forum_comments(*)"
        ).eq("id", question_id).single().execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        return response.data
        
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail="Question not found")
        raise HTTPException(status_code=500, detail=f"Error fetching question: {str(e)}")

@router.post("/questions/{question_id}/comments", response_model=ForumCommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment_to_question(
    question_id: int, 
    comment_data: ForumCommentCreate,
    user: dict = Depends(get_current_user)
):
    """
    Add a new comment to a specific question - Requires authentication
    """
    try:
        print(f"=== DEBUG: Starting comment creation ===")
        print(f"Question ID: {question_id}")
        print(f"Comment data: {comment_data.dict()}")
        print(f"User: {user}")
        
        supabase = get_supabase()
        print("✓ Supabase client initialized")
        
        # Check if question exists first
        print(f"Checking if question {question_id} exists...")
        question_check = supabase.table("forum_questions").select("id").eq("id", question_id).execute()
        print(f"Question check response: {question_check}")
        
        if not question_check.data:
            print("❌ Question not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        print("✓ Question exists")
        
        # Create comment data with user info
        comment_dict = comment_data.dict()
        comment_dict["question_id"] = question_id
        
        # Safe user ID extraction
        user_id = user.get("user_id")
        if not user_id:
            print("❌ User ID missing")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="User ID missing from authentication payload"
            )
        comment_dict["user_id"] = user_id
        
        # Safe display name extraction
        display_name = (
            user.get("user_metadata", {}).get("display_name") or 
            user.get("display_name") or 
            user.get("email") or 
            "Anonymous"
        )
        comment_dict["display_name"] = display_name
        
        print(f"Final comment_dict: {comment_dict}")
        
        print("Attempting to insert comment...")
        response = supabase.table("forum_comments").insert(comment_dict).execute()
        print(f"Insert response: {response}")
        
        if response.data:
            print("✓ Comment created successfully")
            return response.data[0]
        else:
            print("❌ No data returned from insert")
            raise HTTPException(status_code=400, detail="Failed to create comment")
            
    except HTTPException as he:
        print(f"HTTPException: {he.detail}")
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error creating comment: {str(e)}")

@router.get("/questions/subject/{subject}", response_model=List[ForumQuestionResponse])
async def get_questions_by_subject(
    subject: str,
    user: dict = Depends(get_optional_user)
):
    """
    Get all questions filtered by subject - Public endpoint
    """
    try:
        supabase = get_supabase()
        
        # Use ilike for case-insensitive search
        response = supabase.table("forum_questions").select("*").ilike(
            "subject", f"%{subject}%"
        ).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")

@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: int,
    user: dict = Depends(get_current_user)
):
    """
    Delete a question - Only the owner or admin can delete
    """
    try:
        supabase = get_supabase()
        
        # Check if question exists and get owner info
        question_check = supabase.table("forum_questions").select("id, user_id").eq("id", question_id).execute()
        if not question_check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        question_owner = question_check.data[0]["user_id"]
        
        # Check if user is the owner (you can add admin role check here later)
        if question_owner != user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own questions"
            )
        
        # Delete question (CASCADE will delete related comments and likes)
        response = supabase.table("forum_questions").delete().eq("id", question_id).execute()
        
        return {"message": "Question deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting question: {str(e)}")

@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    user: dict = Depends(get_current_user)
):
    """
    Delete a specific comment - Only the owner can delete
    """
    try:
        supabase = get_supabase()
        
        # Check if comment exists and get owner info
        comment_check = supabase.table("forum_comments").select("id, user_id").eq("id", comment_id).execute()
        if not comment_check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )
        
        comment_owner = comment_check.data[0]["user_id"]
        
        # Check if user is the owner
        if comment_owner != user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own comments"
            )
        
        response = supabase.table("forum_comments").delete().eq("id", comment_id).execute()
        
        return {"message": "Comment deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")

@router.get("/trending", response_model=List[dict])
async def get_trending_topics(user: dict = Depends(get_optional_user)):
    """
    Get top 3 trending questions based on likes and comments count - Public endpoint
    """
    try:
        supabase = get_supabase()
        
        # Get questions ordered by likes, then add comment count
        questions_response = supabase.table("forum_questions").select(
            "id, subject, question, display_name, created_at, likes"
        ).order("likes", desc=True).order("created_at", desc=True).limit(3).execute()
        
        trending_topics = []
        
        for question in questions_response.data or []:
            # Get comment count for each question
            comment_count_response = supabase.table("forum_comments").select(
                "id", count="exact"
            ).eq("question_id", question["id"]).execute()
            
            comment_count = comment_count_response.count or 0
            
            trending_topics.append({
                "id": question["id"],
                "subject": question["subject"],
                "question": question["question"],
                "display_name": question["display_name"],
                "created_at": question["created_at"],
                "likes": question["likes"] or 0,
                "comments": comment_count,
                "total_engagement": (question["likes"] or 0) + comment_count
            })
        
        # Sort by total engagement
        trending_topics.sort(key=lambda x: x["total_engagement"], reverse=True)
        
        return trending_topics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending topics: {str(e)}")

@router.post("/questions/{question_id}/like")
async def toggle_like(
    question_id: int,
    user_id: str = Depends(require_user_id)
):
    try:
        supabase = get_supabase()
        
        # Check if question exists and get current likes count
        question_check = supabase.table("forum_questions").select("id, likes").eq("id", question_id).execute()
        print(f"Question check: {question_check.data}")
        
        if not question_check.data:
            raise HTTPException(status_code=404, detail="Question not found")
        
        current_likes = question_check.data[0]["likes"] or 0

        # Check if user already liked this question
        existing_like = supabase.table("forum_likes").select("id").eq(
            "question_id", question_id
        ).eq("user_id", user_id).execute()
       
        if existing_like.data:
            # User already liked - REMOVE the like
            print(f"User already liked, removing like...")
            
            # 1. Delete from forum_likes table
            delete_result = supabase.table("forum_likes").delete().eq(
                "question_id", question_id
            ).eq("user_id", user_id).execute()
            print(f"Delete result: {delete_result}")
            
            # 2. Decrease likes count in forum_questions
            new_likes = max(current_likes - 1, 0)
            print(f"Updating likes from {current_likes} to {new_likes}")
            
            update_result = supabase.table("forum_questions").update({
                "likes": new_likes
            }).eq("id", question_id).execute()
            print(f"Update result: {update_result}")
       
            return {"message": "Like removed", "liked": False, "total_likes": new_likes}
            
        else:
            # User hasn't liked yet - ADD the like
            print(f"User hasn't liked yet, adding like...")
            
            # 1. Insert into forum_likes table
            like_data = {
                "question_id": question_id,
                "user_id": user_id
            }
            print(f"Insert data: {like_data}")
            insert_result = supabase.table("forum_likes").insert(like_data).execute()
            print(f"Insert result: {insert_result}")

            # 2. Increase likes count in forum_questions
            new_likes = current_likes + 1
            print(f"Updating likes from {current_likes} to {new_likes}")
            
            update_result = supabase.table("forum_questions").update({
                "likes": new_likes
            }).eq("id", question_id).execute()
            print(f"Update result: {update_result}")

            return {"message": "Question liked", "liked": True, "total_likes": new_likes}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error toggling like: {str(e)}")
    
@router.get("/questions/{question_id}/stats")
async def get_question_stats(
    question_id: int,
    user: dict = Depends(get_optional_user)
):
    """
    Get engagement statistics for a question - Public endpoint
    """
    try:
        
        supabase = get_supabase()
        
        # Check if question exists and get likes from the cached count
        question_response = supabase.table("forum_questions").select(
            "id, likes"
        ).eq("id", question_id).single().execute()
        
        if not question_response.data:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # Get comment count
        comment_count_response = supabase.table("forum_comments").select(
            "id", count="exact"
        ).eq("question_id", question_id).execute()
        
        return {
            "question_id": question_id,
            "likes": question_response.data["likes"] or 0,
            "comments": comment_count_response.count or 0,
            "views": 0  # You can implement view tracking separately
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching question stats: {str(e)}")

# Bonus: Add endpoint to get user's own questions
@router.get("/my-questions", response_model=List[ForumQuestionResponse])
async def get_my_questions(user_id: str = Depends(require_user_id)):
    """
    Get all questions created by the authenticated user
    """
    try:
        supabase = get_supabase()
        response = supabase.table("forum_questions").select("*").eq(
            "user_id", user_id
        ).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching your questions: {str(e)}")
    
@router.post("/comments/{comment_id}/like")
async def toggle_comment_like(
    comment_id: int,
    user_id: str = Depends(require_user_id)
):
    """
    Toggle like/unlike for a specific comment
    """
    try:
        supabase = get_supabase()
        
        # Check if comment exists and get current likes count
        comment_check = supabase.table("forum_comments").select("id, likes, user_id").eq("id", comment_id).execute()

        if not comment_check.data:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        comment_data = comment_check.data[0]
        current_likes = comment_check.data[0]["likes"] or 0
        # get who creates the comment
        comment_author_id = comment_data["user_id"]
        # check whether the comment is from the current user
        is_own_comment = (comment_author_id == user_id)

        # Check if user already liked this comment
        existing_like = supabase.table("forum_comment_likes").select("id").eq(
            "comment_id", comment_id
        ).eq("user_id", user_id).execute()
       
        if existing_like.data:
            # If user already liked, remove the like
  
            delete_result = supabase.table("forum_comment_likes").delete().eq(
                "comment_id", comment_id
            ).eq("user_id", user_id).execute()
            
            new_likes = max(current_likes - 1, 0)
          
            supabase.table("forum_comments").update({
                "likes": new_likes
            }).eq("id", comment_id).execute()


            # Only update tutor credits if the comment is not from the current user
            if not is_own_comment:
                await update_tutor_credits_for_user(supabase, comment_author_id)
       
            return {"message": "Comment like removed", "liked": False, "total_likes": new_likes}
            
        else:
            # If user hasn't liked yet, add the like
            like_data = {"comment_id": comment_id, "user_id": user_id}
            supabase.table("forum_comment_likes").insert(like_data).execute()

            new_likes = current_likes + 1
            
            # Update comments table likes count
            supabase.table("forum_comments").update({
                "likes": new_likes
            }).eq("id", comment_id).execute()

            # Only update tutor credits if the comment is not from the current user
            if not is_own_comment:
                await update_tutor_credits_for_user(supabase, comment_author_id)

            return {"message": "Comment liked", "liked": True, "total_likes": new_likes}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error toggling comment like: {str(e)}")

@router.get("/comments/{comment_id}/stats")
async def get_comment_stats(
    comment_id: int,
    user: dict = Depends(get_optional_user)
):
    """
    Get engagement statistics for a comment
    """
    try:
        supabase = get_supabase()
        
        # Check if comment exists and get likes from the cached count
        comment_response = supabase.table("forum_comments").select(
            "id, likes"
        ).eq("id", comment_id).single().execute()
        
        if not comment_response.data:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        return {
            "comment_id": comment_id,
            "likes": comment_response.data["likes"] or 0
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comment stats: {str(e)}")

# update tutors' credits when their comments are liked
async def update_tutor_credits_for_user(supabase, user_id):
    """Update tutor credits based on total likes from all their comments"""
    try:
        # Check if user is a tutor
        tutor_check = supabase.table("tutors").select("id").eq("user_id", user_id).execute()
        
        if not tutor_check.data:
            # User is not a tutor, skip credit update
            return
        
        # Calculate total likes for all comments by this tutor
        comments_response = supabase.table("forum_comments").select(
            "likes"
        ).eq("user_id", user_id).execute()
        
        total_likes = sum(comment.get("likes", 0) for comment in comments_response.data)
        
        # Update tutor credits (1 credit per like)
        supabase.table("tutors").update({
            "credits": total_likes,  # Direct assignment since we're calculating total
            "updated_at": "now()"
        }).eq("user_id", user_id).execute()
        
        print(f"Updated tutor {user_id} credits to {total_likes}")
        
    except Exception as e:
        print(f"Error updating tutor credits: {e}")