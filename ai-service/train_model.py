import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
import os

print("Training Car Recommendation Model...")

# Load dataset
data_path = os.path.join(os.path.dirname(__file__), 'data', 'cars_dataset.csv')
if not os.path.exists(data_path):
    print(f"Error: Dataset not found at {data_path}")
    exit(1)

df = pd.read_csv(data_path)

# Create a composite target label (combining brand and model)
df['car'] = df['brand'] + ' ' + df['model']

X = df[['purpose', 'budget_range', 'fuel_type', 'seating']]
y = df['car']

# Preprocessing pipeline
categorical_features = ['purpose', 'budget_range', 'fuel_type']
numeric_features = ['seating']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# We use RandomForestClassifier to output probabilities for top 5 recommendations
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Train
model.fit(X, y)

# Ensure models directory exists
model_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(model_dir, exist_ok=True)

# Save model
model_path = os.path.join(model_dir, 'car_recommender.pkl')
joblib.dump(model, model_path)
print(f"Model successfully saved to {model_path}")

# Save the original dataframe for reverse lookup of car details like price and rating
df_path = os.path.join(model_dir, 'car_metadata.pkl')
joblib.dump(df, df_path)
