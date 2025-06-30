from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import logging
import uvicorn
import uuid

# Import models from the models package
from app.models import Message, TestLLMRequest, ChatRequest, ChatResponse

# Import services for dependency injection
from app.services import get_database_service, DatabaseService
from app.services import get_ai_service, AIService
from app.services.llm_service import get_llm_service, LLMService

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

# Models are now imported from app.models

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Inventory Analyzer AI API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    ai_service: AIService = Depends(get_ai_service),
    db_service: DatabaseService = Depends(get_database_service)
):
    try:
        logger.info(f"Received chat request with agent type: {request.agent_type}")
        
        # Generate a new chat ID if one doesn't exist
        chat_id = str(uuid.uuid4())
        
        # Process request through AI service
        messages = [msg.dict() for msg in request.messages]
        response = await ai_service.process_request(messages, request.agent_type)
        
        # Store the message in the database
        message_to_store = {
            "content": request.messages[-1].content,
            "role": request.messages[-1].role
        }
        await db_service.store_message(chat_id, message_to_store)
        
        # Store the AI response
        await db_service.store_message(chat_id, response)
        
        return ChatResponse(
            message=Message(**response),
            chat_id=chat_id
        )
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(chat_id: Optional[str] = None, db_service: DatabaseService = Depends(get_database_service)):
    try:
        history = await db_service.get_chat_history(chat_id)
        return {"history": history}
    except Exception as e:
        logger.error(f"Error retrieving chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/faq")
async def get_faq(db_service: DatabaseService = Depends(get_database_service)):
    try:
        faqs = await db_service.get_faqs()
        return {"faqs": faqs}
    except Exception as e:
        logger.error(f"Error retrieving FAQs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Test endpoint for GPT-4o mini
@app.post("/test-llm", response_model=Dict[str, str])
async def test_llm(request: TestLLMRequest, llm_service: LLMService = Depends(get_llm_service)):
    """Test endpoint to verify GPT-4o mini LLM integration"""
    try:
        logger.info(f"Testing LLM with prompt: {request.prompt}")
        response = await llm_service.generate_response(request.prompt)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error testing LLM: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error connecting to LLM: {str(e)}"
        )

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
