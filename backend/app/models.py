import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="CUSTOMER") # CUSTOMER or DRIVER
    profile_photo = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    customer_bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    reviews = relationship("Review", back_populates="customer")


class VehicleCategory(Base):
    __tablename__ = "vehicle_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    category_type = Column(String(50), nullable=False, unique=True, index=True) # car, auto, tata_ace, van, mini_truck, pickup_truck, goods_auto
    description = Column(String(255), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicles = relationship("Vehicle", back_populates="category")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vehicle_type_id = Column(Integer, ForeignKey("vehicle_categories.id"), nullable=True)
    vehicle_type = Column(String(50), nullable=False) # e.g. tata_ace, car, auto, etc.
    vehicle_model = Column(String(100), nullable=False)
    vehicle_number = Column(String(50), nullable=False, index=True)
    vehicle_photo = Column(String(500), nullable=True)
    availability_status = Column(Boolean, default=True)
    verification_status = Column(String(30), default="VERIFIED")
    description = Column(Text, nullable=True)
    
    # Location fields
    current_latitude = Column(Float, nullable=True, default=16.5062) # Default around Andhra/India center if not set
    current_longitude = Column(Float, nullable=True, default=80.6480)
    location_sharing_enabled = Column(Boolean, default=False)
    location_updated_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="vehicles")
    category = relationship("VehicleCategory", back_populates="vehicles")
    bookings = relationship("Booking", back_populates="vehicle", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="vehicle", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)

    pickup_address = Column(String(255), nullable=False)
    pickup_latitude = Column(Float, nullable=False)
    pickup_longitude = Column(Float, nullable=False)

    drop_address = Column(String(255), nullable=False)
    drop_latitude = Column(Float, nullable=False)
    drop_longitude = Column(Float, nullable=False)

    distance_km = Column(Float, nullable=True, default=0.0)
    estimated_duration_minutes = Column(Integer, nullable=True, default=0)

    booking_date = Column(String(30), nullable=False)
    booking_time = Column(String(30), nullable=False)

    passenger_count = Column(Integer, nullable=True, default=1)
    load_type = Column(String(100), nullable=True)
    additional_details = Column(Text, nullable=True)

    status = Column(String(20), default="PENDING") # PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="customer_bookings", foreign_keys=[customer_id])
    vehicle = relationship("Vehicle", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, unique=True)

    rating = Column(Integer, nullable=False) # 1 to 5
    review = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="reviews")
    vehicle = relationship("Vehicle", back_populates="reviews")
    booking = relationship("Booking", back_populates="review")
