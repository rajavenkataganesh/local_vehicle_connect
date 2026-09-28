from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Vehicle, VehicleCategory
from app.schemas import UserRegister, DriverRegister, UserLogin, TokenResponse, UserOut
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.services.upload_service import save_upload_file

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check existing email or phone
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.phone == user_data.phone)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone number already exists"
        )

    db_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        profile_photo=user_data.profile_photo,
        is_verified=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "user": UserOut.model_validate(db_user)}


@router.post("/register-driver", response_model=TokenResponse)
def register_driver(driver_data: DriverRegister, db: Session = Depends(get_db)):
    # Check existing email or phone
    existing_user = db.query(User).filter(
        (User.email == driver_data.email) | (User.phone == driver_data.phone)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver with this email or phone number already exists"
        )

    db_user = User(
        name=driver_data.name,
        email=driver_data.email,
        phone=driver_data.phone,
        password_hash=get_password_hash(driver_data.password),
        role="DRIVER",
        profile_photo=driver_data.profile_photo,
        is_verified=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Find category
    category = db.query(VehicleCategory).filter(
        VehicleCategory.category_type == driver_data.vehicle_type
    ).first()

    # Create initial vehicle
    vehicle = Vehicle(
        owner_id=db_user.id,
        vehicle_type_id=category.id if category else None,
        vehicle_type=driver_data.vehicle_type,
        vehicle_model=driver_data.vehicle_model,
        vehicle_number=driver_data.vehicle_number,
        vehicle_photo=driver_data.vehicle_photo,
        availability_status=True,
        verification_status="VERIFIED",
        location_sharing_enabled=False
    )
    db.add(vehicle)
    db.commit()

    token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "user": UserOut.model_validate(db_user)}


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == login_data.email_or_phone) | (User.phone == login_data.email_or_phone)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": UserOut.model_validate(user)}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    url = await save_upload_file(file)
    return {"url": url}
