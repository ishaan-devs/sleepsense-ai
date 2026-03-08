from sqlalchemy.orm import Session
from database.models import SleepLog, User, ChatMessage

# ----------------------------
# USERS
# ----------------------------

def create_user(db: Session, email: str, password_hash: str):

    user = User(
        email=email,
        password_hash=password_hash
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(User.email == email).first()


# ----------------------------
# SLEEP LOGS
# ----------------------------

def create_sleep_log(
    db,
    user_id,
    sleep_hours,
    stress_level,
    screen_usage,
    activity_level,
    mood
):

    sleep_log = SleepLog(
        user_id=user_id,
        sleep_hours=sleep_hours,
        stress_level=stress_level,
        screen_usage=screen_usage,
        activity_level=activity_level,
        mood=mood
    )

    db.add(sleep_log)
    db.commit()
    db.refresh(sleep_log)

    return sleep_log


def get_sleep_logs(db: Session, user_id: int):

    return (
        db.query(SleepLog)
        .filter(SleepLog.user_id == user_id)
        .order_by(SleepLog.created_at.desc())
        .limit(7)
        .all()
    )


# ----------------------------
# CHAT MEMORY
# ----------------------------

def create_chat_message(
    db: Session,
    user_id: int,
    role: str,
    message: str
):

    chat = ChatMessage(

        user_id=user_id,
        role=role,
        message=message
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


def get_chat_messages(
    db: Session,
    user_id: int,
    limit: int = 6
):

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )