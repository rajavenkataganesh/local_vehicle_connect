from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Vehicle, User, Review
from app.schemas import BookingCreate, BookingOut, UserOut
from app.auth import get_current_user, get_current_customer, get_current_driver
from app.routers.vehicle_router import get_vehicle_out_dict

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def build_booking_out(booking: Booking, db: Session) -> dict:
    vehicle_dict = get_vehicle_out_dict(booking.vehicle, db)
    customer_user = db.query(User).filter(User.id == booking.customer_id).first()

    review_dict = None
    if booking.review:
        review_dict = {
            "id": booking.review.id,
            "customer_id": booking.review.customer_id,
            "vehicle_id": booking.review.vehicle_id,
            "booking_id": booking.review.booking_id,
            "rating": booking.review.rating,
            "review": booking.review.review,
            "created_at": booking.review.created_at,
            "customer_name": customer_user.name if customer_user else "Customer",
            "customer_photo": customer_user.profile_photo if customer_user else None
        }

    return {
        "id": booking.id,
        "customer_id": booking.customer_id,
        "vehicle_id": booking.vehicle_id,
        "pickup_address": booking.pickup_address,
        "pickup_latitude": booking.pickup_latitude,
        "pickup_longitude": booking.pickup_longitude,
        "drop_address": booking.drop_address,
        "drop_latitude": booking.drop_latitude,
        "drop_longitude": booking.drop_longitude,
        "distance_km": booking.distance_km,
        "estimated_duration_minutes": booking.estimated_duration_minutes,
        "booking_date": booking.booking_date,
        "booking_time": booking.booking_time,
        "passenger_count": booking.passenger_count,
        "load_type": booking.load_type,
        "additional_details": booking.additional_details,
        "status": booking.status,
        "created_at": booking.created_at,
        "customer": UserOut.model_validate(customer_user).model_dump() if customer_user else None,
        "vehicle": vehicle_dict,
        "review": review_dict
    }


@router.post("", response_model=dict)
def create_booking(booking_data: BookingCreate, current_user: User = Depends(get_current_customer), db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == booking_data.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    if not vehicle.availability_status:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This vehicle is currently not available")

    booking = Booking(
        customer_id=current_user.id,
        vehicle_id=booking_data.vehicle_id,
        pickup_address=booking_data.pickup_address,
        pickup_latitude=booking_data.pickup_latitude,
        pickup_longitude=booking_data.pickup_longitude,
        drop_address=booking_data.drop_address,
        drop_latitude=booking_data.drop_latitude,
        drop_longitude=booking_data.drop_longitude,
        distance_km=booking_data.distance_km,
        estimated_duration_minutes=booking_data.estimated_duration_minutes,
        booking_date=booking_data.booking_date,
        booking_time=booking_data.booking_time,
        passenger_count=booking_data.passenger_count,
        load_type=booking_data.load_type,
        additional_details=booking_data.additional_details,
        status="PENDING"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return build_booking_out(booking, db)


@router.get("/customer", response_model=List[dict])
def get_customer_bookings(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Booking).filter(Booking.customer_id == current_user.id)
    if status_filter and status_filter != "ALL":
        query = query.filter(Booking.status == status_filter.upper())

    bookings = query.order_by(Booking.created_at.desc()).all()
    return [build_booking_out(b, db) for b in bookings]


@router.get("/driver", response_model=List[dict])
def get_driver_bookings(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db)
):
    # Find vehicles owned by driver
    my_vehicle_ids = [v.id for v in db.query(Vehicle.id).filter(Vehicle.owner_id == current_user.id).all()]
    if not my_vehicle_ids:
        return []

    query = db.query(Booking).filter(Booking.vehicle_id.in_(my_vehicle_ids))
    if status_filter and status_filter != "ALL":
        query = query.filter(Booking.status == status_filter.upper())

    bookings = query.order_by(Booking.created_at.desc()).all()
    return [build_booking_out(b, db) for b in bookings]


@router.get("/{id}", response_model=dict)
def get_booking_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Access check
    is_customer = booking.customer_id == current_user.id
    is_driver = booking.vehicle.owner_id == current_user.id
    if not (is_customer or is_driver):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return build_booking_out(booking, db)


@router.patch("/{id}/accept", response_model=dict)
def accept_booking(id: int, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if booking.vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    booking.status = "ACCEPTED"
    db.commit()
    db.refresh(booking)
    return build_booking_out(booking, db)


@router.patch("/{id}/reject", response_model=dict)
def reject_booking(id: int, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if booking.vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    booking.status = "REJECTED"
    db.commit()
    db.refresh(booking)
    return build_booking_out(booking, db)


@router.patch("/{id}/cancel", response_model=dict)
def cancel_booking(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    is_customer = booking.customer_id == current_user.id
    is_driver = booking.vehicle.owner_id == current_user.id
    if not (is_customer or is_driver):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    booking.status = "CANCELLED"
    db.commit()
    db.refresh(booking)
    return build_booking_out(booking, db)


@router.patch("/{id}/complete", response_model=dict)
def complete_booking(id: int, current_user: User = Depends(get_current_driver), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if booking.vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    booking.status = "COMPLETED"
    db.commit()
    db.refresh(booking)
    return build_booking_out(booking, db)
