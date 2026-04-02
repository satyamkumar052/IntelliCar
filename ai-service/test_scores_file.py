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
data = response.json()

with open("test_results.json", "w") as f:
    json.dump(data, f, indent=4)
