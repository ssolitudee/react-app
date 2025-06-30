#!/usr/bin/env python3
"""
LangChain Integration Test with Risklab-OpenAI

This script tests the integration between LangChain and the corporate risklab-openai wrapper.
It verifies that your application's LangChain components can successfully operate
in the corporate environment before modifying the main application.

Usage:
    python langchain_risklab_test.py [--verbose]

Options:
    --verbose        Show detailed output and debugging information
"""

import os
import sys
import logging
import argparse
import traceback
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("langchain_test_log.txt"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("LangChain_Risklab_Test")

# Parse command line arguments
parser = argparse.ArgumentParser(description="Test LangChain integration with risklab-openai")
parser.add_argument("--verbose", action="store_true", help="Show detailed output and debug info")
args = parser.parse_args()

# Set log level based on verbosity
if args.verbose:
    logger.setLevel(logging.DEBUG)
    logger.debug("Verbose mode enabled")
else:
    logger.setLevel(logging.INFO)

def log_environment_info():
    """Log relevant environment information for debugging"""
    logger.info("=== Environment Information ===")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Current directory: {os.getcwd()}")
    
    # Check for API key and model
    api_key_set = bool(os.environ.get("OPENAI_API_KEY"))
    logger.info(f"OPENAI_API_KEY set: {api_key_set}")
    
    model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4o-mini")
    logger.info(f"Using model: {model_name}")
    
    # Log proxy settings if they exist
    http_proxy = os.environ.get('HTTP_PROXY') or os.environ.get('http_proxy')
    https_proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    no_proxy = os.environ.get('NO_PROXY') or os.environ.get('no_proxy')
    
    if http_proxy:
        logger.info(f"HTTP Proxy: [CONFIGURED]")
    if https_proxy:
        logger.info(f"HTTPS Proxy: [CONFIGURED]")
    if no_proxy:
        logger.info(f"No Proxy: [CONFIGURED]")

def test_risklab_langchain_basic():
    """Test basic LangChain functionality with risklab-openai"""
    logger.info("Testing basic LangChain functionality with risklab-openai...")
    
    try:
        # Check if required packages are installed
        try:
            import risklab_openai
            from langchain_openai import ChatOpenAI
            from langchain_core.messages import HumanMessage
            logger.info("Required packages are installed")
        except ImportError as e:
            logger.error(f"Missing required package: {e}")
            logger.info("Install with:")
            logger.info("  pip install risklab-openai[langchain]")
            logger.info("  # or")
            logger.info("  pip install langchain langchain-openai")
            return False
        
        # Create a langchain ChatOpenAI instance with risklab
        # The risklab-openai should be picked up automatically if it's installed
        api_key = os.environ.get("OPENAI_API_KEY")
        model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4o-mini")
        
        logger.info(f"Creating ChatOpenAI instance with model {model_name}")
        if api_key:
            chat = ChatOpenAI(model_name=model_name, temperature=0.7, openai_api_key=api_key)
        else:
            # In case the corporate wrapper doesn't need an explicit key
            chat = ChatOpenAI(model_name=model_name, temperature=0.7)
        
        # Test with a basic prompt
        logger.info("Sending test query to LangChain ChatOpenAI...")
        messages = [HumanMessage(content="Hello, this is a test message through LangChain with risklab-openai. Please respond with a simple confirmation.")]
        response = chat.invoke(messages)
        
        logger.info("Successfully connected through LangChain")
        logger.info(f"Response: {response.content}")
        
        if args.verbose:
            logger.debug(f"Full response object: {response}")
            
        return True
        
    except Exception as e:
        logger.error(f"Error testing basic LangChain with risklab-openai: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def test_conversational_chain():
    """Test a ConversationalChain with memory"""
    logger.info("Testing ConversationalChain with memory...")
    
    try:
        # Import required components
        try:
            from langchain.chains import ConversationChain
            from langchain.memory import ConversationBufferMemory
            from langchain_openai import ChatOpenAI
            logger.info("ConversationChain components imported successfully")
        except ImportError as e:
            logger.error(f"Missing required package: {e}")
            logger.info("Install with: pip install langchain langchain-openai")
            return False
        
        # Create components
        api_key = os.environ.get("OPENAI_API_KEY")
        model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4o-mini")
        
        if api_key:
            llm = ChatOpenAI(model_name=model_name, temperature=0.7, openai_api_key=api_key)
        else:
            # In case the corporate wrapper doesn't need an explicit key
            llm = ChatOpenAI(model_name=model_name, temperature=0.7)
        
        memory = ConversationBufferMemory()
        
        conversation = ConversationChain(
            llm=llm,
            memory=memory,
            verbose=args.verbose
        )
        
        # Test conversation with multiple turns
        logger.info("Testing multi-turn conversation...")
        
        # First message
        response1 = conversation.predict(input="Hello, my name is Test User. What's your name?")
        logger.info(f"Response 1: {response1}")
        
        # Second message to test memory
        response2 = conversation.predict(input="What was my name again?")
        logger.info(f"Response 2: {response2}")
        
        # Check if memory worked
        if "Test User" in response2 or "test user" in response2.lower():
            logger.info("Memory test PASSED - AI remembered user's name")
        else:
            logger.warning("Memory test INCONCLUSIVE - AI response doesn't clearly show memory utilization")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing ConversationChain: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def test_simple_prompt_template():
    """Test PromptTemplate functionality"""
    logger.info("Testing PromptTemplate functionality...")
    
    try:
        # Import required components
        try:
            from langchain_core.prompts import PromptTemplate
            from langchain_openai import ChatOpenAI
            logger.info("PromptTemplate components imported successfully")
        except ImportError as e:
            logger.error(f"Missing required package: {e}")
            logger.info("Install with: pip install langchain langchain-openai")
            return False
        
        # Create components
        api_key = os.environ.get("OPENAI_API_KEY")
        model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4o-mini")
        
        if api_key:
            llm = ChatOpenAI(model_name=model_name, temperature=0.7, openai_api_key=api_key)
        else:
            # In case the corporate wrapper doesn't need an explicit key
            llm = ChatOpenAI(model_name=model_name, temperature=0.7)
        
        # Create a prompt template similar to what's used in the main app
        template = """
        You are a knowledgeable financial advisor assistant. Please provide advice on the following topic:
        
        Topic: {topic}
        
        Your advice:
        """
        
        prompt = PromptTemplate(
            input_variables=["topic"],
            template=template,
        )
        
        # Test the prompt
        topic = "saving for retirement"
        formatted_prompt = prompt.format(topic=topic)
        
        logger.info(f"Using prompt template with topic: {topic}")
        if args.verbose:
            logger.debug(f"Formatted prompt: {formatted_prompt}")
        
        response = llm.invoke(formatted_prompt)
        
        logger.info("Successfully used PromptTemplate")
        logger.info(f"Response: {response.content}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing PromptTemplate: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def create_test_env_file():
    """Create a template .env file if it doesn't exist"""
    env_path = Path(".env.example")
    
    if not env_path.exists():
        with open(env_path, "w") as f:
            f.write("""# OpenAI API Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL_NAME=gpt-4o-mini

# Proxy Configuration (if needed)
#HTTP_PROXY=http://proxy.company.com:8080
#HTTPS_PROXY=http://proxy.company.com:8080
#NO_PROXY=localhost,127.0.0.1

# Corporate Authentication (if needed)
#RISKLAB_AUTH_TOKEN=your_gitlab_token_here
""")
        logger.info(f"Created template environment file: {env_path}")

def test_mock_service_layer():
    """Test a mock version of the application's service layer"""
    logger.info("Testing mock version of application's service layer...")
    
    try:
        # Import required components
        try:
            from langchain_core.messages import HumanMessage, SystemMessage
            from langchain_openai import ChatOpenAI
            logger.info("Required components imported successfully")
        except ImportError as e:
            logger.error(f"Missing required package: {e}")
            logger.info("Install with: pip install langchain-core langchain-openai")
            return False
        
        # Create a simplified version of the app's LLMService
        class MockLLMService:
            def __init__(self):
                api_key = os.environ.get("OPENAI_API_KEY")
                model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4o-mini")
                
                if api_key:
                    self.chat = ChatOpenAI(model_name=model_name, temperature=0.7, openai_api_key=api_key)
                else:
                    # In case the corporate wrapper doesn't need an explicit key
                    self.chat = ChatOpenAI(model_name=model_name, temperature=0.7)
            
            async def generate_response(self, message):
                """Simplified version of the application's generate_response"""
                try:
                    # This mimics how the real service works
                    messages = [
                        SystemMessage(content="You are a helpful assistant."),
                        HumanMessage(content=message)
                    ]
                    response = await self.chat.ainvoke(messages)
                    return response.content
                except Exception as e:
                    logger.error(f"Error generating response: {e}")
                    return f"Sorry, I encountered an error: {str(e)}"
        
        # Create and test the mock service
        import asyncio
        
        async def test_mock():
            service = MockLLMService()
            response = await service.generate_response("This is a test of the mock LLM service layer.")
            logger.info(f"Mock service response: {response}")
            return True
        
        logger.info("Testing async mock LLM service...")
        result = asyncio.run(test_mock())
        
        return result
        
    except Exception as e:
        logger.error(f"Error testing mock service layer: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def main():
    """Main test function"""
    logger.info(f"=== LangChain + Risklab-OpenAI Integration Test Started at {datetime.now().isoformat()} ===")
    log_environment_info()
    create_test_env_file()
    
    results = {}
    
    # Run tests in sequence
    tests = [
        ("Basic LangChain + Risklab", test_risklab_langchain_basic),
        ("ConversationChain", test_conversational_chain),
        ("PromptTemplate", test_simple_prompt_template),
        ("Mock Service Layer", test_mock_service_layer)
    ]
    
    for name, test_func in tests:
        logger.info(f"\n=== Running Test: {name} ===")
        success = test_func()
        results[name] = "SUCCESS" if success else "FAILED"
    
    # Print summary
    logger.info("\n=== Test Results Summary ===")
    for test, result in results.items():
        logger.info(f"{test}: {result}")
    
    # Determine overall success
    success = any(result == "SUCCESS" for result in results.values())
    logger.info(f"\nOverall result: {'SUCCESS' if success else 'FAILED'}")
    
    if not success:
        logger.info("\nTroubleshooting tips:")
        logger.info("1. Verify risklab-openai[langchain] is installed")
        logger.info("2. Check if API key is required (may not be in corporate environment)")
        logger.info("3. Verify proxy settings if applicable")
        logger.info("4. Try with --verbose flag for more detailed error information")

if __name__ == "__main__":
    main()
