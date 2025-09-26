from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .utils import verify_supabase_token
from typing import Optional, Dict, Any

# HTTP Bearer token scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:

    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Verify token and extract user info
        user_info = verify_supabase_token(token)
        
        return user_info
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[Dict[str, Any]]:

    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        user_info = verify_supabase_token(token)
        return user_info
    except:
        return None

def require_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> str:

    return user["user_id"] 