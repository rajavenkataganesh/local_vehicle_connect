import math
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Vehicle, User, Review, VehicleCategory
from app.schemas import (
    VehicleCreate, VehicleUpdate, VehicleOut, VehicleAvailabilityUpdate,
    VehicleLocationUpdate, DriverOut
)
from app.auth import get_current_user, get_current_driver

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

def haversine(lat1, lon1, lat2, lon2):
    if None in (lat1, lon1, lat2, lon2):
        return None
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def get_vehicle_out_dict(vehicle: Vehicle, db: Session, user_lat: Optional[float] = None, user_lng: Optional[float] = None) -> dict:
    # Get reviews stats
    reviews_query = db.query(Review).filter(Review.vehicle_id == vehicle.id)
    reviews_count = reviews_query.count()
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.vehicle_id == vehicle.id).scalar()
    
    avg_rating_val = round(float(avg_rating), 1) if avg_rating else 5.0

    # Distance calculation
    dist = None
    if user_lat is not None and user_lng is not None and vehicle.current_latitude and vehicle.current_longitude:
        dist = haversine(user_lat, user_lng, vehicle.current_latitude, vehicle.current_longitude)

    owner_dict = {
        "id": vehicle.owner.id,
        "name": vehicle.owner.name,
        "phone": vehicle.owner.phone,
        "email": vehicle.owner.email,
        "profile_photo": vehicle.owner.profile_photo,
        "is_verified": vehicle.owner.is_verified,
        "rating": avg_rating_val,
        "total_reviews": reviews_count
    }

    return {
        "id": vehicle.id,
        "owner_id": vehicle.owner_id,
        "vehicle_type": vehicle.vehicle_type,
        "vehicle_model": vehicle.vehicle_model,
        "vehicle_number": vehicle.vehicle_number,
        "vehicle_photo": vehicle.vehicle_photo,
        "availability_status": vehicle.availability_status,
        "verification_status": vehicle.verification_status,
        "description": vehicle.description,
        "current_latitude": vehicle.current_latitude,
        "current_longitude": vehicle.current_longitude,
        "location_sharing_enabled": vehicle.location_sharing_enabled,
        "location_updated_at": vehicle.location_updated_at,
        "created_at": vehicle.created_at,
        "owner": owner_dict,
        "average_rating": avg_rating_val,
        "total_reviews": reviews_count,
        "distance_km": dist
    }


@router.post("", response_model=dict)
def create_vehicle(vehicle_data: VehicleCreate, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    category = db.query(VehicleCategory).filter(
        VehicleCategory.category_type == vehicle_data.vehicle_type
    ).first()

    vehicle = Vehicle(
        owner_id=current_user.id,
        vehicle_type_id=category.id if category else None,
        vehicle_type=vehicle_data.vehicle_type,
        vehicle_model=vehicle_data.vehicle_model,
        vehicle_number=vehicle_data.vehicle_number,
        vehicle_photo=vehicle_data.vehicle_photo,
        description=vehicle_data.description,
        availability_status=vehicle_data.availability_status
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return get_vehicle_out_dict(vehicle, db)


@router.get("", response_model=List[dict])
def get_my_vehicles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == current_user.id).all()
    return [get_vehicle_out_dict(v, db) for v in vehicles]


@router.get("/search", response_model=List[dict])
def search_vehicles(
    type: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    available_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)
    if available_only:
        query = query.filter(Vehicle.availability_status == True)

    if type and type != "all":
        query = query.filter(Vehicle.vehicle_type == type)

    vehicles = query.all()
    results = [get_vehicle_out_dict(v, db, user_lat=lat, user_lng=lng) for v in vehicles]

    # Sort by distance if user lat/lng provided
    if lat is not None and lng is not None:
        results.sort(key=lambda x: (x["distance_km"] is None, x["distance_km"] or 99999))

    return results


@router.get("/{id}", response_model=dict)
def get_vehicle_by_id(id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return get_vehicle_out_dict(vehicle, db)


@router.put("/{id}", response_model=dict)
def update_vehicle(id: int, vehicle_data: VehicleUpdate, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found or unauthorized")

    for key, val in vehicle_data.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, val)

    db.commit()
    db.refresh(vehicle)
    return get_vehicle_out_dict(vehicle, db)


@router.delete("/{id}")
def delete_vehicle(id: int, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found or unauthorized")

    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}


@router.patch("/{id}/availability", response_model=dict)
def update_availability(id: int, payload: VehicleAvailabilityUpdate, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found or unauthorized")

    vehicle.availability_status = payload.availability_status
    db.commit()
    db.refresh(vehicle)
    return get_vehicle_out_dict(vehicle, db)


@router.patch("/{id}/location", response_model=dict)
def update_location(id: int, payload: VehicleLocationUpdate, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found or unauthorized")

    vehicle.current_latitude = payload.current_latitude
    vehicle.current_longitude = payload.current_longitude
    vehicle.location_sharing_enabled = payload.location_sharing_enabled
    vehicle.location_updated_at = datetime.utcnow()

    db.commit()
    db.refresh(vehicle)
    return get_vehicle_out_dict(vehicle, db)
