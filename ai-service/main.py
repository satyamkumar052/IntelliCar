from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create placeholder modules if they don't exist yet to avoid startup crash
import sys
from pathlib import Path

app = FastAPI(title="IntelliCar AI Microservice", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from routers import recommend, ocr, chatbot
    # Include routers
    app.include_router(recommend.router, prefix="/api", tags=["Recommendations"])
    app.include_router(ocr.router, prefix="/api", tags=["OCR"])
    app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])
except ImportError:
    print("Routers not fully initialized yet. Creating stubs.")

@app.get("/docs", include_in_schema=False)
def get_docs():
    return {"message": "Go to /docs or /redoc for Swagger UI"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "IntelliCar AI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
