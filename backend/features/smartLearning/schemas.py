from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
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

# BaseModel to let RAG-LLM accounts for historical chat in replies
class QuestionWithHistory(BaseModel):
    text: str
    subject: str
    conversation_history: Optional[List[Dict[str, Any]]] = []
