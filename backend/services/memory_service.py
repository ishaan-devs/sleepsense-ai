def build_user_memory(chat_history):

    if not chat_history:
        return ""

    stress_mentions = 0
    tired_mentions = 0
    sleep_mentions = 0

    for msg in chat_history:

        text = msg.message.lower()

        if "stress" in text or "anxious" in text:
            stress_mentions += 1

        if "tired" in text or "exhausted" in text:
            tired_mentions += 1

        if "sleep" in text or "insomnia" in text:
            sleep_mentions += 1

    memory_summary = []

    if stress_mentions >= 3:
        memory_summary.append(
            "The user has frequently mentioned stress affecting their sleep."
        )

    if tired_mentions >= 3:
        memory_summary.append(
            "The user often reports feeling tired during the day."
        )

    if sleep_mentions >= 3:
        memory_summary.append(
            "Sleep quality seems to be a recurring concern for the user."
        )

    if not memory_summary:
        return ""

    return "User behavioral patterns:\n" + "\n".join(memory_summary)