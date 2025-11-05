# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**crmed** is a medical calculation and reference web application for healthcare professionals, built with React + Vite. The application provides various medical calculators, reference tables, and a reservation system. It uses a client-server architecture with an Express backend and SQLite database.

## Development Commands

### Frontend (Vite)
- `npm run dev` - Start Vite dev server on port 3000
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

### Backend (Express)
- `npm run server` - Start Express API server on port 3001

### Combined
- `npm run dev:all` - Run both frontend and backend concurrently

### Important Notes
- The frontend proxies `/api` requests to `http://localhost:5000` (configured in vite.config.js), but the actual backend runs on port 3001
- When working on the reservation system, you need both servers running

## Architecture

### Client-Server Communication
- **Frontend**: React SPA running on Vite dev server (port 3000)
- **Backend**: Express server (port 3001) providing REST API
- **Database**: SQLite database (`server/reservations.db`) for reservation data
- **Proxy**: Vite proxies `/api` requests to backend server

### Frontend Structure
```
src/
├── main.jsx          - App entry point
├── App.jsx           - Main router component with all route definitions
├── pages/            - Page components (each is a standalone tool)
│   ├── HomePage.jsx           - Landing page with navigation cards
│   ├── BMIPage.jsx            - BMI calculator
│   ├── HbA1cPage.jsx          - HbA1c conversion calculator
│   ├── SteroidPage.jsx        - Topical steroid strength reference
│   ├── ExtMedValuePage.jsx    - External medication unit reference
│   ├── ExtMedSearchPage.jsx   - Incremental search for medications
│   ├── DNStagePage.jsx        - Diabetic nephropathy stage calculator
│   └── ReservationPage.jsx    - Appointment booking system (uses API)
└── data/             - Static reference data
    ├── steroidData.js
    └── extMedValue.js
```

### Backend Structure
```
server/
├── index.js          - Express server with API endpoints
└── reservations.db   - SQLite database (auto-created on first run)
```

### API Endpoints (server/index.js)
- `GET /api/health` - Server health check
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:date` - Get reservations for specific date
- `GET /api/reservations-count/:date` - Get reservation count for date (max 5)
- `POST /api/reservations` - Create new reservation (requires customer_id, date, time)
- `DELETE /api/reservations/:id` - Delete reservation by ID

## Key Features

### Reservation System
- **Availability**: Only Wednesdays and Saturdays
- **Time Slots**: 15-minute intervals (9:00-12:00, 14:00-18:00)
- **Capacity**: Maximum 5 reservations per day
- **Color Coding**: Green (available) → Red (full)
- **Requirements**: customer_id is required for all reservations
- **Database Schema**: `reservations` table with id, customer_id, date, time, created_at
- **Unique Constraint**: UNIQUE(date, time) prevents double-booking

### Static Reference Tools
- BMI Calculator
- HbA1c to average blood glucose converter
- Topical steroid strength classification
- External medication dosage units
- Diabetic nephropathy stage determination

## Code Style

### ESLint Configuration
- Uses flat config format (eslint.config.js)
- React Hooks recommended rules enabled
- React Refresh for Vite
- Unused vars allowed if they match pattern `^[A-Z_]` (for React components/constants)

### Component Patterns
- All pages follow similar structure:
  - Import `useNavigate` from react-router-dom
  - Include "← トップページに戻る" back button
  - Tailwind CSS for styling
  - Gradient background: `bg-gradient-to-br`
  - Card layout: `bg-white p-8 rounded-lg shadow-lg`

## Database Management

### Initialization
The database is automatically created and initialized when the Express server starts (server/index.js:21-59).

### Schema
```sql
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  date TEXT NOT NULL,          -- Format: YYYY-MM-DD
  time TEXT NOT NULL,          -- Format: HH:MM (24-hour)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, time)
)
```

## Git Workflow

- Main branch: `main`
- Current feature branch: `feature-reserve`
- Recent commits focus on reservation system enhancements (customer ID, color-coded availability)

## Common Tasks

### Adding a New Tool Page
1. Create component in `src/pages/NewToolPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation card in `src/pages/HomePage.jsx`
4. Follow existing page structure (back button, consistent styling)

### Modifying Reservation Logic
- Business rules are enforced in server/index.js (max 5/day, unique time slots)
- Frontend validation is in ReservationPage.jsx
- Calendar generation logic is in ReservationPage.jsx:162-197

### Working with Static Data
- Add/modify reference data in `src/data/` directory
- Export as JavaScript objects/arrays
- Import in corresponding page component
