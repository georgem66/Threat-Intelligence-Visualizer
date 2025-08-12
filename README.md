# Threat Intelligence Visualizer 

Welcome to the Threat Intelligence Visualizer - your comprehensive cybersecurity companion for monitoring and analyzing digital threats in real-time. Whether you're a security analyst, IT professional, or cybersecurity enthusiast, this platform helps you stay ahead of emerging threats with powerful visualization tools and intelligent analytics.

## What Does This Software Do? 

Imagine having a crystal ball for cybersecurity threats. Our Threat Intelligence Visualizer does exactly that by:

- **Collecting threat data** from multiple intelligence sources automatically
- **Visualizing threats** on an interactive world map so you can see where attacks are coming from
- **Analyzing patterns** with beautiful charts and graphs that make complex data easy to understand  
- **Monitoring in real-time** so you're always aware of the latest security landscape
- **Providing insights** through dashboards that help you make informed security decisions

Think of it as your personal cybersecurity command center that turns overwhelming threat data into actionable intelligence.

## Who Is This For? 

- **Security Analysts** who need to monitor and respond to threats quickly
- **IT Administrators** protecting their organization's digital assets
- **Cybersecurity Students** learning about threat intelligence and visualization
- **Security Teams** collaborating on threat analysis and incident response
- **Anyone** interested in understanding the global cybersecurity landscape

## Key Features 

### **Interactive Threat Map**
See exactly where threats are coming from with our beautiful world map. Click on any location to get detailed information about threat activity in that region.

### **Smart Analytics Dashboard**
Get the big picture with:
- Real-time threat counts and statistics
- Severity level breakdowns (Critical, High, Medium, Low)
- Threat category analysis (Malware, Phishing, Botnets, etc.)
- Time-based trends to spot patterns

### **Secure Multi-User Access**
- Role-based access control (Admin, Analyst, Viewer)
- JWT-based authentication for enterprise security
- Personal dashboards and preferences

### **Modern User Experience**
- Dark and light theme modes
- Responsive design that works on any device
- Intuitive interface that doesn't require a cybersecurity PhD to use

## System Requirements 

### For Users (Running the Application):
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: For real-time threat data updates
- **Screen Resolution**: 1024x768 minimum (works great on mobile too!)

### For Developers (Setting Up the System):
- **Node.js**: Version 18 or higher ([Download here](https://nodejs.org/))
- **PostgreSQL**: Version 12 or higher ([Download here](https://www.postgresql.org/download/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository
- **Operating System**: Windows, macOS, or Linux

## How to Get Started 

### Step 1: Get the Code
```bash
git clone https://github.com/your-username/Threat-Intelligence-Visualizer.git
cd Threat-Intelligence-Visualizer
```

### Step 2: Set Up the Database
1. Install PostgreSQL on your system
2. Create a new database called `threat_intelligence`
3. Note down your database credentials (username, password, host, port)

### Step 3: Configure the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with your settings:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=threat_intelligence
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=make-this-a-very-long-random-string
PORT=3001
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### Step 4: Set Up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:3001/api
```

Start the frontend:
```bash
npm run dev
```

### Step 5: Access Your Application
Open your web browser and go to `http://localhost:5173`

**Default Login Credentials:**
- Email: `admin@example.com`
- Password: `Admin123!`

## How to Use the Software 📖

### Getting Started
1. **Login**: Use the demo credentials or create a new account
2. **Explore the Dashboard**: This is your main command center showing threat overview
3. **Check the Map**: Click on different countries to see threat details
4. **Analyze Charts**: Use the severity and category charts to understand threat patterns
5. **View Recent Activity**: See the latest threats detected by the system

### Understanding the Data
- **Threat Severity**: 
  - 🔴 Critical: Immediate action required
  - 🟠 High: Important threats to monitor
  - 🟡 Medium: Noteworthy security events
  - 🟢 Low: Minor security observations

- **Threat Categories**:
  - Malware: Malicious software and viruses
  - Phishing: Fake websites trying to steal information
  - Botnets: Networks of infected computers
  - DDoS: Attacks that overwhelm websites
  - And more!

### Advanced Features
- **Analytics Page**: Deep dive into threat trends and patterns
- **Settings**: Customize your experience and switch between themes
- **User Management**: Admins can manage team access and roles

## Troubleshooting Common Issues 🔧

**Problem**: Can't connect to database
**Solution**: Make sure PostgreSQL is running and your `.env` credentials are correct

**Problem**: Frontend won't start
**Solution**: Make sure the backend is running first, then check your `VITE_API_URL` setting

**Problem**: No threat data showing
**Solution**: The system needs a few minutes to collect initial data after first startup

## Technical Details 🛠️

**Frontend Technology:**
- React 19 with TypeScript for robust user interfaces
- Vite for lightning-fast development
- TailwindCSS for beautiful, responsive styling
- Chart.js for interactive data visualizations
- Leaflet for the interactive world map

**Backend Technology:**
- Node.js with Express.js for the API server
- PostgreSQL database for reliable data storage
- Sequelize ORM for database management
- JWT authentication for secure access
- Automated threat intelligence collection

---

