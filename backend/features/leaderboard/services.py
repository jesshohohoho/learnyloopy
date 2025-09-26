from typing import List, Optional
from datetime import datetime, timedelta
from .schemas import TutorLeaderboardItem
from config.database import get_supabase

class LeaderboardService:
    def __init__(self):
        self.supabase = get_supabase()  # Use your existing setup
        self._cache = None
        self._cache_timestamp = None
        self._cache_duration = timedelta(weeks=1)  # Cache for 1 week
    
    def _is_cache_valid(self) -> bool:
        if not self._cache or not self._cache_timestamp:
            return False
        return datetime.now() - self._cache_timestamp < self._cache_duration
    
    async def get_top_tutors(self, force_refresh: bool = False) -> List[TutorLeaderboardItem]:
        """Get top tutors (up to 30) ranked by credits and avg_rating"""
        
        # Return cached data if valid and not forcing refresh
        if not force_refresh and self._is_cache_valid():
            return self._cache
        
        try:
            # Query tutors with credits > 0, ordered by credits DESC, avg_rating DESC
            # LIMIT 30 but if there are fewer tutors, it will return whatever exists
            response = self.supabase.table("tutors").select(
                "name, credits, teaching_style, avg_rating"
            ).gt("credits", 0).order("credits", desc=True).order("avg_rating", desc=True).limit(30).execute()
            
            if not response.data:
                return []
            
            # Add ranking - this will rank however many tutors we actually have
            leaderboard_data = []
            for index, tutor in enumerate(response.data, 1):
                leaderboard_data.append(
                    TutorLeaderboardItem(
                        rank=index,  # Rank 1, 2, 3... based on actual count
                        name=tutor["name"],
                        credits=tutor["credits"],
                        teaching_style=tutor["teaching_style"] or [],
                        avg_rating=float(tutor["avg_rating"] or 0.0)
                    )
                )
            
            # Update cache
            self._cache = leaderboard_data
            self._cache_timestamp = datetime.now()
            
            return leaderboard_data
            
        except Exception as e:
            print(f"Error fetching leaderboard: {e}")
            return []
    
    def get_cache_info(self) -> dict:
        """Get cache status information"""
        return {
            "has_cache": self._cache is not None,
            "cache_size": len(self._cache) if self._cache else 0,
            "last_updated": self._cache_timestamp.isoformat() if self._cache_timestamp else None,
            "is_valid": self._is_cache_valid()
        }

# Global instance
leaderboard_service = LeaderboardService()