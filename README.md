# 🚗 IntelliCar — AI-Powered Vehicle Management Platform
IntelliCar is a full-stack, production-ready vehicle management system. It leverages artificial intelligence to provide personalized car recommendations, Optical Character Recognition (OCR) for document scanning, and Natural Language Processing (NLP) for an intuitive chatbot experience, all wrapped in a sleek, modern user interface.

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

## 🏗️ Architecture

| Service | Tech | Port |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind CSS | 5173 |
| Backend | Node.js + Express + MongoDB | 5000 |
| AI Service | Python + FastAPI + Scikit-learn | 8000 |

---

## ⚡ Quick Start (Local)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.10+
- [Git](https://git-scm.com/)

### 1. Clone the repo
```bash
git clone https://github.com/satyamkumar052/IntelliCar.git
cd intellicar
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in your own credentials
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Setup AI Service
```bash
cd ai-service
pip install -r requirements.txt
py train_model.py       # Run once to generate ML model
py -m uvicorn main:app --reload
```

---

## 🔐 Environment Variables

Create `backend/.env` using `backend/.env.example` as a template.

You will need:
- **MongoDB Atlas** URI (free at [mongodb.com/atlas](https://mongodb.com/atlas))
- **Cloudinary** account for document uploads


---
