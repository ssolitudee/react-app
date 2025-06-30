"""
Chat-related Pydantic models for request/response validation.
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class Message(BaseModel):
    """
    Represents a chat message with content and role.
    
    Attributes:
        content (str): The content of the message
        role (str): The role of the message sender (user, assistant, system)
    """
    content: str
    role: str


class TestLLMRequest(BaseModel):
    """
    Request model for testing the LLM directly.
    
    Attributes:
        prompt (str): The prompt to send to the LLM
    """
    prompt: str


class ChatRequest(BaseModel):
    """
    Request model for chat interactions.
    
    Attributes:
        messages (List[Message]): List of messages in the conversation
        agent_type (str): Type of agent to use (chatbot, summary, etc.)
    """
    messages: List[Message]
    agent_type: str = "chatbot"  # default to chatbot agent


class ChatResponse(BaseModel):
    """
    Response model for chat interactions.
    
    Attributes:
        message (Message): The AI's response message
        chat_id (Optional[str]): Identifier for the chat session
    """
    message: Message
    chat_id: Optional[str] = None
