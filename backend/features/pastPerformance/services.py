import joblib
import pandas as pd
from pathlib import Path
import os

class GradePredictionService:
    def __init__(self):
        # Path to model.pkl file
        self.model_path = Path(__file__).parent / "models" / "model.pkl"
        self.model = None
        self.features = None
        # Grade order from best to worst
        self.grade_order = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]
        self.load_model()
    
    def load_model(self):
        """Load the trained model and features from pickle file"""
        try:
            if os.path.exists(self.model_path):
                # Load model data 
                data = joblib.load(self.model_path)
                self.model = data["model"]
                self.features = data["features"]
                print(f"✅ Model loaded successfully from {self.model_path}")
                print(f"✅ Features: {self.features}")
                print(f"✅ Model classes: {self.model.classes_}")
            else:
                print(f"❌ Model file not found at {self.model_path}")
                self.model = None
                self.features = None
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            self.model = None
            self.features = None
    
    def probability_at_least(self, test1, test2, assignment, mock_test, total_study_hours, desired_grade):
        """
        Compute probability of achieving desired grade or better (same as your notebook function)
        
        Args:
            test1: Test 1 score (0-20)
            test2: Test 2 score (0-20) 
            assignment: Assignment score (0-20)
            mock_test: Mock test percentage (0-100)
            total_study_hours: Total study hours
            desired_grade: Target grade (e.g., "B+", "C", etc.)
            
        Returns:
            dict: Probability result
        """
        if self.model is None or self.features is None:
            return {"error": "Model not loaded"}
        
        if desired_grade not in self.grade_order:
            return {"error": f"Invalid desired grade. Must be one of: {self.grade_order}"}
        
        try:
            # Handle None/null values - replace with 0
            test1 = test1 if test1 is not None else 0
            test2 = test2 if test2 is not None else 0
            assignment = assignment if assignment is not None else 0
            mock_test = mock_test if mock_test is not None else 0
            total_study_hours = total_study_hours if total_study_hours is not None else 0
            
            # Create input dictionary matching your model's feature names
            sample_input = {
                "Test 1": test1,
                "Test 2": test2,
                "Assignment": assignment,
                "Study Hour": total_study_hours,
                "Mock Test": mock_test
            }
            
            input_data = [sample_input[feat] for feat in self.features]
            input_df = pd.DataFrame([input_data], columns=self.features)

            # Predict probabilities
            probs = self.model.predict_proba(input_df)[0]
            grade_probs = dict(zip(self.model.classes_, probs))
            
            # Sum probabilities for grades at least as good as desired (same logic as your notebook)
            prob_at_least = sum(
                grade_probs.get(grade, 0) 
                for grade in self.grade_order 
                if self.grade_order.index(grade) <= self.grade_order.index(desired_grade)
            )
            
            return {
                "probability_at_least": prob_at_least,
                "desired_grade": desired_grade,
                "percentage": prob_at_least * 100,
                "all_probabilities": grade_probs,
                "input_data": sample_input
            }
            
        except Exception as e:
            return {"error": f"Probability calculation failed: {str(e)}"}

# Create global instance
grade_predictor = GradePredictionService()