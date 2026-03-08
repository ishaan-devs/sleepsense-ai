from typing import Optional

from pydantic import BaseModel

class MoodRequest(BaseModel):
    mood_text: str

class SleepRequest(BaseModel):
    sleep_hours: float
    stress_level: int
    screen_usage: bool
    activity_level: str

class SleepAnalysisRequest(BaseModel):
    sleep_hours: float
    stress_level: int
    screen_usage: bool
    activity_level: str
    mood: Optional[str] = "neutral"

class ChatRequest(BaseModel):
    message: str