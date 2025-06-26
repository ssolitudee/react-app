from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Inventory Analyzer AI",
    description="API for Inventory Analyzer AI with chat functionality",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    content: str
    role: str

class ChatRequest(BaseModel):
    messages: List[Message]
    agent_type: str = "chatbot"  # default to chatbot agent

class ChatResponse(BaseModel):
    message: Message
    chat_id: Optional[str] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Inventory Analyzer AI API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received chat request with agent type: {request.agent_type}")
        
        # This is a placeholder for the actual AI processing logic
        # In Task 5, we'll implement the real LangChain integration
        response_content = "This is a placeholder response. LangChain integration coming soon."
        
        return ChatResponse(
            message=Message(content=response_content, role="assistant"),
            chat_id="temp-chat-id"
        )
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    # Placeholder for chat history retrieval
    return {"history": []}

@app.get("/faq")
async def get_faq():
    # Placeholder for FAQ retrieval
    return {
        "faqs": [
            {"question": "What can Inventory Analyzer AI do?", "answer": "It can analyze inventory data and provide insights."},
            {"question": "How do I use the Summary Agent?", "answer": "Select the Summary Agent option for concise analysis."},
            {"question": "How do I use the Chatbot Agent?", "answer": "Select the Chatbot Agent option for interactive conversations."}
        ]
    }

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
