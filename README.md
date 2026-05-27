# ☀️ Solar Bharat — AI-Powered Renewable Energy Platform

Solar Bharat is a premium, full-stack, AI-powered web application designed to accelerate the adoption of clean rooftop solar energy across India. The platform helps residential, commercial, and industrial users estimate their solar savings, perform virtual rooftop analyses based on the national **PM Surya Ghar Muft Bijli Yojana** scheme, upload electricity bills for analytics, and interact with a knowledgeable AI solar assistant.

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
*   **HTTP Client**: Axios with global JWT Interceptors

### Backend
*   **Server Frame**: Node.js, Express.js (ES Module standard)
*   **Database**: MongoDB, Mongoose (Models, Seeds, Schemas)
*   **Security Stack**: Helmet (Security Headers), CORS, Express Rate Limit, Mongo-Sanitize, HPP (Parameter Pollution Protection), XSS-Clean
*   **File Uploads**: Multer (Disk storage engine)
*   **Logging**: Morgan (Dev mode HTTP logger), Winston logger

---

## 🗄️ Detailed Data Models (Schemas)

The backend features five key MongoDB schemas:

### 1. `User`
Tracks authentication credentials, user details, permissions, and energy preferences:
*   `name` (String): Full name.
*   `email` (String): Unique, verified.
*   `password` (String): Salt-hashed (bcrypt).
*   `role` (String): `['user', 'vendor', 'admin']` (Default: `'user'`).
*   `preferences` (Object): Custom parameters for customized solar matching (e.g., location, average bill).

### 2. `SolarReport`
Contains calculations and rooftop analysis results:
*   `userId` (ObjectId): Linked to `User`.
*   `reportType` (String): `['calculator', 'rooftop_analysis']`.
*   `inputs` (Object): Input parameters (roofArea, monthlyBill, electricityRate, locations).
*   `results` (Object): Calculated output details (systemSize, numberOfPanels, paybackPeriod, co2OffsetPerYear).
*   `monthlyProjection` (Array): Seasonally weighted monthly generation and cost savings list.
*   `roiProjection` (Array): 25-year cumulative savings and net benefit projection details.

### 3. `Bill`
Manages uploaded utility bills and parsed metrics:
*   `userId` (ObjectId): Linked to `User`.
*   `fileName` (String): Uploaded document file name.
*   `filePath` (String): Local upload path.
*   `status` (String): `['pending', 'processing', 'completed', 'failed']`.
*   `extractedData` (Object): Consumption (kWh), billingPeriod, electricityRate, and totalAmount.

### 4. `ChatHistory`
Maintains conversational state and classified intent logs:
*   `userId` (ObjectId): Linked to `User`.
*   `sessionId` (String): Unique session ID tracking consecutive user entries.
*   `messages` (Array): Log of prompts and generated answers with timestamps and classified intents.

### 5. `Notification`
Dispatches dashboard alerts to the user:
*   `userId` (ObjectId): Linked to `User`.
*   `title` (String), `message` (String).
*   `type` (String): `['bill_processed', 'solar_report', 'vendor_match', 'system']`.
*   `isRead` (Boolean): Read/unread toggle.

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
   * Open `.env` and fill in your connection details (especially `MONGO_URI` and `JWT_SECRET`):
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/solar-bharat
     JWT_SECRET=your_super_secure_32_character_secret_key
     JWT_REFRESH_SECRET=your_super_secure_32_character_refresh_key
     CORS_ORIGIN=http://localhost:3000
     ```
4. Seed the database with mock products, vendors, and initial admin credentials:
   ```bash
   npm run seed
   ```
5. Launch the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start running at:* `http://localhost:5000/`

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
   *The server will start running and automatically open in your browser at:* `http://localhost:3000/`

---

## 🏁 Future Roadmap & In-Development Phases

While the core web framework, layouts, local calculation algorithms, dashboard states, and responsive styling are fully functional, several advanced features are slated for upcoming releases.

### 🚧 Phase 1: AI-Powered OCR Bill Parsing
*   **Current State**: Simulated bill data extraction logic.
*   **Target**: Integration of an OCR service (e.g., Tesseract.js or Gemini Pro Vision) to automatically parse PDF and image uploads, accurately extracting billing units, consumer IDs, and DISCOM names.

### 🚧 Phase 2: Live GIS Rooftop Mapping
*   **Current State**: Simulated solar rooftop assessment using pincodes and locations.
*   **Target**: Integration with Google Solar API or Mapbox GIS layers. This will allow users to search their actual address, draw bounding box lines over their roof on an interactive satellite view, and get precise square footage and sun shading metrics directly.

### 🚧 Phase 3: DISCOM Auto-Tariff Engine
*   **Current State**: Fixed flat-rate per-unit calculation.
*   **Target**: database mapping of all Indian State Electricity Regulatory Commissions (DISCOMs like Tata Power, BESCOM, MSEDCL) to auto-calculate net-metering solar buyback rates and local slab tariffs.

### 🚧 Phase 4: Vendor Marketplace & Automated RFPs
*   **Current State**: Vendor and product schemas seeded, but marketplace flows are disabled.
*   **Target**: Launch of a matching marketplace. Users can request formal site inspections. The system automatically sends an anonymized Request for Proposal (RFP) to local, certified vendors registered on the platform, allowing secure bids and project tracking.

### 🚧 Phase 5: Mobile Monitoring Companion
*   **Current State**: Web application format only (fully responsive).
*   **Target**: React Native implementation allowing users to link their on-site solar smart inverters (via Modbus/WiFi) and view daily power outputs directly in their mobile app.