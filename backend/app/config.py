import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Local Vehicle Connect"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./local_vehicle_connect.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-local-vehicle-connect-key-2026-india")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Cloudinary credentials (optional - system falls back to local disk storage if not set)
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # Google Maps API Key
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
