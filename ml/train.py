import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib

df = pd.read_csv("data.csv")

X = df[["daysUntilDue", "estimatedHours", "activeTaskCount"]]
y = df["priority"]

model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X, y)

y_pred = model.predict(X)
acc = accuracy_score(y, y_pred)
print(f"Training Completed! Accuracy: {acc * 100:.1f}%")

joblib.dump(model, "priority_model.pkl")
print("Saved trained model to 'priority_model.pkl")