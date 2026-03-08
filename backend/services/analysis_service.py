from models.sentiment import analyze_sentiment
from models.sleep_classifier import predict_sleep_status
from services.recommendation_service import generate_recommendations


def analyze_user_sleep(data):

    mood_text = data["mood"]
    sleep_hours = data["sleep_hours"]
    stress_level = data["stress_level"]
    screen_usage = data["screen_usage"]
    activity_level_str = data["activity_level"]

    # 1 Sentiment Analysis
    sentiment_result = analyze_sentiment(mood_text)
    sentiment = sentiment_result["sentiment"]

    # Map activity level from string to int
    activity_level_map = {"low": 0, "moderate": 1, "high": 2}
    activity_level_int = activity_level_map.get(activity_level_str.lower(), 0)

    # 2 Sleep Classification
    sleep_status = predict_sleep_status(
        sleep_hours,
        stress_level,
        screen_usage,
        activity_level_int
    )

    # 3 Recommendations
    recommendations = generate_recommendations(
        sleep_status,
        sentiment,
        screen_usage,
        stress_level
    )

    return {
        "sleep_status": sleep_status,
        "sentiment": sentiment,
        "recommendations": recommendations
    }