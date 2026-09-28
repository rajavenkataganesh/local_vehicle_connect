import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException, status
from app.config import settings

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configure Cloudinary if keys are provided
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

async def save_upload_file(file: UploadFile, folder: str = "general") -> str:
    filename = file.filename or "upload.jpg"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10MB"
        )

    # Try Cloudinary if configured
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
        try:
            upload_result = cloudinary.uploader.upload(
                content,
                folder=f"local_vehicle_connect/{folder}"
            )
            return upload_result.get("secure_url", "")
        except Exception as e:
            print(f"Cloudinary upload failed, falling back to local storage: {e}")

    # Fallback to local file storage
    unique_name = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(target_path, "wb") as f:
        f.write(content)

    return f"/uploads/{unique_name}"
