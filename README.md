# DineDesk 🍽️
### Advanced Restaurant Ordering & Table Management Platform
**Stack**: Next.js 14 (App Router) · Node.js · Socket.io · Prisma ORM · PostgreSQL / SQLite · Tailwind CSS

---

## 🌟 Executive Overview
**DineDesk** is an enterprise-grade, portfolio-ready restaurant operating system that centralizes front-of-house table service, digital QR dining, kitchen operations (KDS), and predictive inventory analytics into a unified real-time application.

### Key Highlights
- 📱 **Mobile-First Customer QR App**: Deep-linked table sessions (`/?table=T-01`), customizable dishes (spice levels, add-ons, notes), instant search, and allergen filtering.
- 🔔 **Live "Call Waiter" Buzzer**: 1-tap table call (Water, Bill, Cutlery, Assistance) that pings the waiter dashboard with sound chimes via WebSockets.
- 🍳 **Kitchen Display System (KDS)**: Live ticket board, delay threshold color alerts (<10m green, 10–20m amber, >20m flashing red), Web Audio API chimes, and instant 86'd stock controls.
- 📊 **Predictive Restocking Analytics**: 7-day moving-average demand forecasting for critical culinary ingredients with automated purchase order generation.
- ⚡ **Dynamic Happy-Hour Pricing Engine**: Configurable time windows (e.g., 20% off Cocktails & Starters) that automatically cross out original prices and apply discounts in real-time.
- 🧾 **Interactive Split-Bill Calculator**: Built into the checkout drawer to split checks evenly across diners or customize tips.
- 🪑 **Floor Plan & QR Code Studio**: Visual table capacity editor with SVG/PNG high-resolution QR generator for every table and printable table card sheets.
- 🌍 **Multi-Language Menu (i18n)**: Instant language toggle between English, Español, Français, and हिन्दी.
- 🔑 **1-Click Fast Role Switcher**: Quick-switch demo accounts for Customer, Waiter, Kitchen, Admin, and Super Admin.

---

## 🚀 Getting Started from Scratch in VS Code

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Open folder: `C:\Users\ruman\.gemini\antigravity-ide\scratch\dinedesk` (or your chosen directory).
3. Open a new Terminal in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`).

---

### Step 2: Install Dependencies
Run the following command in the VS Code terminal:
```bash
npm install
```

---

### Step 3: Initialize Database & Seed Demo Data
DineDesk is configured with Prisma to run out-of-the-box with zero setup required. Run:
```bash
npm run db:setup
```
*(This automatically generates the Prisma Client, pushes the database schema, and seeds realistic culinary dishes, tables, active tickets, and predictive inventory).*

> **Note on PostgreSQL**: If you wish to connect to a production PostgreSQL database (Neon, Supabase, Railway, Docker):
> 1. Open `prisma/schema.prisma` and change `provider = "sqlite"` to `provider = "postgresql"`.
> 2. Open `.env` and set your `DATABASE_URL="postgresql://user:password@localhost:5432/dinedesk?schema=public"`.
> 3. Run `npm run db:setup`.

---

### Step 4: Start the Unified Next.js + Socket.io Server
Run:
```bash
npm run dev
```

Your server will spin up on **`http://localhost:3000`** with Next.js App Router and real-time Socket.io active on the exact same port!

---

## 🧭 Live Portals & Testing Links

Open these tabs in your browser to experience the real-time bidirectional synchronization:

| Role / Portal | URL | Highlights |
| :--- | :--- | :--- |
| **📱 Customer App** | [http://localhost:3000/](http://localhost:3000/) | Digital menu, QR dine-in (`?table=T-01`), Cart, Split-Bill, Call Waiter |
| **🍳 Kitchen Display (KDS)** | [http://localhost:3000/kds](http://localhost:3000/kds) | Live ticket queue, delay alerts, audio chimes, 86'd out-of-stock toggles |
| **🛎️ Waiter Desk** | [http://localhost:3000/waiter](http://localhost:3000/waiter) | Live "Call Waiter" incoming buzzer, interactive table floor plan state editor |
| **📊 Admin Dashboard** | [http://localhost:3000/admin](http://localhost:3000/admin) | Sales revenue, peak hours chart, top sellers, recent orders ledger |
| **🍽️ Menu Management** | [http://localhost:3000/admin/menu](http://localhost:3000/admin/menu) | Full CRUD for dishes, allergens, categories, prices |
| **🪑 QR Code Studio** | [http://localhost:3000/admin/tables](http://localhost:3000/admin/tables) | Generate & download QR codes for each table + print sheets |
| **📅 Reservations** | [http://localhost:3000/admin/reservations](http://localhost:3000/admin/reservations) | Table bookings, party sizes, confirmation management |
| **📈 Predictive Restocking** | [http://localhost:3000/admin/restocking](http://localhost:3000/admin/restocking) | 7-day moving-average inventory demand forecasting |
| **⚡ Dynamic Happy Hour** | [http://localhost:3000/admin/happy-hour](http://localhost:3000/admin/happy-hour) | Promotional pricing rules engine with real-time menu strikethrough |
| **👑 Super Admin (SaaS)** | [http://localhost:3000/super-admin](http://localhost:3000/super-admin) | Multi-tenant fleet, GMV metrics, and WebSocket health telemetry |
| **🔑 1-Click Fast Login** | [http://localhost:3000/login](http://localhost:3000/login) | Instant 1-click role switcher for recruiters and interviewers |

---

## 🧪 Comprehensive Real-Time Verification Flow

Follow this 3-minute walkthrough to verify the full real-time architecture:

1. **Step 1: Open Two Windows Side-by-Side**
   - Window 1: **Customer Menu** at `http://localhost:3000/?table=T-03`
   - Window 2: **Kitchen Display (KDS)** at `http://localhost:3000/kds`
   - Window 3 (Optional): **Waiter Desk** at `http://localhost:3000/waiter`

2. **Step 2: Place a Dine-In Order**
   - In Window 1 (Customer), customize any dish (e.g., *Prime Wagyu Smash Burger*, choose Hot spice 🌶️🌶️🌶️ and Add Truffle Infusion).
   - Click **Add to Order**, open Cart, test the **Split-Bill Calculator**, and click **Confirm & Place Order**.
   - Watch **Window 2 (KDS)** instantly chime (Web Audio API) and display the new ticket for Table T-03 without any page reload!

3. **Step 3: Advance Ticket Status**
   - On the KDS ticket, click **Start Cooking** (`PREPARING`) -> observe the Customer screen progress bar advance.
   - On the KDS ticket, click **Mark Order Ready** (`READY`) -> observe the Customer screen show "Plated & Ready".

4. **Step 4: Test Live "Call Waiter" Buzzer**
   - On Window 1 (Customer), click the floating **"🔔 Call Waiter"** button at the bottom-left.
   - Choose **"Water Carafe Refill"** and tap Ring Service Bell.
   - Look at Window 3 (Waiter Desk): the service bell rings and a high-priority buzzer ticket appears with Table T-03! Click **Clear Call** to resolve.

5. **Step 5: Test 86'd Out-of-Stock Item Controls**
   - In the KDS header, open the **86'd Items** drawer and toggle any dish (e.g., *Yellowfin Tuna Tartare*) to Sold Out.
   - Notice that the dish immediately turns greyed-out with a red "86'd / Sold Out" badge on the Customer Menu in real time!

6. **Step 6: Test Dynamic Happy-Hour Pricing**
   - Visit `/admin/happy-hour`, toggle Happy Hour ON or adjust discount to 25%.
   - Visit Customer Menu: notice the gold Happy Hour banner and strike-through pricing!

---

## 📁 Repository Structure
```
dinedesk/
├── server.js                        # Unified HTTP + Socket.io + Next.js server
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma                # Relational schema (Orders, Tables, Menu, Inventory)
│   └── seed.js                      # Realistic bistro culinary seed data
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with fonts & PWA tags
│   │   ├── page.tsx                 # Customer Menu & Ordering App
│   │   ├── tables/[tableId]/page.tsx# Direct QR scan redirector
│   │   ├── kds/page.tsx             # Kitchen Display System
│   │   ├── waiter/page.tsx          # Waiter Dashboard & Call Buzzer
│   │   ├── login/page.tsx           # Authentication & 1-Click Role Switcher
│   │   ├── admin/                   # Operations & Analytics Suite
│   │   │   ├── page.tsx             # Executive KPI Dashboard
│   │   │   ├── menu/page.tsx        # Menu CRUD & Dish creator
│   │   │   ├── tables/page.tsx      # Table Floor Plan & QR Code Studio
│   │   │   ├── reservations/page.tsx# Table Bookings
│   │   │   ├── restocking/page.tsx  # Predictive Restocking Analytics
│   │   │   └── happy-hour/page.tsx  # Dynamic Happy-Hour Engine
│   │   ├── super-admin/page.tsx     # SaaS Platform Monitor
│   │   └── api/                     # Next.js REST API routes
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ItemCustomizerModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CallWaiterModal.tsx
│   │   ├── OrderTrackingModal.tsx
│   │   ├── ReviewModal.tsx
│   │   └── TableQRCodeModal.tsx
│   └── lib/
│       ├── prisma.ts
│       ├── socket.ts
│       ├── audio.ts                 # Web Audio API synthesizers
│       ├── i18n.ts                  # Multi-language translations
│       └── types.ts
```

---

## 🏆 Portfolio Talking Points for Interviews
- **Unified Real-time Architecture**: Merged Next.js App Router and Socket.io in a single process (`server.js`), eliminating CORS issues and avoiding microservice overhead.
- **Resilient Fallback Design**: Database abstraction configured with Prisma to support SQLite locally without external service dependencies, and 1-line switchable to PostgreSQL for production.
- **Zero-Dependency Synthesized Audio**: Built audio cues using native Web Audio API oscillators, ensuring 100% reliable sound playback without external audio assets or network latency.
- **Event-Driven UI**: Sub-second synchronization across mobile customer sessions, waiter alerts, kitchen display tickets, and stock depletion events.
