def generate_sleep_insights(sleep_logs):

    insights = []

    if len(sleep_logs) < 3:
        insights.append("Not enough sleep data yet. Keep logging your sleep.")
        return insights

    total_sleep = 0
    high_stress_days = 0
    screen_usage_days = 0
    late_bedtimes = 0

    for log in sleep_logs:

        total_sleep += log.sleep_hours

        if log.stress_level >= 7:
            high_stress_days += 1

        if log.screen_usage:
            screen_usage_days += 1

        if "23" in log.bedtime or "00" in log.bedtime or "01" in log.bedtime:
            late_bedtimes += 1

    avg_sleep = total_sleep / len(sleep_logs)

    if avg_sleep < 6:
        insights.append(
            "Your average sleep is below 6 hours. This may lead to fatigue and poor recovery."
        )

    if high_stress_days > len(sleep_logs) / 2:
        insights.append(
            "High stress appears frequently in your logs. Stress might be affecting your sleep quality."
        )

    if screen_usage_days > len(sleep_logs) / 2:
        insights.append(
            "Frequent screen usage before bedtime may be disrupting your sleep cycle."
        )

    if late_bedtimes > len(sleep_logs) / 2:
        insights.append(
            "You tend to sleep late on many nights. A consistent bedtime could improve sleep quality."
        )

    if not insights:
        insights.append("Your sleep habits look relatively balanced. Keep maintaining your routine.")

    return insights