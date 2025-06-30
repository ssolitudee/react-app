"""
LLM Service module for connecting to OpenAI's GPT-4o mini model using LangChain
"""
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate

# Load environment variables from .env file
load_dotenv()

# Get API key and model name from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set. Please add it to your .env file.")

# Default to gpt-4o-mini if not specified
OPENAI_MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")

class LLMService:
    """
    Service for interacting with OpenAI's GPT-4o mini model via LangChain
    """
    def __init__(self):
        # Initialize the LLM with the model specified in .env
        self.llm = ChatOpenAI(
            model=OPENAI_MODEL_NAME,
            temperature=0.7,
            api_key=OPENAI_API_KEY,
        )
        
        # Default conversation memory
        self.memory = ConversationBufferMemory()
        
        # Default conversation chain
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            verbose=True
        )
        
    async def generate_response(self, message: str) -> str:
        """
        Generate a response using the GPT-4o mini model
        
        Args:
            message (str): User's message
            
        Returns:
            str: Model's response
        """
        try:
            # Simple direct call to the model to test connectivity
            response = await self.conversation.arun(message)
            return response
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"Sorry, I encountered an error: {str(e)}"

# Singleton instance of the LLM service
_llm_service = None

def get_llm_service() -> LLMService:
    """
    Get the singleton instance of the LLM service
    
    Returns:
        LLMService: The LLM service instance
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
