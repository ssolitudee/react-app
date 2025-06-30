#!/usr/bin/env python3
"""
OpenAI API Connectivity Test Script for Corporate Environment

This script tests connectivity to OpenAI's API through both:
1. Standard OpenAI client library
2. Corporate risklab-openai wrapper

It helps verify that API calls can be made successfully from within
the corporate network environment before modifying the main application.

Usage:
    python openai_connectivity_test.py [--use-risklab] [--verbose]

Options:
    --use-risklab    Test using the risklab-openai corporate wrapper
    --verbose        Show detailed output and debugging information
"""

import os
import sys
import json
import logging
import argparse
import traceback
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("api_test_log.txt"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("OpenAI_API_Test")

# Parse command line arguments
parser = argparse.ArgumentParser(description="Test OpenAI API connectivity in corporate environment")
parser.add_argument("--use-risklab", action="store_true", help="Use risklab-openai corporate wrapper")
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
    logger.info(f"Operating system: {sys.platform}")
    logger.info(f"Current directory: {os.getcwd()}")
    
    # Check for API key
    api_key_set = bool(os.environ.get("OPENAI_API_KEY"))
    logger.info(f"OPENAI_API_KEY set: {api_key_set}")
    
    # Check for proxy settings
    proxy_vars = ["HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY", 
                  "http_proxy", "https_proxy", "no_proxy"]
    for var in proxy_vars:
        if var in os.environ:
            # Mask actual values for security in logs
            logger.info(f"{var}: [CONFIGURED]")
    
    # Check for .env file
    env_file = Path(".env")
    if env_file.exists():
        logger.info(f".env file exists: {env_file.absolute()}")
    else:
        logger.info("No .env file found in current directory")

def test_standard_openai():
    """Test connection using standard OpenAI package"""
    logger.info("Testing connection using standard openai package...")
    
    # Verify API key is set
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY environment variable not set")
        logger.info("Please set your API key using:")
        logger.info("  export OPENAI_API_KEY='your-key'  # Linux/macOS")
        logger.info("  set OPENAI_API_KEY=your-key       # Windows")
        return False
        
    try:
        # Import the OpenAI library
        try:
            from openai import OpenAI
            logger.info("Successfully imported openai package")
        except ImportError:
            logger.error("Standard openai package is not installed")
            logger.info("Install with: pip install openai")
            return False
        
        # Create client and test connection
        client = OpenAI(api_key=api_key)
        
        # Simple request to test connectivity
        logger.info("Sending test request to OpenAI API...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # or gpt-3.5-turbo if preferred
            messages=[{"role": "user", "content": "Hello, this is a test message from the corporate network. Please respond with a simple confirmation."}],
            max_tokens=100
        )
        
        # Log successful response
        message_content = response.choices[0].message.content
        logger.info("Successfully connected to OpenAI API directly")
        logger.info(f"Response: {message_content}")
        
        if args.verbose:
            logger.debug(f"Full response object: {response}")
            
        return True
        
    except Exception as e:
        logger.error(f"Error connecting to OpenAI API directly: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def test_risklab_openai():
    """Test connection using corporate risklab-openai package"""
    logger.info("Testing connection using risklab-openai corporate package...")
    
    try:
        # First check if the package is installed
        try:
            import risklab_openai
            logger.info(f"Successfully imported risklab_openai package")
            if hasattr(risklab_openai, '__version__'):
                logger.info(f"risklab_openai version: {risklab_openai.__version__}")
        except ImportError:
            logger.error("risklab_openai package is not installed")
            logger.info("Install the corporate package with:")
            logger.info("  pip install risklab-openai")
            return False

        # Test basic functionality (assuming similar interface to OpenAI)
        try:
            # Check if OpenAI key is needed for risklab wrapper
            api_key = os.environ.get("OPENAI_API_KEY")
            if api_key:
                client = risklab_openai.OpenAI(api_key=api_key)
                logger.debug("Created risklab_openai client with API key")
            else:
                client = risklab_openai.OpenAI()
                logger.debug("Created risklab_openai client without API key")
            
            # Simple completion request
            logger.info("Sending test request through risklab-openai...")
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # or whatever model is supported
                messages=[{"role": "user", "content": "Hello, this is a test message using the corporate risklab-openai wrapper. Please respond with a simple confirmation."}],
                max_tokens=100
            )
            
            message_content = response.choices[0].message.content
            logger.info("Successfully connected to API through risklab-openai")
            logger.info(f"Response: {message_content}")
            
            if args.verbose:
                logger.debug(f"Full response object: {response}")
                
            return True
            
        except Exception as e:
            logger.error(f"Error using risklab_openai: {str(e)}")
            if args.verbose:
                logger.debug(traceback.format_exc())
            return False
            
    except Exception as e:
        logger.error(f"Unexpected error in risklab_openai test: {str(e)}")
        if args.verbose:
            logger.debug(traceback.format_exc())
        return False

def test_langchain_integration():
    """Test LangChain integration with OpenAI/risklab-openai"""
    logger.info("Testing LangChain integration...")
    
    try:
        # Import LangChain components
        try:
            from langchain.llms import OpenAI as LangchainOpenAI
            from langchain.chat_models import ChatOpenAI
            logger.info("Successfully imported langchain packages")
        except ImportError:
            logger.error("langchain package is not installed")
            logger.info("Install with: pip install langchain")
            return False
        
        # Test simple LangChain functionality
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY environment variable not set, LangChain test skipped")
            return False
        
        # Create and test a simple LangChain chat model
        chat = ChatOpenAI(
            model_name="gpt-4o-mini",  # or whatever model you're using
            temperature=0.7,
            openai_api_key=api_key
        )
        
        logger.info("Sending test request through LangChain...")
        response = chat.predict("Hello, this is a test message through LangChain. Please respond with a simple confirmation.")
        
        logger.info("Successfully connected through LangChain")
        logger.info(f"Response: {response}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing LangChain integration: {str(e)}")
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
    
def main():
    """Main test function"""
    logger.info(f"=== OpenAI API Connectivity Test Started at {datetime.now().isoformat()} ===")
    log_environment_info()
    create_test_env_file()
    
    results = {}
    
    # Run appropriate tests based on arguments
    if args.use_risklab:
        logger.info("Testing with risklab-openai corporate wrapper...")
        risklab_success = test_risklab_openai()
        results["risklab_openai"] = "SUCCESS" if risklab_success else "FAILED"
        
        # Test LangChain with risklab if the basic test succeeded
        if risklab_success:
            langchain_success = test_langchain_integration()
            results["langchain_integration"] = "SUCCESS" if langchain_success else "FAILED"
    else:
        logger.info("Testing with standard openai package...")
        openai_success = test_standard_openai()
        results["standard_openai"] = "SUCCESS" if openai_success else "FAILED"
        
        # Test LangChain with standard OpenAI if the basic test succeeded
        if openai_success:
            langchain_success = test_langchain_integration()
            results["langchain_integration"] = "SUCCESS" if langchain_success else "FAILED"
    
    # Print summary
    logger.info("\n=== Test Results Summary ===")
    for test, result in results.items():
        logger.info(f"{test}: {result}")
    
    # Determine overall success
    success = any(result == "SUCCESS" for result in results.values())
    logger.info(f"\nOverall result: {'SUCCESS' if success else 'FAILED'}")
    
    if not success:
        logger.info("\nTroubleshooting tips:")
        logger.info("1. Verify your API key is set correctly in the environment")
        logger.info("2. Check if corporate proxies are required and properly configured")
        logger.info("3. Ensure the corporate network allows outbound connections to OpenAI's API")
        logger.info("4. If using risklab-openai, verify it's properly installed")
        logger.info("5. Check for any corporate firewall restrictions or whitelist requirements")

if __name__ == "__main__":
    main()
