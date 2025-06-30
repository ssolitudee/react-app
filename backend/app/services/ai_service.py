import logging
import traceback
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any, Union
from .llm_service import get_llm_service, LLMService

class AgentError(Exception):
    """Custom exception for agent-related errors"""
    def __init__(self, message: str, agent_type: str, error_type: str, original_error: Optional[Exception] = None):
        super().__init__(message)
        self.agent_type = agent_type
        self.error_type = error_type
        self.original_error = original_error


class ErrorType(Enum):
    """Enumeration of possible error types"""
    API_ERROR = "api_error"
    CONNECTION_ERROR = "connection_error"
    RATE_LIMIT_ERROR = "rate_limit_error"
    CONTEXT_LIMIT_ERROR = "context_limit_error"
    CONTENT_FILTER_ERROR = "content_filter_error"
    INVALID_REQUEST_ERROR = "invalid_request_error"
    INTERNAL_ERROR = "internal_error"
    UNKNOWN_ERROR = "unknown_error"


class AIService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.info("Initializing AIService")
        
        # Agent types and their handlers
        self.agents = {
            "chatbot": self._process_chatbot_request,
            "summary": self._process_summary_request,
            "analysis": self._process_analysis_request,
        }
        
        # Response templates for different scenarios
        self.error_responses = {
            ErrorType.API_ERROR.value: "I'm having trouble connecting to my knowledge source. Please try again in a few moments.",
            ErrorType.CONNECTION_ERROR.value: "There seems to be a connection issue. Please check your internet connection and try again.",
            ErrorType.RATE_LIMIT_ERROR.value: "I've reached my processing limit. Please try again in a few minutes.",
            ErrorType.CONTEXT_LIMIT_ERROR.value: "Your request contains too much information for me to process. Could you break it down into smaller parts?",
            ErrorType.CONTENT_FILTER_ERROR.value: "I'm unable to provide information on that topic. Let's discuss something else.",
            ErrorType.INVALID_REQUEST_ERROR.value: "I couldn't understand that request properly. Could you rephrase it?",
            ErrorType.INTERNAL_ERROR.value: "I'm experiencing an internal issue. My team has been notified.",
            ErrorType.UNKNOWN_ERROR.value: "Something went wrong. Please try again or contact support if this persists."
        }
    
    def _classify_error(self, e: Exception) -> Tuple[str, str]:
        """Classify an exception to determine the error type and appropriate message"""
        error_message = str(e).lower()
        
        if "rate limit" in error_message or "quota" in error_message:
            return ErrorType.RATE_LIMIT_ERROR.value, self.error_responses[ErrorType.RATE_LIMIT_ERROR.value]
            
        elif "maximum context length" in error_message or "token limit" in error_message:
            return ErrorType.CONTEXT_LIMIT_ERROR.value, self.error_responses[ErrorType.CONTEXT_LIMIT_ERROR.value]
            
        elif "content filter" in error_message or "moderation" in error_message:
            return ErrorType.CONTENT_FILTER_ERROR.value, self.error_responses[ErrorType.CONTENT_FILTER_ERROR.value]
            
        elif "connection" in error_message or "timeout" in error_message:
            return ErrorType.CONNECTION_ERROR.value, self.error_responses[ErrorType.CONNECTION_ERROR.value]
            
        elif "invalid request" in error_message or "invalid format" in error_message:
            return ErrorType.INVALID_REQUEST_ERROR.value, self.error_responses[ErrorType.INVALID_REQUEST_ERROR.value]
            
        elif "api" in error_message or "key" in error_message:
            return ErrorType.API_ERROR.value, self.error_responses[ErrorType.API_ERROR.value]
            
        else:
            return ErrorType.UNKNOWN_ERROR.value, self.error_responses[ErrorType.UNKNOWN_ERROR.value]
    
    def _format_response(self, content: str, agent_type: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Format the response with consistent structure and metadata"""
        response = {
            "content": content,
            "role": "assistant",
            "agent_type": agent_type
        }
        
        if metadata:
            response["metadata"] = metadata
            
        return response
    
    def _handle_error(self, e: Exception, agent_type: str) -> Dict[str, Any]:
        """Centralized error handling for all agent types"""
        self.logger.error(f"Error in {agent_type} agent: {str(e)}")
        self.logger.debug(f"Error traceback: {traceback.format_exc()}")
        
        error_type, error_message = self._classify_error(e)
        
        return self._format_response(
            content=error_message,
            agent_type=agent_type,
            metadata={
                "error": True,
                "error_type": error_type,
                "original_error": str(e)
            }
        )
    
    async def process_request(self, messages: List[Dict[str, str]], agent_type: str = "chatbot") -> Dict[str, Union[str, Any]]:
        """Process an AI request using the specified agent type"""
        self.logger.info(f"Processing request with agent type: {agent_type}")
        
        try:
            # Use the appropriate agent handler, default to chatbot if agent_type is not supported
            handler = self.agents.get(agent_type, self.agents["chatbot"])
            return await handler(messages)
        except Exception as e:
            return self._handle_error(e, agent_type)
    
    async def _process_chatbot_request(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a request using the chatbot agent with GPT-4o mini as a financial advisor"""
        try:
            # Get the last message from the user
            last_message = messages[-1]["content"] if messages else ""
            
            # Format conversation history for context
            conversation_history = ""
            if len(messages) > 1:
                conversation_history = "\n\nConversation history:\n"
                for i, msg in enumerate(messages[:-1]):
                    role = "User" if msg["role"] == "user" else "Assistant"
                    conversation_history += f"{role}: {msg['content']}\n"
            
            # Comprehensive financial advisor prompt
            financial_advisor_prompt = """
            You are a knowledgeable and ethical financial advisor assistant with expertise in:
            1. Personal finance and budgeting
            2. Investment strategies and portfolio management
            3. Retirement planning and savings
            4. Tax optimization strategies
            5. Insurance and risk management
            6. Debt management and credit improvement
            
            Guidelines:
            - Provide personalized, actionable financial advice based on the information shared
            - Always prioritize the client's long-term financial well-being
            - Explain financial concepts in clear, simple terms while maintaining accuracy
            - Disclose limitations and uncertainties in your advice
            - When appropriate, suggest seeking professional advice for complex situations
            - Do not recommend specific investment products or make promises about returns
            - Maintain a professional, supportive, and non-judgmental tone
            - Ask clarifying questions when needed to provide better guidance
            
            User's query: {last_message}
            {conversation_history}
            
            Please provide helpful financial advice based on the above information:
            """
            
            # Use the LLM service to generate a financial advisor response
            llm_service = get_llm_service()
            response = await llm_service.generate_response(financial_advisor_prompt.format(
                last_message=last_message,
                conversation_history=conversation_history
            ))
            
            # Use the centralized response formatter
            return self._format_response(
                content=response,
                agent_type="chatbot",
                metadata={
                    "response_type": "financial_advice",
                    "tokens_used": len(response.split()) * 1.3  # Estimate
                }
            )
        except Exception as e:
            return self._handle_error(e, "chatbot")
    
    async def _process_summary_request(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a request using the summary agent with GPT-4o mini"""
        try:
            # Get all the messages to summarize
            message_texts = [msg["content"] for msg in messages if msg["role"] != "assistant"]
            combined_text = "\n".join(message_texts)
            
            if not combined_text.strip():
                return self._format_response(
                    content="There's no content to summarize. Please provide some text or questions to generate a summary.",
                    agent_type="summary",
                    metadata={"response_type": "empty_input_warning"}
                )
            
            # Use the LLM service to generate a summary
            llm_service = get_llm_service()
            response = await llm_service.generate_response(
                f"Please provide a concise summary of the following conversation:\n{combined_text}"
            )
            
            # Return formatted response
            return self._format_response(
                content=response,
                agent_type="summary",
                metadata={
                    "response_type": "conversation_summary",
                    "source_messages": len(message_texts),
                    "tokens_used": len(response.split()) * 1.3  # Estimate
                }
            )
        except Exception as e:
            return self._handle_error(e, "summary")
        
    
    async def _process_analysis_request(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a request using the analysis agent"""
        # Placeholder for analysis agent logic
        return self._format_response(
            content="This is a placeholder analysis. LangChain integration coming soon.",
            agent_type="analysis",
            metadata={"response_type": "placeholder"}
        )

# Singleton instance
ai_service = AIService()

def get_ai_service() -> AIService:
    """Dependency injection function for FastAPI"""
    return ai_service
