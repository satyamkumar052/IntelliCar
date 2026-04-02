import requests
import json

url = "http://localhost:8000/api/recommend"
payload = {
    "purpose": "Commute",
    "budget_range": "Low",
    "fuel_type": "Petrol",
    "seatingCapacity": 5
}

response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
data = response.json()

if "recommendations" in data:
    for rec in data["recommendations"]:
        print(f"Rank {rec['rank']}: {rec['car_name']} - Score: {rec['confidence_score']}%")
        print(f"  Reasoning: {rec['reasoning']}")
else:
    print(f"Error or no recommendations: {data}")
