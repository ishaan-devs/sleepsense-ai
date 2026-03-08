import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database.models import Base, User, ChatMessage
from backend.services.ai_chat_service import generate_ai_response
from backend.database import crud
import os

# Use an in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up the database
Base.metadata.create_all(bind=engine)

class TestAiChatService(unittest.TestCase):
    def setUp(self):
        """Set up a new database session for each test."""
        self.db = TestingSessionLocal()
        # Set a dummy API key for testing
        os.environ["GROQ_API_KEY"] = "test_key"

    def tearDown(self):
        """Close the database session after each test."""
        self.db.close()

    def test_generate_ai_response(self):
        """Test that generate_ai_response returns a string response."""
        # Create a user
        user = crud.create_user(self.db, "test@example.com", "password")
        # Create a chat message
        crud.create_chat_message(self.db, user.id, "user", "I slept for 8 hours")
        # Generate a response
        response = generate_ai_response(self.db, user.id, "I feel great")
        # Assert that the response is a string
        self.assertIsInstance(response, str)

if __name__ == "__main__":
    unittest.main()
