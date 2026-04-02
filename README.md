# 🚗 IntelliCar — AI-Powered Vehicle Management Platform

A full-stack, production-ready car management system with AI-driven recommendations, OCR document scanning, and an NLP chatbot.

---

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

## ✨ Features

- 🔐 JWT Authentication (Register/Login)
- 🚗 Vehicle Fleet Management
- 📄 Document Vault with AI OCR (RC, Insurance, PUC)
- 🤖 NLP Chatbot (RTO, challans, service centers)
- 🎯 AI Car Recommendation Engine (Scikit-learn)
- 🗺️ Location Finder (RTOs & Service Centers)
- 🔔 Automated Expiry Email Reminders
- 📊 Dashboard with document health charts
