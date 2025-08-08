Title: Threat Intelligence Visualizer – Student Project (Network & Security Engineering)

Goal: Build a professional-grade Threat Intelligence Visualizer web application that can collect, analyze, and visually present cyber threat data from open-source intelligence (OSINT) feeds in real-time. The project must balance high technical quality with clear code structure suitable for a student portfolio, while showcasing advanced security engineering concepts.

Key Features & Requirements:
	1.	Data Ingestion Layer
	•	Pull data from at least 2–3 public threat intelligence sources (e.g., AlienVault OTX, AbuseIPDB, MalwareBazaar, PhishTank).
	•	Implement periodic fetching (cron jobs or scheduled functions).
	•	Parse JSON, CSV, or XML feeds into a clean, unified data structure.
	2.	Data Analysis Layer
	•	Categorize threats by type (e.g., phishing, malware, DDoS, brute force).
	•	Detect trends (e.g., top attacking IPs, most targeted ports, frequent malware hashes).
	•	Add a severity scoring system based on feed data (critical, high, medium, low).
	3.	Visualization Layer (UI/UX)
	•	Interactive world map showing geolocation of threat IPs.
	•	Filter panel: filter by threat type, severity, or time range.
	•	Real-time charts (bar, pie, time-series) for threat categories and frequency.
	•	Table view with search and pagination for detailed entries.
	4.	Security Considerations
	•	Sanitize all incoming data to prevent XSS/Injection.
	•	Use HTTPS by default and enforce secure API calls.
	•	Implement authentication (JWT or OAuth) for private dashboards.
	5.	Tech Stack Recommendations
	•	Frontend: React.js, TailwindCSS or Material UI, Mapbox or Leaflet for maps, Chart.js or ECharts for graphs.
	•	Backend: Node.js (Express.js) or Python (FastAPI/Flask).
	•	Database: PostgreSQL or MongoDB for storing historical threat data.
	•	Hosting: Deploy on free-tier cloud (e.g., Vercel/Netlify for frontend, Railway/Render for backend).
	6.	Extra Credit (Optional)
	•	Alerting system: send email/SMS when a new high-severity threat appears.
	•	Export to CSV/PDF for reporting.
	•	Dark mode for UI.

Expected Output:
	•	Clean, well-documented code with comments explaining logic.
	•	Modular architecture separating fetching, analysis, and visualization.
	•	README file including setup instructions, screenshots, and explanation of design choices.
	•	Simple but professional branding for the app (name + logo).

Tone & Quality:
	•	Produce production-like code quality but keep complexity manageable for a student developer.
	•	Follow best practices for both security and maintainability.
	•	Ensure responsiveness so the dashboard works on desktop and mobile.

Deliverables:
	•	Fully functional web app.
	•	GitHub repository with commit history.
	•	Demo link (if deployed).
	•	Example screenshots or GIFs showing the dashboard in action.
