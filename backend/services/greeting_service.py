from groq import Groq
import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_ai_greeting():

    try:

        system_prompt = """
You are a friendly AI sleep companion.

Your job is to welcome new users warmly and make them feel comfortable.

Personality:
- friendly
- calm
- supportive
- emotionally warm

Do NOT give long explanations.

Just greet the user and ask how they are feeling today.
"""

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": "Generate a short friendly greeting for a new user."
                }
            ],

            temperature=0.8,
            max_tokens=80
        )

        greeting = completion.choices[0].message.content

        return greeting

    except Exception as e:

        print("GREETING ERROR:", e)

        return (
            "Hello! I'm your AI sleep companion 🌙\n\n"
            "How are you feeling today?"
        )