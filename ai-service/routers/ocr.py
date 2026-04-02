from fastapi import APIRouter, UploadFile, File
from services.ocr_service import ocr_service

router = APIRouter()

@router.post("/ocr")
async def extract_document_info(file: UploadFile = File(...)):
    contents = await file.read()
    result = ocr_service.extract_details(contents)
    return result
