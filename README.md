# ☀️ Solar Bharat — AI-Powered Renewable Energy Platform

## 💡 The Solar Bharat Vision & Idea
**Solar Bharat** is born out of a vision to democratize and accelerate the green transition in India. Inspired by the national target of reaching **500 GW of non-fossil energy capacity by 2030** and the flagship **PM Surya Ghar Muft Bijli Yojana**, this platform serves as an all-in-one bridge between citizens, state utilities (DISCOMs), and local verified vendors.

Many homeowners and businesses in India are eager to go solar but get discouraged by the lack of clear financial projections, confusing government subsidy calculations, spatial layouts, and vendor discovery. **Solar Bharat solves this by putting smart, AI-driven assessment tools directly into the hands of the public.**

---

## 🌟 How It Is Helpful (Social, Financial & Green Impact)
*   **📉 Slashing Electricity Expenses**: Users get immediate, highly customized mathematical calculations showing how their monthly power bills can drop from thousands of rupees to near zero.
*   **🧩 Subsidy Simplification**: It demystifies the PM Surya Ghar subsidy levels, showing exact upfront savings breakdown and precise return on investment (ROI) timelines.
*   **🌳 Climate Accountability**: Translates technical energy statistics (kWh) into digestible environmental metrics, showing users the exact equivalent of trees planted and CO₂ offset.
*   **🔍 Transparency**: Eliminates vendor pricing ambiguity by allowing future standardized RFP quotes.

---

## 🎯 Target Audience & Core Use Cases
*   **🏠 Residential Homeowners**: Quick estimation of panels needed for their rooftops, self-consumption savings, and guidance through grid-tied net-metering.
*   **🏭 Commercial & Industrial (C&I) Units**: Larger capacity projections, payback estimates for high-load settings, and corporate sustainability metrics.
*   **💼 Solar Vendors & Installers**: Discover vetted local leads, submit project bids, and streamline client installations.
*   **👮 Administrators & Policy Makers**: Overview of regional solar interest, user registrations, and system health performance.

---

## 👤 About the Developer
**Solar Bharat** is designed, developed, and maintained by **Atharva Tare**.
*   **Developer**: Atharva Tare
*   **Email**: [atharvatare30@gmail.com](mailto:atharvatare30@gmail.com)
*   **GitHub**: [@Atharvatare](https://github.com/Atharvatare)

Driven by a passion for building high-impact, premium digital products that combine beautiful modern design with deep scientific utilities to solve real-world problems.

---

## 🚀 Key Features

*   **📊 Dynamic User Dashboard**: Interactive data visualizations displaying real-time power generation estimates, cumulative lifetime savings, and carbon offset tracking (CO₂ reduction & trees equivalent).
*   **📐 PM Surya Ghar Solar Calculator**: Accurate mathematical systems calculation including required panel surface area, number of panels, system size (kW), total cost, government subsidies, and payback timeline (years).
*   **🏠 Virtual Rooftop Suitability Analysis**: Simulated AI analysis for Usable Area, Orientation suitability (bias towards South-facing arrays), Shading factor, Tilt, and structural suitability.
*   **📄 Intelligent Bill Upload**: Easily upload utility files to extract energy consumption (kWh), bill amount, and monthly trends for customized solar matching.
*   **🤖 AI Solar Chat Companion**: Interactive assistant providing answers on government policies, net metering protocols, maintenance rules, battery backups, and DISCOM processes.
*   **🛡️ Robust Admin Panel**: Comprehensive view of system health, active users, and system overview statistics.

---

## 🧱 Technical Architecture & Tech Stack

### Frontend
*   **Core**: React (v18), React Router Dom (v6)
*   **Styling**: TailwindCSS (v3), PostCSS, Vanilla CSS styling variables (Tailored HSL theme engine)
*   **Charts & Visuals**: Recharts (Dynamic HSL gradients), React Icons
*   **Animations**: Framer Motion (Subtle micro-animations & transitions)
*   **HTTP Client**: Axios with global JWT Interceptors & auto token refresh

### Backend
*   **Server Frame**: Node.js, Express.js (ES Module standard)
*   **Database**: MongoDB Atlas, Mongoose (10 Models, Seeds, Schemas)
*   **Authentication**: JWT (access + refresh tokens), bcrypt (12 rounds), crypto-based email verification & password reset
*   **Security Stack**: Helmet (CSP + Security Headers), CORS, Express Rate Limit (4 tiers), Mongo-Sanitize, HPP, XSS sanitization, token blacklisting, session tracking, login lockout
*   **File Uploads**: Multer (Disk storage engine)
*   **Logging**: Morgan (Dev mode HTTP logger), Winston logger (file rotation)

---

## 🔒 Security Features (Phase 3)

| # | Feature | Description |
|---|---------|-------------|
| 1 | JWT Authentication | Access (15m) + Refresh (7d) tokens with issuer/audience claims |
| 2 | Refresh Token Rotation | New token pair on every refresh; reuse detection auto-revokes all sessions |
| 3 | Token Blacklisting | Revoked tokens checked on every request via DB lookup + TTL auto-cleanup |
| 4 | Session Tracking | Per-device session with browser, OS, IP, and activity timestamps |
| 5 | Login Lockout | 5 failed attempts → 30 min account lock + email alert |
| 6 | Email Verification | Crypto SHA-256 tokens with 24hr expiry |
| 7 | Password Reset | Crypto SHA-256 tokens with 1hr expiry; invalidates all sessions |
| 8 | Password Change Guard | All other sessions invalidated + current token blacklisted |
| 9 | XSS Sanitization | Script/iframe/event handler stripping on all request bodies |
| 10 | NoSQL Injection | express-mongo-sanitize + $ key blocking |
| 11 | Rate Limiting | API: 100/15min, Auth: 10/15min, Upload: 20/hr, Chat: 30/min |
| 12 | httpOnly Cookies | Refresh tokens stored in secure httpOnly cookies |
| 13 | CSP Headers | Content Security Policy via Helmet |
| 14 | No Frontend API Keys | All third-party calls proxy through backend |

---

## 🗄️ Database Models (10 Collections)

| Model | Purpose |
|-------|---------|
| `User` | Auth credentials, profile, solar system, preferences, login security |
| `Session` | Active sessions with device info and TTL auto-expiry |
| `TokenBlacklist` | Revoked access tokens with TTL auto-cleanup |
| `SolarReport` | Calculator results, rooftop analysis, monthly/ROI projections |
| `Bill` | Uploaded utility bills with analysis and recommendations |
| `Analytics` | Energy, financial, environmental, and system performance metrics |
| `ChatHistory` | AI chat sessions with message history |
| `Notification` | User notification system with types and read status |
| `Product` | Solar panels, inverters, batteries catalog |
| `Vendor` | Installation companies with service areas and ratings |

---

## 🛠️ Step-by-Step Setup & Installation

### Prerequisites
*   **Node.js** (v18.0.0 or higher)
*   **MongoDB** (Local instance or MongoDB Atlas Connection URI)

---

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install node package dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration file:
   * Copy the `.env.example` file to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in your connection details:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/solar-bharat
     JWT_SECRET=your_super_secure_64_character_secret_key_change_in_production
     JWT_REFRESH_SECRET=your_super_secure_64_character_refresh_key_change_in_production
     CORS_ORIGIN=http://localhost:3000
     FRONTEND_URL=http://localhost:3000
     ```
4. Seed the database with mock products, vendors, and initial credentials:
   ```bash
   npm run seed
   ```
5. Launch the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start running at:* `http://localhost:5000/`

### Default Credentials (after seeding)
| Role | Email | Password | Email Verified |
|------|-------|----------|----------------|
| Admin | admin@solarbharat.com | Admin@123 | ✅ |
| User | user@solarbharat.com | User@123 | ✅ |
| New User | new@solarbharat.com | New@1234 | ❌ |

---

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React/Vite development server:
   ```bash
   npm run dev
   ```
   *The server will start running at:* `http://localhost:3000/`

---

## 🌐 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel with SPA rewrites configured.

### Backend (Vercel Serverless / Any Node.js Host)
Deploy the backend separately with proper environment variables configured.

---

## 🏁 Future Roadmap & In-Development Phases

### 🚧 Phase 1: AI-Powered OCR Bill Parsing
*   **Current State**: Simulated bill data extraction logic.
*   **Target**: Integration of an OCR service (e.g., Tesseract.js or Gemini Pro Vision) to automatically parse PDF and image uploads.

### 🚧 Phase 2: Live GIS Rooftop Mapping
*   **Current State**: Simulated solar rooftop assessment using pincodes and locations.
*   **Target**: Integration with Google Solar API or Mapbox GIS layers for precise rooftop mapping.

### 🚧 Phase 3: DISCOM Auto-Tariff Engine
*   **Current State**: Fixed flat-rate per-unit calculation.
*   **Target**: Database mapping of all Indian DISCOMs for auto-calculated net-metering solar buyback rates.

### 🚧 Phase 4: Vendor Marketplace & Automated RFPs
*   **Current State**: Vendor and product schemas seeded, but marketplace flows are disabled.
*   **Target**: Launch of a matching marketplace with automated RFP system.

### 🚧 Phase 5: Mobile Monitoring Companion
*   **Current State**: Web application format only (fully responsive).
*   **Target**: React Native implementation with solar inverter integration.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).