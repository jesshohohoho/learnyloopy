from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from config.database import get_supabase
from auth.dependencies import require_user_id
from .services import grade_predictor  


router = APIRouter(prefix="/past-performance", tags=["past-performance"])

@router.get("/performance/{subject_name}")
async def get_mock_test_result(subject_name: str, user_id: str = Depends(require_user_id)):
    """Get stored mock test result for a subject"""
    try:
        supabase = get_supabase()
        
        # Get subject with user_id filter
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        if not subject_response.data:
            return {"error": "Subject not found"}
        
        subject = subject_response.data[0]
        
        # Get performance record
        performance_response = supabase.table("performance").select("*").eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
        
        if performance_response.data:
            performance = performance_response.data[0]
            return {
                "success": True,
                "subject_name": performance["subject_name"],
                "test1": performance["test1"],
                "test2": performance["test2"],
                "assignment": performance["assignment"],
                "mock_test": performance["mock_test"],  # ✅ Fixed column name
                "total_study_hours": performance["total_study_hours"],
                "updated_at": performance["updated_at"]
            }
        else:
            return {"message": "No mock test result found for this subject"}
            
    except Exception as e:
        return {"error": f"Failed to get result: {str(e)}"}
    
@router.get("/performance/all")
async def get_all_performance_data(user_id: str = Depends(require_user_id)):
    """Get all performance results for the authenticated user"""
    try:
        supabase = get_supabase()
        
        performance_response = supabase.table("performance").select("*").eq("user_id", user_id).execute()
        
        if performance_response.data:
            results = []
            for performance in performance_response.data:
                results.append({
                    "subject_name": performance["subject_name"],
                    "test1": performance["test1"],
                    "test2": performance["test2"], 
                    "assignment": performance["assignment"],
                    "mock_test": performance["mock_test"],  # Fixed column name
                    "total_study_hours": performance["total_study_hours"],
                    "created_at": performance["created_at"],
                    "updated_at": performance["updated_at"]
                })
            return {"results": results}
        else:
            return {"results": []}
            
    except Exception as e:
        return {"error": f"Failed to get results: {str(e)}"}
    
@router.post("/performance/{subject_name}")
async def create_or_update_performance_record(subject_name: str, performance_data: dict, user_id: str = Depends(require_user_id)):
    """Create or update performance record for a subject (creates subject if doesn't exist)"""
    try:
        supabase = get_supabase()
        
        # Check if subject exists for this user
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        
        if not subject_response.data:
            # Subject doesn't exist - create it first
            subject_insert = supabase.table("subjects").insert({
                "name": subject_name,
                "user_id": user_id
            }).execute()
            
            if not subject_insert.data:
                return {"error": "Failed to create subject"}
            
            subject = subject_insert.data[0]
        else:
            # Subject exists
            subject = subject_response.data[0]
        
        # Prepare performance data
        perf_data = {
            "user_id": user_id,
            "subject_id": subject["id"],
            "subject_name": subject_name,
            "test1": performance_data.get("test1"),
            "test2": performance_data.get("test2"),
            "assignment": performance_data.get("assignment"),
            "mock_test": performance_data.get("mock_test"),
            "total_study_hours": performance_data.get("total_study_hours", 0.0)
        }
        
        # Check if performance record exists
        existing_perf = supabase.table("performance").select("*").eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
        
        if existing_perf.data:
            # Update existing performance record
            update_data = {key: value for key, value in perf_data.items() if key not in ["user_id", "subject_id"]}
            update_data["updated_at"] = "now()"
            response = supabase.table("performance").update(update_data).eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
            action = "updated"
        else:
            # Create new performance record
            response = supabase.table("performance").insert(perf_data).execute()
            action = "created"
        
        if response.data:
            return {"success": True, "message": f"Performance record {action} successfully", "data": response.data[0]}
        else:
            return {"error": "Failed to save performance record"}
            
    except Exception as e:
        return {"error": f"Failed to save performance record: {str(e)}"}

# Get subjects with performance data
@router.get("/subjects/with-performance")
async def get_subjects_with_performance(user_id: str = Depends(require_user_id)):
    """Get all subjects with their performance data for the user"""
    try:
        supabase = get_supabase()
        
        # Get all subjects for this user
        subjects_response = supabase.table("subjects").select("*").eq("user_id", user_id).execute()
        
        subjects_with_performance = []
        
        for subject in subjects_response.data:
            # Get performance data for each subject
            perf_response = supabase.table("performance").select("*").eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
            
            subject_data = {
                "id": subject["id"],
                "name": subject["name"],
                "created_at": subject["created_at"],
                "performance": perf_response.data[0] if perf_response.data else None
            }
            subjects_with_performance.append(subject_data)
        
        return {"success": True, "subjects": subjects_with_performance}
        
    except Exception as e:
        return {"error": f"Failed to get subjects: {str(e)}"}
    
# Delete performance record
@router.delete("/performance/{subject_name}")
async def delete_performance_record(subject_name: str, user_id: str = Depends(require_user_id)):
    """Delete performance record for a subject (keeps the subject)"""
    try:
        supabase = get_supabase()
        
        # Get subject with user_id filter
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        if not subject_response.data:
            return {"error": "Subject not found"}
        
        subject = subject_response.data[0]

        response = supabase.table("performance").delete().eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
        
        return {"success": True, "message": f"Performance data deleted for {subject_name}"}
            
    except Exception as e:
        return {"error": f"Failed to delete performance record: {str(e)}"}
    

@router.post("/performance/{subject_name}/predict-probability")
async def predict_grade_probability(
    subject_name: str, 
    request_data: dict,  # This will contain the desired_grade
    user_id: str = Depends(require_user_id)
):
    """Predict probability of achieving desired grade or better"""
    try:
        supabase = get_supabase()
        
        # Get desired grade from request
        desired_grade = request_data.get("desired_grade")
        if not desired_grade:
            return {"error": "desired_grade is required"}
        
        # Get subject with user_id filter
        subject_response = supabase.table("subjects").select("*").eq("name", subject_name).eq("user_id", user_id).execute()
        if not subject_response.data:
            return {"error": "Subject not found"}
        
        subject = subject_response.data[0]
        
        # Get performance data
        performance_response = supabase.table("performance").select("*").eq("user_id", user_id).eq("subject_id", subject["id"]).execute()
        
        if not performance_response.data:
            return {"error": "No performance data found for this subject"}
        
        performance = performance_response.data[0]
        
        # Make prediction using the ML model
        prediction_result = grade_predictor.probability_at_least(
            test1=performance["test1"],
            test2=performance["test2"],
            assignment=performance["assignment"],
            mock_test=performance["mock_test"],
            total_study_hours=performance["total_study_hours"],
            desired_grade=desired_grade
        )
        
        if "error" in prediction_result:
            return {"error": prediction_result["error"]}
        
        return {
            "success": True,
            "subject_name": subject_name,
            "desired_grade": desired_grade,
            "probability_at_least": prediction_result["probability_at_least"],
            "percentage": prediction_result["percentage"],
            "all_probabilities": prediction_result["all_probabilities"],
            "current_performance": performance,
            "message": f"Probability prediction completed for {subject_name}"
        }
        
    except Exception as e:
        return {"error": f"Failed to predict probability: {str(e)}"}

# Get available grades for dropdown
@router.get("/grades")
async def get_available_grades():
    """Get list of available grades for prediction"""
    return {
        "success": True,
        "grades": grade_predictor.grade_order
    }

@router.patch("/performance/{subject_name}/study-hours")
async def update_study_hours(
    subject_name: str, 
    hours_data: dict,  # {"additional_hours": 0.5}
    user_id: str = Depends(require_user_id)
):
    """Add study hours to a subject's performance record"""
    try:
        supabase = get_supabase()
        additional_hours = hours_data.get("additional_hours", 0)
        
        # Get subject first
        subject_response = supabase.table("subjects").select("id").eq("name", subject_name).eq("user_id", user_id).execute()
        if not subject_response.data:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        subject_id = subject_response.data[0]["id"]
        
        # Get current performance record
        perf_response = supabase.table("performance").select("total_study_hours").eq("user_id", user_id).eq("subject_id", subject_id).execute()
        
        if perf_response.data:
            # Update existing record
            current_hours = perf_response.data[0].get("total_study_hours", 0) or 0
            new_total = current_hours + additional_hours
            
            update_response = supabase.table("performance").update({
                "total_study_hours": new_total,
                "updated_at": "now()"
            }).eq("user_id", user_id).eq("subject_id", subject_id).execute()
            
            if update_response.data:
                return {
                    "success": True, 
                    "message": f"Added {additional_hours} study hours to {subject_name}",
                    "new_total": new_total
                }
        else:
            # Create new performance record
            insert_response = supabase.table("performance").insert({
                "user_id": user_id,
                "subject_id": subject_id,
                "subject_name": subject_name,
                "total_study_hours": additional_hours,
                "created_at": "now()",
                "updated_at": "now()"
            }).execute()
            
            if insert_response.data:
                return {
                    "success": True, 
                    "message": f"Created performance record with {additional_hours} study hours for {subject_name}",
                    "new_total": additional_hours
                }
        
        raise HTTPException(status_code=500, detail="Failed to update study hours")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update study hours: {str(e)}")
    

# Get performance metrics
@router.get("/analytics/summary")
async def get_performance_summary(user_id: str = Depends(require_user_id)):
    """Get performance summary: best subject, worst subject, avg study hours, avg mock test"""
    try:
        supabase = get_supabase()
        
        # Get all performance records for the user
        performance_response = supabase.table("performance").select("*").eq("user_id", user_id).execute()
        
        if not performance_response.data:
            return {
                "best_subject": {"name": "N/A", "score": 0},
                "worst_subject": {"name": "N/A", "score": 0},
                "avg_study_hours": 0,
                "avg_mock_test": 0
            }
        
        performances = performance_response.data
        
        # Calculate best and worst subjects based on (test1 + test2 + assignment)
        valid_subjects_for_scores = []
        for perf in performances:
            test1 = perf.get("test1")
            test2 = perf.get("test2") 
            assignment = perf.get("assignment")
            
            # Only include subjects where all three scores are not null/empty
            if test1 is not None and test2 is not None and assignment is not None:
                total_score = test1 + test2 + assignment
                valid_subjects_for_scores.append({
                    "name": perf["subject_name"],
                    "score": total_score
                })
        
        # Find best and worst subjects
        if valid_subjects_for_scores:
            best_subject = max(valid_subjects_for_scores, key=lambda x: x["score"])
            worst_subject = min(valid_subjects_for_scores, key=lambda x: x["score"])
        else:
            best_subject = {"name": "N/A", "score": 0}
            worst_subject = {"name": "N/A", "score": 0}
        
        # Calculate average study hours 
        valid_study_hours = [
            perf["total_study_hours"] for perf in performances 
            if perf.get("total_study_hours") is not None and perf["total_study_hours"] > 0
        ]
        avg_study_hours = sum(valid_study_hours) / len(valid_study_hours) if valid_study_hours else 0
        
        # Calculate average mock test score
        valid_mock_tests = [
            perf["mock_test"] for perf in performances 
            if perf.get("mock_test") is not None
        ]
        avg_mock_test = sum(valid_mock_tests) / len(valid_mock_tests) if valid_mock_tests else 0
        
        return {
            "success": True,
            "best_subject": best_subject,
            "worst_subject": worst_subject,
            "avg_study_hours": round(avg_study_hours, 1),
            "avg_mock_test": round(avg_mock_test, 1)
        }
        
    except Exception as e:
        return {"error": f"Failed to get performance summary: {str(e)}"}

    
