from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.db import engine, get_db
from database.models import Base
from database import crud

from schemas.request_models import ChatRequest
from schemas.request_models import MoodRequest
from schemas.request_models import SleepRequest
from schemas.request_models import SleepAnalysisRequest
from services.analysis_service import analyze_sentiment
from models.sleep_classifier import predict_sleep_status
from services.analysis_service import analyze_user_sleep
from services.ai_chat_service import generate_ai_response

from services.sleep_analysis_service import build_sleep_context

from auth.auth_service import register_user, login_user
from auth.auth_middleware import get_current_user

from services.insight_service import generate_sleep_insights
from services.greeting_service import generate_ai_greeting

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuthRequest(BaseModel):
    email: str
    password: str




@app.get("/")
def home():
    return {"message": "SleepSense AI Backend Running"}

@app.post("/analyze_mood")
def analyze_mood(request: MoodRequest):
    result = analyze_sentiment(request.mood_text)
    return result

@app.post("/predict_sleep")
def predict_sleep(request: SleepRequest):

    result = predict_sleep_status(
        request.sleep_hours,
        request.stress_level,
        request.screen_usage,
        request.activity_level
    )

    return {
        "sleep_status": result
    }

@app.post("/analyze_sleep")
def analyze_sleep(request: SleepAnalysisRequest):

    result = analyze_user_sleep(request.dict())

    return result

@app.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    message = request.message

    reply = generate_ai_response(db, user_id, message)

    return {"reply": reply}

@app.post("/signup")
def signup(request: AuthRequest, db: Session = Depends(get_db)):

    user = register_user(db, request.email, request.password)

    if not user:
        return {"error": "User already exists"}

    return {"message": "User created successfully"}

@app.post("/login")
def login(request: AuthRequest, db: Session = Depends(get_db)):

    token = login_user(db, request.email, request.password)

    if not token:
        return {"error": "Invalid credentials"}

    return {"access_token": token}

@app.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    sleep_logs = crud.get_sleep_logs(db, user_id)

    insights = generate_sleep_insights(sleep_logs)

    return {"insights": insights}

@app.get("/greeting")
def get_greeting(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    sleep_logs = crud.get_sleep_logs(db, user_id)

    greeting = generate_ai_greeting(sleep_logs)

    return {"greeting": greeting}


@app.get("/sleep-data")
def get_sleep_data(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):

    sleep_logs = crud.get_sleep_logs(db, user_id)

    entries = [
        {
            "sleepHours": log.sleep_hours,
            "stressLevel": log.stress_level or 0
        }
        for log in sleep_logs
    ]

    return {
        "entries": entries
    }

@app.post("/sleep-log")
def add_sleep_log(
    request: SleepAnalysisRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    activity_level_map = {"Low": 0, "Moderate": 1, "High": 2}
    activity_level_int = activity_level_map.get(request.activity_level, 0)

    crud.create_sleep_log(
        db=db,
        user_id=user_id,
        sleep_hours=request.sleep_hours,
        stress_level=request.stress_level,
        screen_usage=request.screen_usage,
        activity_level=activity_level_int,
        mood=request.mood
    )

    result = analyze_user_sleep(request.dict())

    return result