from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.db import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SleepLog(Base):

    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    sleep_hours = Column(Float)
    bedtime = Column(String)

    screen_usage = Column(Boolean)

    stress_level = Column(Integer)

    activity_level = Column(Integer)

    mood = Column(String)

    sleep_status = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    role = Column(String)

    message = Column(String)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())