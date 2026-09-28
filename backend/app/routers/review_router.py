from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Review, Booking, Vehicle, User
from app.schemas import ReviewCreate, ReviewOut
from app.auth import get_current_customer, get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=ReviewOut)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == review_data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only review your own bookings")

    if booking.status != "COMPLETED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can only rate drivers after trip completion")

    existing_review = db.query(Review).filter(Review.booking_id == review_data.booking_id).first()
    if existing_review:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted a review for this booking")

    db_review = Review(
        customer_id=current_user.id,
        vehicle_id=review_data.vehicle_id,
        booking_id=review_data.booking_id,
        rating=review_data.rating,
        review=review_data.review
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return ReviewOut(
        id=db_review.id,
        customer_id=db_review.customer_id,
        vehicle_id=db_review.vehicle_id,
        booking_id=db_review.booking_id,
        rating=db_review.rating,
        review=db_review.review,
        created_at=db_review.created_at,
        customer_name=current_user.name,
        customer_photo=current_user.profile_photo
    )


@router.get("/vehicle/{vehicle_id}", response_model=List[ReviewOut])
def get_vehicle_reviews(vehicle_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.vehicle_id == vehicle_id).order_by(Review.created_at.desc()).all()
    results = []
    for r in reviews:
        cust = db.query(User).filter(User.id == r.customer_id).first()
        results.append(ReviewOut(
            id=r.id,
            customer_id=r.customer_id,
            vehicle_id=r.vehicle_id,
            booking_id=r.booking_id,
            rating=r.rating,
            review=r.review,
            created_at=r.created_at,
            customer_name=cust.name if cust else "Customer",
            customer_photo=cust.profile_photo if cust else None
        ))
    return results
