from database.models import SleepLog


def create_sleep_log(db, user_id, sleep_hours, stress_level, screen_usage, activity_level, mood):

    log = SleepLog(
        user_id=user_id,
        sleep_hours=sleep_hours,
        stress_level=stress_level,
        screen_usage=screen_usage,
        activity_level=activity_level,
        mood=mood
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_sleep_logs(db, user_id):

    return db.query(SleepLog).filter(
        SleepLog.user_id == user_id
    ).all()