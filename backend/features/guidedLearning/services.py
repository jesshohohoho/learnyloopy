# features/guidedLearning/services.py - Simple Supabase conversion (Traditional approach)
from features.guidedLearning.schemas import StudentRequirements
from config.database import get_supabase
import re
from collections import Counter
from typing import List, Dict, Optional
import nltk
from nltk.corpus import stopwords
import numpy as np
from typing import List, Dict

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# --- Update tutor avg rating (Traditional approach) ---

def update_tutor_rating(tutor_id: int):
    """
    Manually calculate and update tutor's average rating (traditional approach)
    """
    try:
        supabase = get_supabase()
        
        # Get all reviews for this tutor
        reviews_response = supabase.table("tutor_reviews").select(
            "rating"
        ).eq("tutor_id", tutor_id).execute()
        
        if not reviews_response.data:
            avg_rating, review_count = 0.0, 0
        else:
            ratings = [review["rating"] for review in reviews_response.data]
            avg_rating = sum(ratings) / len(ratings)
            review_count = len(ratings)
        
        # Update tutor table
        supabase.table("tutors").update({
            "avg_rating": avg_rating,
            "review_count": review_count
        }).eq("id", tutor_id).execute()
        
        return avg_rating, review_count
        
    except Exception as e:
        print(f"Error updating tutor rating: {e}")
        return 0.0, 0

# --- Teaching Style Classification ---
# use lazy loading to save memory
_classifier = None
_classifier_loaded = False

class MLTeachingStyleClassifier:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.stop_words.update(['tutor', 'teacher', 'teaching', 'class', 'lesson', 'subject', 'thank', 'thanks'])
        
        self.style_categories = [
            "communication", "engagement", "structure", "support", 
            "expertise", "adaptability", "feedback"            
        ]
        
        # only load when needed
        self.classifier = None

    def _load_classifier(self):
        """Load classifier only when first needed"""
        global _classifier, _classifier_loaded
        
        if _classifier_loaded:
            self.classifier = _classifier
            return
        
        print("Loading classification model...")
        
        try:
            from transformers.pipelines import pipeline
            import torch
            
            _classifier = pipeline(
                "zero-shot-classification",
                model="typeform/distilbert-base-uncased-mnli",  
                device=-1  # Force CPU to save memory
            )
            self.classifier = _classifier
            _classifier_loaded = True
            print("Classification model loaded successfully!")
            
        except Exception as e:
            print(f"Classification model loading failed: {e}")
            _classifier_loaded = True  
            self.classifier = None

    def classify_with_ml(self, text: str) -> List[str]:
        if not text:
            return self.fallback_classification(text)
        
        # Load classifier only when needed
        if not _classifier_loaded:
            self._load_classifier()
        
        if not self.classifier:
            return self.fallback_classification(text)
        
        try:
            result = self.classifier(
                text,
                candidate_labels=self.style_categories,
                multi_label=True,
                hypothesis_template="This tutor is {} in their teaching style.",
            )

            if not result or 'labels' not in result or 'scores' not in result:
                return self.fallback_classification(text)

            top_categories = []
            for label, score in zip(result['labels'], result['scores']):
                if score > 0.3 and len(top_categories) < 3:
                    top_categories.append(label)

            return top_categories

        except Exception as e:
            print(f"ML Classification error: {e}")
            return self.fallback_classification(text)
        
    def fallback_classification(self, text: str) -> List[str]:
        if not text:
            return []
            
        keywords = self.extract_keywords(text)
        
        keyword_to_category = {
            # Communication
            "clear": "communication", "explains": "communication", "patient": "communication",
            # Engagement  
            "engaging": "engagement", "fun": "engagement", "interesting": "engagement",
            # Structure
            "organized": "structure", "structured": "structure", "prepared": "structure",
            # Support
            "helpful": "support", "supportive": "support", "encouraging": "support",
            # Expertise
            "knowledgeable": "expertise", "expert": "expertise", "experienced": "expertise",
        }
        
        categories = set()
        for keyword in keywords:
            if keyword in keyword_to_category:
                categories.add(keyword_to_category[keyword])
                if len(categories) >= 3:
                    break
        
        return list(categories)
    
    def get_teaching_style_traits(self, text: str) -> List[str]:
        return self.classify_with_ml(text)

    def extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        if not text:
            return []
        
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        word_counts = Counter(word for word in words if word not in self.stop_words)
        return [word for word, count in word_counts.most_common(top_n)]

ml_teaching_classifier = MLTeachingStyleClassifier()

def update_tutor_keywords(tutor_id: int):
    """
    Update tutor teaching style based on reviews (Traditional approach)
    """
    try:
        supabase = get_supabase()
        
        # Get all comments for this tutor
        reviews_response = supabase.table("tutor_reviews").select(
            "comment"
        ).eq("tutor_id", tutor_id).neq("comment", None).execute()

        if not reviews_response.data:
            return []

        # Get all comments
        all_comments = [review["comment"] for review in reviews_response.data if review["comment"]]
        
        if not all_comments:
            return []
        
        # Use ML to get teaching style
        all_text = " ".join(all_comments)
        teaching_style_traits = ml_teaching_classifier.get_teaching_style_traits(all_text)

        # Update tutor's teaching style
        supabase.table("tutors").update({
            "teaching_style": teaching_style_traits
        }).eq("id", tutor_id).execute()

        return teaching_style_traits
        
    except Exception as e:
        print(f"Error updating tutor keywords: {e}")
        return []

# --- Student-tutor matching (Keep your existing logic) ---

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    v1, v2 = np.array(vec1), np.array(vec2)
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0.0
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def style_similarity(student_styles: List[str], tutor_styles: List[str]) -> float:
    """Calculate teaching style similarity (same as your intersection_similarity)"""
    if not student_styles:
        return 1.0
    matches = len(set(student_styles) & set(tutor_styles))
    return matches / len(student_styles)

def vectorize_tutor(tutor_data: dict, req: StudentRequirements) -> List[float]:
    """Convert tutor data to normalized vector"""
    # Normalize rate relative to student's budget (closer to 0 cost = better)
    rate = 1.0 - (tutor_data["hourly_rate"] / req.max_hourly_rate)
    rate = max(rate, 0.0)
    
    # Normalize experience (cap at 20 years)
    exp = min(tutor_data["experience"] / 20, 1.0)
    
    # Normalize credits (cap at 1000 credits)
    credits = min(tutor_data["credits"] / 1000, 1.0)
    
    return [rate, exp, credits]

def vectorize_optimum() -> List[float]:
    """Student's ideal scenario: cheapest rate, max experience, max credits"""
    return [1.0, 1.0, 1.0]

def calculate_similarity(tutor_data: dict, req: StudentRequirements, 
                        style_weight: float = 0.1, numeric_weight: float = 0.9) -> float:
    """
    New cosine similarity approach - replaces your old weighted system
    """
    
    # Hard filters (same as before)
    if tutor_data["experience"] < req.min_experience:
        return 0.0
    if tutor_data["hourly_rate"] > req.max_hourly_rate:
        return 0.0
    if not any(mode in tutor_data["teaching_mode"] for mode in req.desired_teaching_mode):
        return 0.0
    if not any(subject in tutor_data["subject"] for subject in req.subject):
        return 0.0

    # Calculate teaching style similarity (same logic as your intersection_similarity)
    style_score = style_similarity(req.desired_teaching_style, 
                                 tutor_data.get("teaching_style", []))
    
    # Calculate numeric similarity using cosine similarity
    tutor_vec = vectorize_tutor(tutor_data, req)
    optimum_vec = vectorize_optimum()
    base_score = cosine_similarity(tutor_vec, optimum_vec)
    
    # Combine style and numeric scores
    final_score = numeric_weight * base_score + style_weight * style_score
    
    return min(final_score, 1.0)

def rank_tutors(tutors: List[Dict], student_req: StudentRequirements) -> Dict:
    """
    Rank tutors and provide different sorting options
    """
    # Filter tutors that pass hard requirements
    filtered = []
    for tutor in tutors:
        if calculate_similarity(tutor, student_req) > 0:  # Passes hard filters
            filtered.append(tutor)
    
    # Calculate similarity scores
    results = []
    for tutor in filtered:
        score = calculate_similarity(tutor, student_req)
        results.append({
            "tutor_data": tutor,
            "name": tutor.get("name", "Unknown"),
            "similarity": score,
            "rate": tutor["hourly_rate"],
            "experience": tutor["experience"],
            "credits": tutor["credits"]
        })
    
    if not results:
        return {
            "best_similarity": [],
            "best_price": None,
            "best_experience": None,
            "best_credits": None
        }
    
    # Different ranking strategies
    best_similarity = sorted(results, key=lambda x: x["similarity"], reverse=True)
    best_price = min(results, key=lambda x: x["rate"])
    best_experience = max(results, key=lambda x: x["experience"])
    best_credits = max(results, key=lambda x: x["credits"])
    
    return {
        "best_similarity": best_similarity,   # Full sorted list
        "best_price": best_price,             # Single best by price
        "best_experience": best_experience,   # Single best by experience  
        "best_credits": best_credits          # Single best by credits
    }

# --- Simple Review Service (Traditional approach) ---

class TutorReviewService:
    @staticmethod
    def create_review(tutor_id: int, reviewer_user_id: str, course_name: str, rating: int, comment: str = None):
        """
        Create review and manually update tutor stats
        """
        supabase = get_supabase()
        
        # 1. Create the review
        review_data = {
            "tutor_id": tutor_id,
            "reviewer_user_id": reviewer_user_id,
            "course_name": course_name,
            "rating": rating,
            "comment": comment
        }
        
        response = supabase.table("tutor_reviews").insert(review_data).execute()
        
        if not response.data:
            raise Exception("Failed to create review")
        
        # 2. Manually update tutor stats (traditional approach)
        update_tutor_rating(tutor_id)  # Updated to use tutor_id
        update_tutor_keywords(tutor_id)  # Updated to use tutor_id
        
        return response.data[0]