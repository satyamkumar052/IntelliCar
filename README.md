# 🚗 IntelliCar — AI-Powered Vehicle Management Platform
IntelliCar is a full-stack, production-ready system. It leverages artificial intelligence to provide personalized car recommendations, Optical Character Recognition (OCR) for document scanning, and Natural Language Processing (NLP) for an intuitive chatbot experience, all wrapped in a sleek, modern user interface.

---

## ✨ Key Features
- **🔐 Secure Authentication:** JWT-based user registration and login.
- **🚗 Vehicle Fleet Management:** Add, track, and manage your vehicles seamlessly.
- **📄 AI-Powered Document Vault:** Securely store documents (RC, Insurance, PUC) and auto-extract details using AI OCR.
- **🤖 Intelligent NLP Chatbot:** Context-aware assistant to help with RTO queries, challans, and service centers.
- **🎯 AI Car Recommendation Engine:** Scikit-learn based machine learning model providing customized car suggestions.
- **🗺️ Location Finder:** Locate nearby RTOs & Service Centers (OpenStreetMap integration/Google Maps).
- **🔔 Automated Reminders:** CRON job powered email alerts for document expiries (Insurance, PUC).
- **📊 Real-time Dashboard:** Document health charts and statistics.
- **🌐 3D Interactive UI:** Built with Framer Motion and Three.js (React Three Fiber) for an immersive experience.

---

## 🛠️ Technology Stack
### Frontend (Client-side)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Material UI (MUI)
- **State Management:** Redux Toolkit
- **Animations & 3D:** Framer Motion, Three.js (@react-three/fiber, @react-three/drei)
- **Forms & Validation:** React Hook Form + Zod
- **Charts:** Recharts
### Backend (API Server)
- **Environment:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Storage:** Cloudinary (Document/Image uploads via Multer)
- **Cron Jobs & Mailing:** node-cron + Nodemailer
- **Security:** Helmet, express-rate-limit
### AI Service (Machine Learning & NLP)
- **Framework:** Python + FastAPI
- **Machine Learning:** Scikit-learn, Pandas
- **OCR:** Pytesseract (Tesseract OCR), Pillow
- **NLP:** SpaCy, NLTK

---

## 🏗️ Architecture
| Service | Technology | Default Port |
|---|---|---|
| **Frontend** | React + Vite | `5173` |
| **Backend** | Node.js + Express + MongoDB | `5000` |
| **AI Service** | Python + FastAPI | `8000` |

---

## ⚡ Quick Start (Local Development)
### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://python.org/) (v3.10 or higher)
- [MongoDB Atlas](https://mongodb.com/atlas) Account or Local MongoDB Instance
- [Cloudinary](https://cloudinary.com/) Account
### 1. Clone the Repository
```bash
git clone https://github.com/satyamkumar052/IntelliCar.git
cd IntelliCar
```
### 2. Setup the Backend
```bash
cd backend
npm install
# Create environment variables file
cp .env.example .env
```
Edit `backend/.env` with your actual MongoDB URI, Cloudinary credentials, SMTP settings, etc.
```bash
npm run dev
```
### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
### 4. Setup the AI Service
Open a third terminal window:
```bash
cd ai-service
# Install Python dependencies
pip install -r requirements.txt
# Run once to train and generate the ML model
python train_model.py
# Start the FastAPI server
python -m uvicorn main:app --reload
```

---

## 🔐 Environment Variables
You need to configure the following environment variables to run the project. Use the provided `.env.example` file in the `backend` directory as a template.
### Backend (`backend/.env`)
```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intellicar
JWT_SECRET=your_super_secret_jwt_key
# AI Service Connection
AI_SERVICE_URL=http://localhost:8000
# Cloudinary Integration (for document uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Email Alerts (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
### Frontend (`frontend/.env`)
*(Create this if `.env` does not exist in frontend)*
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure
```text
IntelliCar/
├── ai-service/        # Python FastAPI application for ML & NLP
│   ├── data/          # Datasets for ML
│   ├── models/        # Trained AI models
│   ├── routers/       # API endpoints (FastAPI)
│   ├── services/      # Business logic (OCR, NLP processing)
│   ├── main.py        # FastAPI entry point
│   └── train_model.py # ML model training script
├── backend/           # Node.js/Express API
│   ├── controllers/   # Request handlers
│   ├── jobs/          # Cron jobs (e.g., expiry reminders)
│   ├── middleware/    # Auth & Security middlewares
│   ├── models/        # Mongoose Database schemas
│   ├── routes/        # API routing
│   ├── utils/         # Helper functions
│   └── server.js      # Express entry point
└── frontend/          # React Vite application
    ├── public/        # Static assets
    ├── src/           # React components, pages, Redux store
    ├── index.html     # HTML entry point
    └── vite.config.js # Vite configuration
```

---
