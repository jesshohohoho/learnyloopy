import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# centralize all keys
class Settings:
    # Database
    SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    # JWT
    SUPABASE_JWT_SECRET: str = os.environ.get("SUPABASE_JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    
    # App settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "LearnLoop"
    
    # Validation
    def __post_init__(self):
        required_vars = [
            "SUPABASE_URL", 
            "SUPABASE_SERVICE_ROLE_KEY", 
            "SUPABASE_JWT_SECRET"
        ]
        
        missing = [var for var in required_vars if not getattr(self, var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {missing}")

# Create settings instance
settings = Settings()