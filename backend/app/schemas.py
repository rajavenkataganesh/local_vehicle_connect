from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Auth & User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    role: str = "CUSTOMER"

class UserRegister(UserBase):
    password: str
    profile_photo: Optional[str] = None

class DriverRegister(UserBase):
    password: str
    profile_photo: Optional[str] = None
    vehicle_type: str
    vehicle_model: str
    vehicle_number: str
    vehicle_photo: Optional[str] = None

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(UserBase):
    id: int
    profile_photo: Optional[str] = None
    is_verified: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

# Vehicle Schemas
class VehicleBase(BaseModel):
    vehicle_type: str
    vehicle_model: str
    vehicle_number: str
    vehicle_photo: Optional[str] = None
    description: Optional[str] = None
    availability_status: bool = True

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    vehicle_type: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_number: Optional[str] = None
    vehicle_photo: Optional[str] = None
    description: Optional[str] = None
    availability_status: Optional[bool] = None

class VehicleAvailabilityUpdate(BaseModel):
    availability_status: bool

class VehicleLocationUpdate(BaseModel):
    current_latitude: float
    current_longitude: float
    location_sharing_enabled: bool = True

class DriverOut(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    profile_photo: Optional[str] = None
    is_verified: bool = True
    rating: float = 5.0
    total_reviews: int = 0

    class Config:
        from_attributes = True

class VehicleOut(VehicleBase):
    id: int
    owner_id: int
    verification_status: str = "VERIFIED"
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    location_sharing_enabled: bool = False
    location_updated_at: Optional[datetime] = None
    created_at: datetime
    owner: DriverOut
    average_rating: float = 5.0
    total_reviews: int = 0
    distance_km: Optional[float] = None

    class Config:
        from_attributes = True

# Booking Schemas
class BookingCreate(BaseModel):
    vehicle_id: int
    pickup_address: str
    pickup_latitude: float
    pickup_longitude: float
    drop_address: str
    drop_latitude: float
    drop_longitude: float
    distance_km: float = 0.0
    estimated_duration_minutes: int = 0
    booking_date: str
    booking_time: str
    passenger_count: Optional[int] = 1
    load_type: Optional[str] = None
    additional_details: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    customer_id: int
    vehicle_id: int
    booking_id: int
    rating: int
    review: Optional[str] = None
    created_at: datetime
    customer_name: Optional[str] = None
    customer_photo: Optional[str] = None

    class Config:
        from_attributes = True

class BookingOut(BaseModel):
    id: int
    customer_id: int
    vehicle_id: int
    pickup_address: str
    pickup_latitude: float
    pickup_longitude: float
    drop_address: str
    drop_latitude: float
    drop_longitude: float
    distance_km: float
    estimated_duration_minutes: int
    booking_date: str
    booking_time: str
    passenger_count: Optional[int] = 1
    load_type: Optional[str] = None
    additional_details: Optional[str] = None
    status: str
    created_at: datetime
    customer: UserOut
    vehicle: VehicleOut
    review: Optional[ReviewOut] = None

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    booking_id: int
    vehicle_id: int
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = None

TokenResponse.model_rebuild()
