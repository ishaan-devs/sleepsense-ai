from groq import Groq
import os
from dotenv import load_dotenv
from utils.logger import logger

from services.memory_service import build_user_memory
from models.sentiment import analyze_sentiment
from services.sleep_extractor import extract_sleep_hours, extract_stress_level
from services.sleep_analysis_service import build_sleep_context
from database import crud


load_dotenv(dotenv_path=".env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# -------------------------------------------------
# Allow greetings + detect sleep related topics
# -------------------------------------------------
def is_sleep_related(message):

    message = message.lower()

    sleep_keywords = [
        "sleep", "slept", "sleeping", "tired", "bed",
        "insomnia", "rest", "dream", "night",
        "awake", "fatigue", "nap", "stress",
        "relax", "restless", "energy"
    ]

    greeting_keywords = [
        "hi", "hello", "hey",
        "good morning", "good evening",
        "good afternoon"
    ]

    # allow greetings
    if any(word in message for word in greeting_keywords):
        return True

    return any(word in message for word in sleep_keywords)


# -------------------------------------------------
# Main AI Response Generator
# -------------------------------------------------
def generate_ai_response(db, user_id, message):

    try:

        # ----------------------------------------
        # Save user message
        # ----------------------------------------
        crud.create_chat_message(db, user_id, "user", message)

        # Detect sleep hours from message
        sleep_hours = extract_sleep_hours(message)
        stress_level = extract_stress_level(message)

        sentiment_result = analyze_sentiment(message)
        sentiment = sentiment_result["sentiment"]

        if sleep_hours:
            crud.create_sleep_log(
                db=db,
                user_id=user_id,
                sleep_hours=sleep_hours,
                stress_level=stress_level,
                screen_usage=False,  # Default value
                activity_level=0,  # Default value
                mood=sentiment
            )

        # Build FRESH sleep context AFTER creating log
        sleep_logs = crud.get_sleep_logs(db, user_id)
        sleep_context = build_sleep_context(sleep_logs)

        # ----------------------------------------
        # Restrict unrelated topics
        # ----------------------------------------
        if not is_sleep_related(message):

            return (
                "I'm mainly here to help with sleep, stress, rest, and wellbeing. "
                "If something is affecting your sleep or energy levels, I'd be happy to talk about it."
            )

        # ----------------------------------------
        # Retrieve conversation history
        # ----------------------------------------
        memory = crud.get_chat_messages(db, user_id)

        conversation_history = ""

        for msg in memory:
            role = msg.role
            content = msg.message
            conversation_history += f"{role}: {content}\n"

        # ----------------------------------------
        # Build behavioral memory
        # ----------------------------------------
        memory_summary = build_user_memory(memory)

        # ----------------------------------------
        # Emotion-aware instructions
        # ----------------------------------------
        if sentiment == "Negative":

            emotion_instruction = (
                "The user seems emotionally low. Respond with empathy, reassurance, "
                "and gentle emotional support."
            )

        elif sentiment == "Positive":

            emotion_instruction = (
                "The user seems positive. Respond warmly and encourage healthy sleep habits."
            )

        else:

            emotion_instruction = (
                "Respond calmly and supportively."
            )

        # ----------------------------------------
        # System prompt
        # ----------------------------------------
        system_prompt = f"""
You are an empathetic AI sleep companion.

Your personality:
- friendly
- calm
- emotionally intelligent
- supportive
- never judgmental

Your responsibilities:
1. Help users improve sleep habits
2. Provide emotional support
3. Use their sleep data when giving advice
4. Remember patterns from past conversations
5. Keep conversations focused on sleep, stress, rest, or wellbeing

Conversation style:
- Natural and human-like
- Around 80–120 words
- Gentle and supportive tone
- Always end with a simple follow-up question

User sleep data:
{sleep_context}

User behavioral memory:
{memory_summary}

Additional instruction:
{emotion_instruction}
"""

        # ----------------------------------------
        # LLM Request
        # ----------------------------------------
        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"""
Conversation history:
{conversation_history}

User message:
{message}
"""
                }
            ],

            temperature=0.7,
            max_tokens=300
        )

        ai_reply = completion.choices[0].message.content.strip()

        # ----------------------------------------
        # Save AI response
        # ----------------------------------------
        crud.create_chat_message(db, user_id, "assistant", ai_reply)

        return ai_reply

    except Exception as e:

        logger.error(f"AI CHAT ERROR: {e}")

        return (
            "I'm having a little trouble responding right now. "
            "Please try again in a moment."
        )