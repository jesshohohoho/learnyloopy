from pydantic import BaseModel, Field
from typing import List, Optional
from typing import Literal
from datetime import datetime

class FlashcardInput(BaseModel):
    subject: str
    question: str
    answer: str

class ReviewRequest(BaseModel):
    rating: int

class Question(BaseModel):
    text: str
    subject: str

