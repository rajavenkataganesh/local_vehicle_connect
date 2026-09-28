import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import VehicleCategory, User, Vehicle, Review, Booking
from app.auth import get_password_hash
from app.routers import auth_router, vehicle_router, booking_router, review_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Local Vehicle Connect - India-wide transportation marketplace backend",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router.router)
app.include_router(vehicle_router.router)
app.include_router(booking_router.router)
app.include_router(review_router.router)

@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # Seed categories if missing
        categories = [
            {"name": "Car", "type": "car", "desc": "Hatchback, Sedan & SUV passenger cars"},
            {"name": "Auto", "type": "auto", "desc": "3-Wheeler passenger auto rickshaws"},
            {"name": "Tata Ace", "type": "tata_ace", "desc": "Compact mini goods truck for local transport"},
            {"name": "Van", "type": "van", "desc": "Omni, Eeco & passenger/goods vans"},
            {"name": "Mini Truck", "type": "mini_truck", "desc": "Medium mini trucks for commercial loads"},
            {"name": "Pickup Truck", "type": "pickup_truck", "desc": "Bolero & Pickup trucks for heavy items"},
            {"name": "Goods Auto", "type": "goods_auto", "desc": "3-Wheeler cargo auto for fast local load transport"},
        ]

        for cat in categories:
            existing = db.query(VehicleCategory).filter(VehicleCategory.category_type == cat["type"]).first()
            if not existing:
                db.add(VehicleCategory(name=cat["name"], category_type=cat["type"], description=cat["desc"], active=True))
        db.commit()

        # Seed sample driver & vehicles if empty
        if db.query(User).count() == 0:
            # Seed Customer
            cust = User(
                name="Anil Kumar",
                email="customer@example.com",
                phone="9876543210",
                password_hash=get_password_hash("password123"),
                role="CUSTOMER",
                profile_photo="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                is_verified=True
            )
            db.add(cust)

            # Seed Drivers & Vehicles
            drivers_data = [
                {
                    "name": "Raja Sekhar",
                    "email": "raja@example.com",
                    "phone": "9123456789",
                    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                    "vehicles": [
                        {
                            "type": "tata_ace",
                            "model": "Tata Ace Gold CNG",
                            "number": "AP 16 TE 4521",
                            "photo": "https://images.unsplash.com/photo-1586193804147-380d3df858ff?auto=format&fit=crop&w=800&q=80",
                            "lat": 16.5062, "lng": 80.6480, # Vijayawada / Mangalagiri
                            "desc": "Clean Tata Ace available for household items & shop goods moving."
                        },
                        {
                            "type": "auto",
                            "model": "Bajaj RE Compact",
                            "number": "AP 16 AX 8812",
                            "photo": "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80",
                            "lat": 16.5120, "lng": 80.6320,
                            "desc": "Quick local city trips and railway station drops."
                        }
                    ]
                },
                {
                    "name": "Suresh Reddy",
                    "email": "suresh@example.com",
                    "phone": "9848022334",
                    "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                    "vehicles": [
                        {
                            "type": "pickup_truck",
                            "model": "Mahindra Bolero Maxi Truck",
                            "number": "TS 09 FC 7890",
                            "photo": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
                            "lat": 17.3850, "lng": 78.4867, # Hyderabad
                            "desc": "Heavy load pickup truck for construction material & furniture."
                        },
                        {
                            "type": "car",
                            "model": "Maruti Suzuki Dzire AC",
                            "number": "TS 07 EQ 1234",
                            "photo": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
                            "lat": 17.4401, "lng": 78.3489, # Gachibowli
                            "desc": "Comfortable AC sedan for outstation & city journeys."
                        }
                    ]
                },
                {
                    "name": "Venkatesh Rao",
                    "email": "venkat@example.com",
                    "phone": "9440188990",
                    "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
                    "vehicles": [
                        {
                            "type": "mini_truck",
                            "model": "Ashok Leyland Dost",
                            "number": "TN 02 AW 5566",
                            "photo": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
                            "lat": 13.0827, "lng": 80.2707, # Chennai
                            "desc": "High capacity mini truck for commercial & industrial transport."
                        },
                        {
                            "type": "goods_auto",
                            "model": "Piaggio Ape Xtra LDX",
                            "number": "KA 01 MG 9922",
                            "photo": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
                            "lat": 12.9716, "lng": 77.5946, # Bangalore
                            "desc": "Fast goods delivery cargo auto."
                        }
                    ]
                }
            ]

            for d_data in drivers_data:
                driver = User(
                    name=d_data["name"],
                    email=d_data["email"],
                    phone=d_data["phone"],
                    password_hash=get_password_hash("password123"),
                    role="DRIVER",
                    profile_photo=d_data["photo"],
                    is_verified=True
                )
                db.add(driver)
                db.commit()
                db.refresh(driver)

                for v_data in d_data["vehicles"]:
                    cat = db.query(VehicleCategory).filter(VehicleCategory.category_type == v_data["type"]).first()
                    v = Vehicle(
                        owner_id=driver.id,
                        vehicle_type_id=cat.id if cat else None,
                        vehicle_type=v_data["type"],
                        vehicle_model=v_data["model"],
                        vehicle_number=v_data["number"],
                        vehicle_photo=v_data["photo"],
                        availability_status=True,
                        verification_status="VERIFIED",
                        description=v_data["desc"],
                        current_latitude=v_data["lat"],
                        current_longitude=v_data["lng"],
                        location_sharing_enabled=True
                    )
                    db.add(v)
            db.commit()
            print("Initial sample drivers and vehicles seeded successfully!")

    except Exception as e:
        print(f"Database seeding note: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "message": "Welcome to Local Vehicle Connect API - India-wide transportation marketplace"
    }
