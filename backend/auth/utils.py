import jwt
from typing import Dict, Any
from config.settings import settings

def verify_supabase_token(token: str) -> Dict[str, Any]:
    """Verify and decode Supabase JWT token"""
    print("verify_supabase_token called")

    try:
        # Decode and verify the token
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options={
                "verify_signature": True,
                "verify_exp": True,
                "verify_iat": True,
                "verify_aud": False,  # Supabase tokens might not have audience
            }
        )

        print("Decoded payload:", payload)

        # Debug: Check for metadata existence
        if "app_metadata" in payload:
            print("app_metadata exists:", payload["app_metadata"])
        else:
            print("app_metadata does not exist")

        if "user_metadata" in payload:
            print("user_metadata exists:", payload["user_metadata"])
        else:
            print("user_metadata does not exist")

        user_metadata = payload.get("user_metadata", {})
        
        # Return user information
        return {
            "user_id": payload.get("sub"),  # User ID
            "email": payload.get("email"),
            "display_name": user_metadata.get("display_name"),
            "role": payload.get("role", "authenticated"),
            "aud": payload.get("aud"),
            "exp": payload.get("exp"),
            "iat": payload.get("iat"),
            "app_metadata": payload.get("app_metadata", {}),
            "user_metadata": payload.get("user_metadata", {}),
        }
        
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {str(e)}")
        raise ValueError(f"Invalid token: {str(e)}")
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        raise ValueError(f"Token verification failed: {str(e)}")

def extract_user_metadata(user_info: Dict[str, Any]) -> Dict[str, Any]:
    """Extract clean user metadata from JWT payload"""
    return {
        "id": user_info.get("user_id"),
        "email": user_info.get("email"),
        "display_name": user_info.get("user_metadata", {}).get("display_name"),
        "role": user_info.get("role", "authenticated"),
    }