from sqlalchemy.orm import Session
from database import crud
from auth.password_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token


def register_user(db: Session, email: str, password: str):

    existing_user = crud.get_user_by_email(db, email)

    if existing_user:
        return None

    hashed = hash_password(password)

    user = crud.create_user(db, email, hashed)

    return user


def login_user(db: Session, email: str, password: str):

    user = crud.get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    token = create_access_token({"user_id": user.id})

    return token