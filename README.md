# Threat Intelligence Visualizer

A professional web application for collecting, analyzing, and visualizing cyber threat data in real-time.

## 🚀 Features

- **Real-time Threat Monitoring**: Live dashboard with threat statistics and visualizations
- **Geographic Visualization**: Interactive world map showing threat IP geolocation  
- **Data Analytics**: Charts for threat categories, severity distribution, and trends
- **JWT Authentication**: Secure user authentication and authorization
- **Dark/Light Mode**: Modern UI with theme switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, Chart.js, Leaflet  
**Backend:** Node.js, Express.js, TypeScript, PostgreSQL, Sequelize, JWT

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env file with your database credentials
npm run build
npm start
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
npm run build  
npm run preview
```

### 3. Development Mode
```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)  
cd frontend && npm run dev
```

## 🔧 Environment Configuration

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=threat_intelligence_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

## 📊 API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/threats` - List threats with pagination
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/geographic` - Geographic data

---

**Built for the cybersecurity community** 🛡️


