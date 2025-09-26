from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from .services import leaderboard_service
from .schemas import LeaderboardResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/tutors", response_model=LeaderboardResponse)
async def get_tutors_leaderboard(refresh: Optional[bool] = Query(False, description="Force refresh cache")):
    """
    Get top 30 tutors leaderboard ranked by credits and avg_rating
    Public endpoint - no authentication required
    """
    try:
        tutors = await leaderboard_service.get_top_tutors(force_refresh=refresh)
        cache_info = leaderboard_service.get_cache_info()
        
        return LeaderboardResponse(
            success=True,
            data=tutors,
            total=len(tutors),
            last_updated=cache_info["last_updated"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch leaderboard: {str(e)}"
        )

@router.get("/cache-status")
async def get_cache_status():
    """Get current cache status - useful for debugging"""
    return leaderboard_service.get_cache_info()