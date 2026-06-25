<p align="center">
  <img src="https://img.shields.io/badge/Solar_Bharat-☀️_AI_Powered-F59E0B?style=for-the-badge&labelColor=0F172A" alt="Solar Bharat" />
</p>

<h1 align="center">☀️ Solar Bharat</h1>

<p align="center">
  <strong>India's AI-Powered Renewable Energy Intelligence Platform</strong><br/>
  <em>Built by <a href="https://github.com/Atharvatare">Atharva Tare</a></em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 🌟 Overview

**Solar Bharat** is a production-grade, AI-powered renewable energy platform built for India. It combines cutting-edge AI (Google Gemini), real-time IoT monitoring, an interactive marketplace, and an enterprise CRM — all wrapped in a premium glassmorphism UI.

### 🔗 Live Demo

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | [solar-bharat.vercel.app](https://solar-bharat.vercel.app) |
| ⚙️ **Backend API** | [solar-bharat-at.vercel.app/api/health](https://solar-bharat-at.vercel.app/api/health) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SOLAR BHARAT                             │
├────────────────────────────┬────────────────────────────────────┤
│      FRONTEND (Vercel)     │       BACKEND (Vercel/Render)      │
│                            │                                    │
│  React 18 + Vite           │  Node.js + Express                │
│  Tailwind CSS              │  MongoDB Atlas                     │
│  Framer Motion             │  Gemini AI SDK                     │
│  Recharts                  │  JWT + HttpOnly Cookies            │
│  React Router v6           │  7-Layer Security Middleware       │
│  Lazy Loading + Splitting  │  Rate Limiting + WAF               │
│                            │  IoT Simulator Service             │
├────────────────────────────┴────────────────────────────────────┤
│                     SECURITY LAYER                              │
│  Helmet · CORS · HPP · MongoSanitize · XSS Guard · RBAC        │
│  Request Validation · Payload Guard · Audit Logging             │
│  Sensitive Data Masking · Token Blacklisting                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features (14 Phases Complete)

### 🔐 Authentication & Security
- JWT with HttpOnly cookie storage
- Token blacklisting on logout
- Role-based access control (User / Vendor / Admin)
- Account lockout after failed attempts
- Password change invalidates tokens
- 7-layer security middleware pipeline

### 🤖 AI-Powered Intelligence
- **Gemini Vision OCR** — Electricity bill scanning & data extraction
- **AI Solar Calculator** — System sizing, ROI, payback period
- **AI Rooftop Analysis** — Roof assessment from satellite imagery
- **AI Chatbot** — Solar energy assistant with multi-model fallback
- **Energy Forecasting** — Weather-based generation prediction

### 📊 Analytics & Monitoring
- Interactive energy analytics dashboard
- Real-time IoT monitoring with live-updating metrics
- Solar generation curves with time-of-day simulation
- CO₂ offset tracking
- Performance efficiency metrics

### 🛒 Marketplace & CRM
- Public solar product marketplace with compare feature
- Admin panel with user/vendor/product management
- CRM lead pipeline (7-stage tracking)
- Quotation management with auto-numbering
- Installation booking & scheduling system

### 🗺️ Maps & GIS
- Google Maps integration for rooftop analysis
- Location-based solar potential assessment
- NASA POWER API weather data integration

### 📄 Reports & Documents
- PDF report generation with charts
- Downloadable solar assessment documents
- Bill analysis history tracking

---

## 📂 Project Structure

```
SOLAR-BHARAT/
├── backend/
│   ├── ai-services/         # Gemini AI integration
│   │   └── chatService.js   # Multi-model fallback chatbot
│   ├── config/
│   │   └── config.js        # Centralized configuration
│   ├── controllers/         # Route handlers
│   │   ├── adminController.js    # Full CRUD admin ops
│   │   ├── authController.js     # Login/Register/Refresh
│   │   ├── billController.js     # Bill upload & OCR
│   │   ├── chatController.js     # AI chatbot
│   │   ├── dashboardController.js
│   │   ├── iotController.js      # IoT device management
│   │   ├── marketplaceController.js
│   │   ├── notificationController.js
│   │   ├── solarController.js    # Calculator & forecast
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification + blacklist
│   │   ├── rateLimiter.js    # 4 rate limiters
│   │   ├── roleCheck.js      # RBAC authorization
│   │   ├── security.js       # 7-layer security (Phase 13)
│   │   └── validate.js       # Request schema validation
│   ├── models/               # 15 Mongoose schemas
│   │   ├── User.js, Vendor.js, Product.js
│   │   ├── Bill.js, SolarReport.js, Analytics.js
│   │   ├── Quotation.js, Lead.js, Booking.js
│   │   ├── IoTDevice.js, IoTReading.js
│   │   ├── ChatHistory.js, Session.js
│   │   ├── Notification.js, TokenBlacklist.js
│   ├── routes/               # 10 route modules
│   ├── services/             # Business logic
│   │   ├── iotSimulatorService.js  # Realistic solar data gen
│   │   ├── weatherForecastService.js
│   │   └── solarService.js
│   ├── utils/
│   │   ├── constants.js      # App-wide constants
│   │   └── helpers.js        # Response helpers, pagination
│   ├── server.js             # Express app + middleware
│   └── vercel.json           # Backend deployment config
│
├── frontend/
│   ├── public/
│   │   ├── robots.txt        # SEO crawler rules
│   │   ├── sitemap.xml       # XML sitemap
│   │   └── manifest.json     # PWA manifest
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Button, Card, Input, Modal, Badge
│   │   │   ├── charts/       # AreaChart, BarChart, PieChart, RadialBar
│   │   │   └── ui/           # ThemeToggle, LoadingScreen, NotificationBell
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # PublicLayout, DashboardLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── admin/        # 6 admin pages (Users, Vendors, Products, Leads, Quotations, Bookings)
│   │   │   ├── marketplace/  # MarketplacePage, ProductComparePage
│   │   │   ├── LandingPage, AboutPage, FeaturesPage, ContactPage
│   │   │   ├── UserDashboard, AdminDashboard
│   │   │   ├── BillUploadPage, SolarCalculatorPage
│   │   │   ├── EnergyAnalyticsPage, SolarForecastPage
│   │   │   ├── RooftopAnalysisPage, AIChatPage
│   │   │   ├── IoTDashboardPage, ReportsPage
│   │   │   └── LoginPage, RegisterPage, SettingsPage
│   │   ├── routes/           # AppRoutes + ProtectedRoute
│   │   ├── services/         # API service layer (axios)
│   │   └── utils/            # Constants, helpers
│   ├── index.html            # SEO-optimized entry point
│   ├── vite.config.js        # Production-optimized Vite config
│   └── vercel.json           # Frontend deployment config
│
└── README.md                 # This file
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, React Router v6 |
| **Backend** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB Atlas |
| **AI/ML** | Google Gemini 2.5 Flash (Vision + Chat) |
| **Auth** | JWT (access + refresh tokens), HttpOnly cookies, bcrypt |
| **APIs** | NASA POWER, OpenWeather, PVGIS |
| **Security** | Helmet, CORS, HPP, express-mongo-sanitize, custom WAF |
| **Deployment** | Vercel (frontend + backend serverless) |
| **Version Control** | Git + GitHub (4-branch strategy) |

---

## 🔒 Security Architecture (Phase 13)

Solar Bharat implements a **7-layer security middleware pipeline**:

| # | Layer | Protection |
|---|-------|------------|
| 1 | **Security Headers** | X-Frame-Options, HSTS, CSP, Referrer-Policy, Permissions-Policy |
| 2 | **Helmet** | 11+ HTTP security headers automatically |
| 3 | **CORS** | Whitelisted origins with credentials support |
| 4 | **Rate Limiting** | 4 tiers: API (100/15m), Auth (10/15m), Upload (20/hr), Chat (30/min) |
| 5 | **Payload Guard** | Max 10MB request body enforcement |
| 6 | **Sanitization** | XSS stripping, NoSQL injection blocking, script tag removal |
| 7 | **WAF-lite** | Pattern-based blocking of path traversal, SQL injection, command injection |

**Additional protections:**
- Request fingerprinting (X-Request-Id)
- Sensitive data masking in responses
- Audit logging for mutations and errors
- Token blacklisting on logout
- Password-change-aware token invalidation
- Account lockout after 5 failed attempts

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Google Gemini API key

### Setup

```bash
# Clone the repository
git clone https://github.com/Atharvatare/Solar-Bharat.git
cd Solar-Bharat

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (MongoDB URI, JWT secrets, Gemini API key)

# Frontend setup
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/solar-bharat
JWT_SECRET=your-64-char-secret-here
JWT_REFRESH_SECRET=your-64-char-refresh-secret-here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-backend.vercel.app/api`

### Backend (Vercel / Render)
1. Connect GitHub repo
2. Set root directory to `backend`
3. Add all environment variables from `.env.example`
4. Ensure `vercel.json` is present in backend directory

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | User registration |
| POST | `/api/auth/login` | ❌ | User login |
| POST | `/api/auth/refresh` | 🔄 | Refresh JWT token |
| GET | `/api/dashboard/summary` | 🔒 | Dashboard stats |
| POST | `/api/bills/upload` | 🔒 | Upload bill for OCR |
| POST | `/api/solar/calculate` | 🔒 | Solar calculator |
| POST | `/api/solar/rooftop-analysis` | 🔒 | AI rooftop analysis |
| GET | `/api/solar/forecast` | 🔒 | Weather forecast |
| POST | `/api/chat/message` | 🔒 | AI chatbot |
| GET | `/api/iot/devices` | 🔒 | List IoT devices |
| GET | `/api/iot/devices/:id/live` | 🔒 | Live sensor reading |
| GET | `/api/marketplace/products` | ❌ | Browse products |
| POST | `/api/marketplace/products/compare` | ❌ | Compare products |
| GET | `/api/admin/dashboard` | 🛡️ | Admin dashboard |
| GET | `/api/admin/users` | 🛡️ | User management |
| GET | `/api/admin/leads` | 🛡️ | CRM leads |
| GET | `/api/admin/quotations` | 🛡️ | Quotations |
| GET | `/api/admin/bookings` | 🛡️ | Bookings |
| GET | `/api/health` | ❌ | Health check |

> 🔒 = Requires JWT &nbsp;|&nbsp; 🛡️ = Requires Admin role &nbsp;|&nbsp; 🔄 = Requires refresh token

---

## 🌿 Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `frontend` | Frontend-specific changes |
| `backend` | Backend-specific changes |

---

## 📋 Phase Completion Log

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Setup & Architecture | ✅ |
| 2 | Beautiful UI/UX & Core Pages | ✅ |
| 3 | Secure Backend API & Auth | ✅ |
| 4 | AI OCR Engine & Solar Calculator | ✅ |
| 5 | Analytics Dashboard & Visualization | ✅ |
| 6 | Google Maps, GIS & Rooftop Analysis | ✅ |
| 7 | AI Rooftop Detection (Gemini Vision) | ✅ |
| 8 | Weather & Solar Prediction | ✅ |
| 9 | AI Chatbot & Agent System | ✅ |
| 10 | PDF Report Generation | ✅ |
| 11 | Admin Panel, CRM & Marketplace | ✅ |
| 12 | IoT Monitoring & Smart Energy | ✅ |
| 13 | API Security & Private Systems | ✅ |
| 14 | Deployment & Production Optimization | ✅ |

---

## 👨‍💻 Author

**Atharva Tare** — Founder, Solar Bharat

- GitHub: [@Atharvatare](https://github.com/Atharvatare)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <strong>Made with ☀️ in India</strong><br/>
  <em>Powering India's Solar Future with AI</em>
</p>