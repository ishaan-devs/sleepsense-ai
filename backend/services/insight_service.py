from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_sleep_insights(logs):

    if not logs:
        return []

    sleep_hours = [log.sleep_hours for log in logs]

    avg_sleep = sum(sleep_hours) / len(sleep_hours)

    history = ", ".join(str(h) for h in sleep_hours)

    prompt = f"""
A user has the following sleep durations:

{history}

Average sleep: {avg_sleep:.1f} hours.

Generate 3 short insights about their sleep health.
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
        max_tokens=120
    )

    text = completion.choices[0].message.content

    insights = [
        line.strip("- ").strip()
        for line in text.split("\n")
        if line.strip()
    ]

    return insights