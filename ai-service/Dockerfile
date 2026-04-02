FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Tesseract and OpenCV (if needed)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

COPY . .

EXPOSE 8000

# Generating the dummy dataset, training the recommendation ml model, then standing up FastAPI
CMD python train_model.py && uvicorn main:app --host 0.0.0.0 --port 8000
