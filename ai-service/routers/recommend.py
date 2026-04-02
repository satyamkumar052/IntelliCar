from fastapi import APIRouter
from pydantic import BaseModel
from services.recommendation_engine import engine

router = APIRouter()

class RecommendRequest(BaseModel):
    purpose: str
    budget_range: str
    fuel_type: str
    seatingCapacity: int

@router.post("/recommend")
def get_recommendations(req: RecommendRequest):
    result = engine.recommend(req.purpose, req.budget_range, req.fuel_type, req.seatingCapacity)
    return result
