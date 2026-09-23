from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import os

app = FastAPI(title="TaskPilot ML Priority Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "priority_model.pkl")
DATA_PATH = os.path.join(BASE_DIR, "data.csv")

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

class TaskFeatures(BaseModel):
    daysUntilDue: int = Field(..., ge=0)
    estimatedHours: float = Field(..., ge=0)
    activeTaskCount: int = Field(..., ge=0)

class FeedbackPayload(BaseModel):
    daysUntilDue: int = Field(..., ge=0)
    estimatedHours: float = Field(..., ge=0)
    activeTaskCount: int = Field(..., ge=0)
    actualPriority: str = Field(..., description="LOW, MEDIUM, or HIGH")

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/predict")
def predict_priority(features: TaskFeatures):
    if model is None:
        return {"suggestedPriority": "MEDIUM"}

    input_data = pd.DataFrame([{
        "daysUntilDue": features.daysUntilDue,
        "estimatedHours": features.estimatedHours,
        "activeTaskCount": features.activeTaskCount
    }])
    prediction = model.predict(input_data)[0]
    return {"suggestedPriority": str(prediction)}

@app.post("/feedback")
def retrain_model(feedback: FeedbackPayload):
    global model

    try:
        # 1. Ensure file ends with a newline before appending
        if os.path.exists(DATA_PATH) and os.path.getsize(DATA_PATH) > 0:
            with open(DATA_PATH, "rb") as f:
                f.seek(-1, os.SEEK_END)
                last_char = f.read(1)
                if last_char != b"\n":
                    with open(DATA_PATH, "a") as af:
                        af.write("\n")

        # 2. Prepare new data row
        new_row = pd.DataFrame([{
            "daysUntilDue": feedback.daysUntilDue,
            "estimatedHours": feedback.estimatedHours,
            "activeTaskCount": feedback.activeTaskCount,
            "priority": feedback.actualPriority.upper()
        }])

        # 3. Append row cleanly
        file_exists = os.path.exists(DATA_PATH)
        new_row.to_csv(DATA_PATH, mode='a', header=not file_exists, index=False)

        # 4. Reload CSV and retrain model
        df = pd.read_csv(DATA_PATH)
        X = df[["daysUntilDue", "estimatedHours", "activeTaskCount"]]
        y = df["priority"]

        new_model = DecisionTreeClassifier(max_depth=3, random_state=42)
        new_model.fit(X, y)

        joblib.dump(new_model, MODEL_PATH)
        model = new_model

        return {
            "success": True,
            "message": "Feedback recorded and model retrained successfully!",
            "totalSamples": len(df)
        }
    except Exception as e:
        print(f"Error during feedback/retraining: {e}")
        raise HTTPException(status_code=500, detail=str(e))