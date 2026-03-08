from pydantic import BaseModel

class SentimentResponse(BaseModel):
    sentiment: str
    compound_score: float