import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def extract_sleep_hours(message: str):

    """
    Detect sleep hours from natural language messages.
    Examples:
    - "I slept 4 hours"
    - "slept only 5h"
    - "I got 6.5 hours of sleep"
    """

    pattern = r"(\d+(\.\d+)?)\s*(hours|hrs|hr|h)"

    match = re.search(pattern, message.lower())

    if match:
        return float(match.group(1))

    return None


def extract_stress_level(message: str):
    """
    Analyzes the message to determine a stress level.
    Returns an integer from 1 to 10.
    """
    vs = analyzer.polarity_scores(message)
    compound = vs['compound']

    # Normalize compound score (-1 to 1) to a stress level (1 to 10)
    # A more negative score means higher stress
    stress_level = 5.5 - (compound * 4.5)

    return int(max(1, min(10, stress_level)))