import logging
from typing import Dict, List, Optional

# This is a simple in-memory database for now
# In a production environment, this would be replaced with a proper database connection
class DatabaseService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.info("Initializing DatabaseService")
        
        # In-memory storage
        self.chats: Dict[str, List[Dict[str, str]]] = {}
        self.faqs: List[Dict[str, str]] = [
            {"question": "What can Inventory Analyzer AI do?", "answer": "It can analyze inventory data and provide insights."},
            {"question": "How do I use the Summary Agent?", "answer": "Select the Summary Agent option for concise analysis."},
            {"question": "How do I use the Chatbot Agent?", "answer": "Select the Chatbot Agent option for interactive conversations."}
        ]
    
    async def store_message(self, chat_id: str, message: Dict[str, str]):
        """Store a message in the specified chat"""
        if chat_id not in self.chats:
            self.chats[chat_id] = []
        
        self.chats[chat_id].append(message)
        self.logger.info(f"Stored message in chat {chat_id}")
        return True
    
    async def get_chat_history(self, chat_id: Optional[str] = None) -> Dict[str, List[Dict[str, str]]]:
        """Retrieve chat history, either for a specific chat or all chats"""
        if chat_id:
            return {chat_id: self.chats.get(chat_id, [])}
        return self.chats
    
    async def get_faqs(self) -> List[Dict[str, str]]:
        """Retrieve all FAQs"""
        return self.faqs

# Singleton instance
database_service = DatabaseService()

def get_database_service() -> DatabaseService:
    """Dependency injection function for FastAPI"""
    return database_service
