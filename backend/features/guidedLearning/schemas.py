from pydantic import BaseModel, Field
from typing import List, Optional
from typing import Literal
from datetime import datetime


class TutorInput(BaseModel):
    name: str
    subject: List[str]       # e.g., ['python', 'calculus', 'machine_learning']
    experience: int            # e.g., 3 (years)
    credits: int               # e.g., 450
    hourly_rate: float         # e.g., 25.50
    teaching_mode: List[Literal['Online', 'Physical']]   # e.g., ['virtual', 'physical']

class TutorResponse(BaseModel):
    id: int
    user_id: str
    name: str
    email: str
    teaching_style: List[str] = []
    subject: List[str]
    experience: int
    credits: int
    hourly_rate: float
    teaching_mode: List[Literal['Online', 'Physical']]
    avg_rating: float
    review_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # This is crucial!


class StudentRequirements(BaseModel):
    desired_teaching_style: List[str]
    subject: List[str]
    desired_teaching_mode: List[Literal['Online', 'Physical']]
    max_hourly_rate: float
    min_experience: int

class TutorReviewBase(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating must be between 1-5")
    comment: Optional[str] = None

class TutorReviewCreate(TutorReviewBase):
    tutor_id: int
    course_name: str
    

class TutorReviewResponse(BaseModel):
    id: int
    tutor_id: int
    reviewer_user_id: str
    course_name: str                   
    rating: int = Field(..., ge=1, le=5, description="Rating value 1-5")
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TutorWithKeywords(BaseModel):
    id: int
    name: str
    average_rating: float
    total_ratings: int
    top_keywords: List[str]  # 前5个关键词
