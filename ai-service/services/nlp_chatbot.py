import spacy
from typing import List, Dict

class NLPChatbot:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import subprocess
            import sys
            subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")

        self.intents = {
            "renew_insurance": ["insurance", "renew insurance", "policy expiry", "claim"],
            "renew_rc": ["rc", "registration", "renew rc", "rto"],
            "renew_puc": ["puc", "pollution", "emission", "renew puc"],
            "pay_challan": ["challan", "fine", "ticket", "police"],
            "find_service": ["service center", "mechanic", "repair", "breakdown"],
            "recommend_car": ["buy", "recommend", "new car", "budget"]
        }

        self.responses = {
            "renew_insurance": "To renew your insurance, go to the 'Documents' section on your Dashboard, select your expiring Insurance, and click 'Renew'. Ensure you have your recent policy number handy.",
            "renew_rc": "RC renewal requires an RTO inspection. You can find the nearest RTO using our Location Finder tool. Make sure to carry your original RC and insurance.",
            "renew_puc": "PUC certificates can be renewed at most petrol pumps. Use our Location Finder to locate the nearest emission testing center.",
            "pay_challan": "You can pay pending challans directly via the Parivahan portal or through our Payments module. Would you like me to redirect you?",
            "find_service": "I can help you find a service center. Please head over to the Location Finder module and search for 'Service Center' near your pincode.",
            "recommend_car": "Looking for a new car? Try our AI Recommendation Engine in the sidebar! Just enter your budget, family size, and preferences.",
            "default": "I'm your IntelliCar assistant. I can help you with document renewals, finding RTOs/service centers, or getting car recommendations. How can I help today?"
        }

    def process_message(self, message: str, history: List[Dict] = None) -> str:
        doc = self.nlp(message.lower())
        
        # Lemmatize and remove stopwords
        tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
        processed_text = " ".join(tokens)

        detected_intent = "default"
        max_overlap = 0

        for intent, keywords in self.intents.items():
            overlap = sum(1 for kw in keywords if kw in processed_text or kw in message.lower())
            if overlap > max_overlap:
                max_overlap = overlap
                detected_intent = intent

        return self.responses[detected_intent]

chatbot_service = NLPChatbot()
