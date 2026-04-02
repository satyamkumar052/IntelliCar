import joblib
import os
import pandas as pd

class CarRecommendationEngine:
    def __init__(self):
        self.model = None
        self.metadata = None
        self._load_model()

    def _load_model(self):
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'car_recommender.pkl')
        meta_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'car_metadata.pkl')
        
        if os.path.exists(model_path) and os.path.exists(meta_path):
            self.model = joblib.load(model_path)
            self.metadata = joblib.load(meta_path)
        else:
            print("Warning: Model or metadata not found. Please run train_model.py first.")

    def recommend(self, purpose: str, budget_range: str, fuel_type: str, seating_capacity: int):
        if not self.model:
            return {"error": "Recommendation model not initialized. Run training script."}
            
        # Map budget range for alignment with model training data
        budget_map = {'Low-Medium': 'Low', 'Medium-High': 'High', 'Mid': 'Medium'}
        normalized_budget = budget_map.get(budget_range, budget_range)

        # Prepare input df for the ML model
        input_data = pd.DataFrame([{
            'purpose': purpose,
            'budget_range': normalized_budget,
            'fuel_type': fuel_type,
            'seating': seating_capacity
        }])

        try:
            # Get probabilities from model for ranking
            probs = self.model.predict_proba(input_data)[0]
            classes = self.model.classes_
            
            # Sort to get top 5 recommendations
            top_indices = probs.argsort()[-5:][::-1]
            top_classes = [classes[i] for i in top_indices]
            top_probs = [probs[i] for i in top_indices]

            results = []
            max_prob = max(top_probs) if len(top_probs) > 0 else 1.0

            for i, car_name in enumerate(top_classes):
                # Lookup details for this car
                meta_row = self.metadata[self.metadata['car'] == car_name].iloc[0]
                
                # Calculate intuitive Match Score (Attribute Match %)
                # We check 4 attributes: purpose, budget_range, fuel_type, seating
                matches = 0
                if str(meta_row['purpose']) == purpose: matches += 1
                if str(meta_row['budget_range']) == normalized_budget: matches += 1
                if str(meta_row['fuel_type']) == fuel_type: matches += 1
                if int(meta_row['seating']) == int(seating_capacity): matches += 1
                
                # Base score is based on matching percentage (0, 25, 50, 75, 100)
                # We use the model's confidence to add a small variation to break ties
                base_score = (matches / 4) * 100
                
                # Confidence boost: relative to the top recommendation
                # This ensures the best model recommendation among 100% matches stays at the top
                confidence_bonus = (top_probs[i] / (max_prob + 1e-6)) * 5
                
                # Combine and cap at 100
                final_score = round(min(100.0, base_score + (confidence_bonus if matches == 4 else confidence_bonus / 2)), 2)

                results.append({
                    "rank": i + 1,
                    "car_name": car_name,
                    "confidence_score": final_score,
                    "brand": str(meta_row['brand']),
                    "model": str(meta_row['model']),
                    "price_inr": float(meta_row['price']),
                    "rating": float(meta_row['rating']),
                    "reasoning": f"This {meta_row['brand']} {meta_row['model']} is suitable for {meta_row['purpose']} and falls into the {meta_row['budget_range']} budget range. It runs on {meta_row['fuel_type']} and has {meta_row['seating']} seats."
                })
            return {"recommendations": results}
        except Exception as e:
            return {"error": str(e)}

engine = CarRecommendationEngine()
