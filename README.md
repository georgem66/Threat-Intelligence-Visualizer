# Threat Intelligence Visualizer

A professional-grade web application for collecting, analyzing, and visualizing cyber threat data from open-source intelligence (OSINT) feeds in real-time.

![Threat Intelligence Visualizer](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)

## 🚀 Features

### Core Features
- **Real-time Threat Monitoring**: Live dashboard with threat statistics and visualizations
- **Geographic Visualization**: Interactive world map showing threat IP geolocation
- **Data Analytics**: Charts for threat categories, severity distribution, and trends
- **Threat Management**: Search, filter, and manage threat intelligence data
- **Dark/Light Mode**: Modern UI with theme switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Security Features
- **JWT Authentication**: Secure user authentication and authorization
- **Role-based Access Control**: Admin, Analyst, and Viewer roles
- **Data Sanitization**: Protection against XSS and injection attacks
- **Rate Limiting**: API protection against abuse
- **HTTPS Enforcement**: Secure data transmission

### Data Sources (Simulated)
- AbuseIPDB simulation (IP reputation)
- MalwareBazaar simulation (malware indicators)
- PhishTank simulation (phishing URLs/domains)
- Custom threat feeds support

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Leaflet** for interactive maps
- **Chart.js** for data visualization
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js and TypeScript
- **PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** and request validation
- **Automated threat data ingestion** with cron jobs

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Threat-Intelligence-Visualizer
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=threat_intelligence_dev
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your-super-secret-jwt-key

# Build the application
npm run build

# Start the backend server
npm start
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# Serve the built application
npm run preview
```

The frontend will be available at `http://localhost:4173`

### 4. Database Setup

Create a PostgreSQL database and user:

```sql
CREATE DATABASE threat_intelligence_dev;
CREATE USER threat_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE threat_intelligence_dev TO threat_user;
```

The application will automatically create the required tables on first run.

### 5. Development Mode

For development with hot reload:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 👥 Default User Account

The application includes demo functionality. You can register users through the API:

**API Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

## 📊 Features Overview

### Dashboard
- **Threat Statistics**: Real-time metrics and counters
- **Geographic Map**: Interactive threat location visualization
- **Severity Charts**: Doughnut charts showing threat severity distribution
- **Category Analysis**: Bar charts for threat type breakdown
- **Recent Activity**: Timeline of latest threat detections

### Threat Management
- Search and filter threats by type, category, severity
- Bulk operations for threat data management
- Detailed threat information with metadata
- Export capabilities (coming soon)

### Analytics
- Time-series analysis of threat trends
- Geographic heat maps
- Source reliability analysis
- Custom reporting (coming soon)

### User Management
- Role-based access (Admin, Analyst, Viewer)
- User profile management
- Activity logging
- Settings and preferences

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=threat_intelligence_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Deployment

### Production Deployment

**Backend Deployment:**
1. Set up PostgreSQL database
2. Configure production environment variables
3. Build and deploy: `npm run build && npm start`

**Frontend Deployment:**
1. Update API URL in environment
2. Build: `npm run build`
3. Deploy `dist/` folder to web server or CDN

## 🔒 Security Considerations

- **API Security**: All endpoints are protected with JWT authentication
- **Data Validation**: Input validation using express-validator and Joi
- **SQL Injection Protection**: Sequelize ORM with parameterized queries
- **XSS Protection**: Content sanitization and CSP headers
- **Rate Limiting**: Protection against API abuse
- **HTTPS**: Use HTTPS in production (configure reverse proxy)

## 🛠 Development

### Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── dist/                # Compiled JavaScript
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   └── dist/                # Built application
└── README.md
```

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

**Threats:**
- `GET /api/threats` - List threats with pagination
- `GET /api/threats/search` - Search threats
- `GET /api/threats/stats` - Threat statistics
- `POST /api/threats` - Create threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

**Analytics:**
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/timeseries` - Time series data
- `GET /api/analytics/geographic` - Geographic data

**Users:**
- `GET /api/users/me` - Current user profile
- `GET /api/users` - List all users (admin only)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Frontend Can't Connect to Backend**
   - Check backend is running on port 3001
   - Verify VITE_API_URL in frontend .env
   - Check CORS configuration

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear browser localStorage for fresh start

### Development Tips

- Use `npm run dev` for both frontend and backend development
- Check browser developer tools for detailed error messages
- Monitor backend logs for API errors
- Use database administration tools for data inspection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Chart.js for visualization components
- TailwindCSS for the design system
- All the open-source threat intelligence communities

---

**Built with ❤️ for the cybersecurity community**
