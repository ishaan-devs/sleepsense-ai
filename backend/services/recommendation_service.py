def generate_recommendations(sleep_status, sentiment, screen_usage, stress_level):

    recommendations = []

    if sleep_status == "Poor":
        recommendations.append("Try increasing your sleep duration to at least 7 hours.")

    if screen_usage:
        recommendations.append("Avoid screen exposure 1 hour before bedtime.")

    if stress_level >= 4:
        recommendations.append("Consider relaxation techniques like meditation or deep breathing.")

    if sentiment == "Negative":
        recommendations.append("Improving sleep may help improve your mood.")

    if sleep_status == "Healthy":
        recommendations.append("Great job maintaining healthy sleep habits!")

    return recommendations