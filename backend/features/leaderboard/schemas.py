from pydantic import BaseModel
from typing import List, Optional

class TutorLeaderboardItem(BaseModel):
    rank: int
    name: str
    credits: int
    teaching_style: List[str]
    avg_rating: float

class LeaderboardResponse(BaseModel):
    success: bool
    data: List[TutorLeaderboardItem]
    total: int
    last_updated: Optional[str] = None