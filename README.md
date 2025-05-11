# ✈️ Airport Assistance Platform

A smart airport assistance system that provides real-time navigation, crowd management, and personalized recommendations to travelers through indoor tracking, QR-based access, and multilingual notifications.

## 🚀 Overview

This platform enhances the airport experience by:
- Issuing a digital band or QR-enabled tag to every visitor.
- Tracking live location (via GPS/indoor BLE/Wi-Fi beacons).
- Providing indoor navigation and service discovery.
- Offering transport assistance and early arrival suggestions.
- Notifying users with reminders before travel.
- Helping airport authorities with live dashboard and resource management.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js with MongoDB
- **Authentication**: Session-based login (JWT via cookies)
- **Location**: Google Maps API (Frontend), GeoJSON
- **Notifications**: Email + SMS via external service
- **Real-time Tracking**: Placeholder for BLE/Wi-Fi integration

---

## ✅ Current Features

### 👤 User Features
- User registration with ID/passport and travel ticket.
- Address input with Google Maps integration.
- Travel day transport recommendation with ETA/cost.
- Early arrival services with personalized food/shop suggestions.
- Dashboard on homepage: shows current location, bookings, and services.
- `/route`: Shows future tickets as clickable cards with cost and mode.
- User profile page with update option for hashed ID and password.
- QR Code scanning (planned backend endpoint ready).
- Multi-language UI (placeholder implemented).

### 🛂 Admin Features
- Login with token-based session auth.
- Admin dashboard to:
  - Add/edit/delete airport services and prices.
  - View all current user bookings.
  - Manage transport modes, cost suggestions.
- Live toast notifications for updates.
- Uses `MapProvider` for all admin-side maps.

### 🔔 Notifications System
- Sends email + SMS reminders to traveler:
  - **1 day before travel**
  - **5 hours before travel**
  - **1 hour before travel**

---

## 🗺️ Folder Structure


---

## 🔮 Future Features (Roadmap)

### Near-Term Goals
- ✅ Reminder system (done)
- 🔄 Booking reschedule and cancellation
- 🌐 Full multi-language support (i18n)
- 📲 QR code-based boarding pass scanner (API + UI integration)
- 🎫 Ticket import via PDF/QR scan (OCR processing)

### Mid-Term Goals
- 🛰 Indoor positioning system (BLE/WiFi triangulation)
- 📊 Admin analytics dashboard (real-time heatmaps, crowd flow)
- 🎯 AI-based recommendation engine for airport services
- 📥 Offline mode via PWA (progressive web app)
- 💰 Integration with airport offers and digital wallet cashback

### Long-Term Goals
- 🤖 Voice Assistant via smart kiosks
- 🧳 Baggage tracking integration
- 🌍 Integrate with other transport APIs (Uber, Metro, etc.)
- 📡 Full integration with airline systems for live gate updates

---

## 🧑‍💻 Development Setup


# 1. Clone the repository
git clone https://github.com/master229198112/airport-assist.git
cd airport-assist

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env
# Update DB_URL, JWT_SECRET, SMS/EMAIL_API_KEYS, etc.

# 4. Run the app
npm run dev

---
## 🤝 Contributing
- Fork the repo

- Create a feature branch (git checkout -b feature/awesome-feature)

- Commit changes (git commit -m 'Add awesome feature')

- Push and create a PR


## 🧭 Contact & Support
For queries, contributions, or collaborations, contact:

## 📧 vishalkumar.sharma37@gmail.com

## 🌐 https://airport-assist.vercel.app/
