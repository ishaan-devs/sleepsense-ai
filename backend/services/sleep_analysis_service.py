def build_sleep_context(sleep_logs):

    if not sleep_logs:
        return "No sleep data available yet."

    total_sleep = 0
    stress_total = 0
    count = len(sleep_logs)

    late_bedtimes = 0

    for log in sleep_logs:

        total_sleep += log.sleep_hours or 0
        stress_total += log.stress_level or 0

        if log.bedtime and ("23" in log.bedtime or "00" in log.bedtime or "01" in log.bedtime):
            late_bedtimes += 1

    avg_sleep = round(total_sleep / count, 2)
    avg_stress = round(stress_total / count, 2)

    sleep_status = "Good"

    if avg_sleep < 6:
        sleep_status = "Poor"

    elif avg_sleep < 7:
        sleep_status = "Moderate"

    bedtime_pattern = "Regular"

    if late_bedtimes > count / 2:
        bedtime_pattern = "Late Sleeper"

    context = f"""
Average Sleep: {avg_sleep} hours
Average Stress Level: {avg_stress}
Sleep Status: {sleep_status}
Bedtime Pattern: {bedtime_pattern}
Logs Analyzed: {count}
"""

    return context