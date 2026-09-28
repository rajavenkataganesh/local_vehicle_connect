# Local Vehicle Connect 🚗🛺🚚

An India-wide vehicle marketplace connecting customers directly with vehicle owners and drivers for Cars, Autos, Tata Ace, Vans, Mini Trucks, Pickup Trucks, and Goods Autos.

## 🚀 Key Features

- **Customer Journey**:
  - Filter vehicles by category (Cars, Autos, Tata Ace, Vans, Mini Trucks, Pickup Trucks, Goods Autos).
  - Map-based pickup and drop location selection (Google Maps / Geolocation).
  - Automatic route preview with distance (km) and estimated duration.
  - Direct call button (`tel:`) to phone dialer.
  - Send booking requests & track booking statuses.
  - Rate drivers and leave written reviews after trip completion.

- **Driver / Owner Journey**:
  - Multi-step driver & vehicle registration flow with photo upload previews.
  - Register & manage multiple vehicles under a single profile.
  - Toggle vehicle availability (`🟢 Available` / `🔴 Not Available`).
  - Toggle live GPS location sharing (`📍 ON / OFF`).
  - Receive booking requests, inspect pickup/drop route on map, accept/reject requests, call customers, and complete trips.

- **No Admin restriction**: Pure customer-driver peer-to-peer marketplace.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React
- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2, SQLite / PostgreSQL
- **Security**: JWT Authentication, bcrypt password hashing
- **Maps**: Google Maps JavaScript API, Directions API, Places API

---

## 💻 Getting Started Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📤 Push to GitHub Commands

To push this repository to your GitHub account:

```bash
# 1. Create a new repository on GitHub (e.g. named local-vehicle-connect)

# 2. Add remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/local-vehicle-connect.git

# 3. Push code to main branch
git push -u origin main
```
