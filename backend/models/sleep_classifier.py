import numpy as np
from sklearn.tree import DecisionTreeClassifier

# Synthetic training dataset
# Features: [sleepHours, stressLevel, screenUsage, activityLevel]

X = np.array([
    [8, 1, 0, 2],
    [7.5, 2, 0, 2],
    [7, 2, 0, 1],
    [6.5, 3, 1, 1],
    [6, 3, 1, 1],
    [5.5, 4, 1, 0],
    [5, 4, 1, 0],
    [4.5, 5, 1, 0],
    [7.5, 1, 0, 2],
    [6, 4, 1, 0]
])

# Labels
y = [
    "Healthy",
    "Healthy",
    "Healthy",
    "Irregular",
    "Irregular",
    "Poor",
    "Poor",
    "Poor",
    "Healthy",
    "Poor"
]

# Train model
model = DecisionTreeClassifier()
model.fit(X, y)


def encode_activity(level):
    mapping = {
        "Low": 0,
        "Moderate": 1,
        "High": 2
    }
    return mapping.get(level, 1)


def predict_sleep_status(sleep_hours, stress_level, screen_usage, activity_level):

    features = np.array([[sleep_hours, stress_level, int(screen_usage), activity_level]])

    prediction = model.predict(features)

    return prediction[0]