from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Base schemas for forum questions
class ForumQuestionBase(BaseModel):
    subject: str
    question: str

class ForumQuestionCreate(ForumQuestionBase):
    pass

class ForumQuestionResponse(ForumQuestionBase):
    id: int  # Changed from int to UUID to match database
    user_id: str
    display_name: Optional[str] = None  # Will be populated from JWT/database
    likes: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Base schemas for comments
class ForumCommentBase(BaseModel):
    comment: str

class ForumCommentCreate(ForumCommentBase):
    pass

class ForumCommentResponse(ForumCommentBase):
    id: int  # Changed from int to UUID
    question_id: int  # Changed from int to UUID
    user_id: str
    display_name: Optional[str] = None  # Will be populated from JWT/database
    likes: Optional[int]=0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Schema for question with comments
class ForumQuestionWithComments(ForumQuestionResponse):
    forum_comments: List[ForumCommentResponse] = []

# Schema for like operations
class LikeResponse(BaseModel):
    message: str
    liked: bool
    likes_count: int

# Schema for question statistics
class QuestionStats(BaseModel):
    question_id: int  # Changed from int to UUID
    likes: int
    comments: int
    views: int = 0