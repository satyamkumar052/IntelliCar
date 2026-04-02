from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
from services.nlp_chatbot import chatbot_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict]] = []

@router.post("/chat")
def chat(req: ChatRequest):
    reply = chatbot_service.process_message(req.message, req.history)
    return {"reply": reply}
