import pytesseract
from PIL import Image
import io
import re

class OCRService:
    def extract_details(self, image_bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Use tesseract to extract string
            text = pytesseract.image_to_string(image)
            
            # Find dates (DD/MM/YYYY or DD-MM-YYYY)
            date_pattern = r'\b(\d{2}[/-]\d{2}[/-]\d{4})\b'
            dates = re.findall(date_pattern, text)
            
            doc_type = "Other"
            text_lower = text.lower()
            if "registration" in text_lower or "rc" in text_lower:
                doc_type = "RC"
            elif "insurance" in text_lower:
                doc_type = "Insurance"
            elif "pollution" in text_lower or "puc" in text_lower:
                doc_type = "PUC"
            elif "license" in text_lower or "driving" in text_lower:
                doc_type = "License"
            elif "tax" in text_lower:
                doc_type = "RoadTax"

            issue_date = dates[0] if len(dates) > 0 else None
            expiry_date = dates[1] if len(dates) > 1 else (dates[0] if len(dates) == 1 else None)
            
            # Try to format dates to standard ISO if needed, but returning raw is fine for now
            if issue_date:
                issue_date = issue_date.replace('-', '/')
            if expiry_date:
                expiry_date = expiry_date.replace('-', '/')
            
            return {
                "docType": doc_type,
                "issueDate": issue_date,
                "expiryDate": expiry_date,
                "rawText": text[:500] + "..." # Truncate to save DB space
            }
        except Exception as e:
            return {"error": str(e)}

ocr_service = OCRService()
