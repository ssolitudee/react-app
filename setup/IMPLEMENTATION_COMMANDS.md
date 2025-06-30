# Step-by-Step Implementation Commands

This document provides the exact commands and steps used to implement the LangChain GPT-4o mini-based chatbot with financial advisor and summary agents.

## Environment Setup

### 1. Create Python Virtual Environment
```bash
# Navigate to backend directory
cd path/to/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Linux/Mac)
# source venv/bin/activate
```

### 2. Install Required Dependencies
```bash
# Install FastAPI and Uvicorn
pip install fastapi==0.115.12 uvicorn==0.29.0

# Install LangChain and OpenAI
pip install langchain==0.1.11 openai python-dotenv

# Install Pydantic
pip install pydantic==2.6.3

# Optional: Save dependencies to requirements.txt
pip freeze > requirements.txt
```

### 3. Set Up Environment Variables
```bash
# Create .env file
touch .env
# or on Windows
echo. > .env

# Create .env.example file
touch .env.example
# or on Windows
echo. > .env.example
```

Edit the `.env` file with:
```
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_MODEL_NAME=gpt-4o-mini
```

Edit the `.env.example` file with:
```
# OpenAI API Key for GPT-4o mini access
OPENAI_API_KEY=your_openai_api_key_here

# OpenAI model name - use gpt-4o-mini for the mini version
OPENAI_MODEL_NAME=gpt-4o-mini

# Add other environment variables as needed
```

## Backend Implementation

### 1. Create Directory Structure
```bash
# Create the app directory and its subdirectories
mkdir -p app/services
mkdir -p app/models

# Create __init__.py files to make the directories importable Python packages
touch app/__init__.py
touch app/services/__init__.py
touch app/models/__init__.py
```

### 2. Create LLM Service
Create the file `app/services/llm_service.py`.

### 3. Create AI Service
Create the file `app/services/ai_service.py`.

### 4. Create/Update Main FastAPI Application
Create or modify `main.py` in the root directory to include the new LLM test endpoint.

### 5. Start the Backend Server
```bash
# Start the server with hot reloading
uvicorn main:app --reload
```

## Testing

### 1. Test the LLM Connection

Using Swagger UI:
1. Open browser to http://127.0.0.1:8000/docs
2. Find and expand the `/test-llm` endpoint
3. Click "Try it out"
4. Enter a test prompt in the request body:
   ```json
   {
     "prompt": "What is a 401(k) retirement plan?"
   }
   ```
5. Click "Execute"
6. Verify you receive a proper response from the LLM

Using curl (alternative):
```bash
curl -X POST "http://127.0.0.1:8000/test-llm" \
     -H "Content-Type: application/json" \
     -d '{"prompt":"What is a 401(k) retirement plan?"}'
```

### 2. Test the Chat Endpoint

Using Swagger UI:
1. Open browser to http://127.0.0.1:8000/docs
2. Find and expand the `/chat` endpoint
3. Click "Try it out"
4. Enter a test message:
   ```json
   {
     "message": "I want to start investing. What should I consider?",
     "user_id": "test_user",
     "agent_type": "financial_advisor"
   }
   ```
5. Click "Execute"
6. Verify you receive a proper response

Using curl (alternative):
```bash
curl -X POST "http://127.0.0.1:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"message":"I want to start investing. What should I consider?","user_id":"test_user","agent_type":"financial_advisor"}'
```

## Frontend Integration

### 1. Update Frontend API Calls

If migrating from react-query v3 to TanStack Query v5:
```bash
# Navigate to frontend directory
cd path/to/frontend

# Remove old react-query
npm uninstall react-query

# Install TanStack Query v5
npm install @tanstack/react-query
```

### 2. Set Up QueryClientProvider

Modify your `index.tsx` or `main.tsx` to include the QueryClientProvider.

### 3. Start the Frontend
```bash
# Start the React development server
npm start
```

### 4. Test End-to-End Communication

1. Open the frontend application in a browser
2. Use the chat interface to send messages
3. Verify responses are coming back from the LLM
4. Test different agent types if implemented

## Troubleshooting Common Issues

### OpenAI API Quota Issues
If you encounter a 429 error (insufficient quota):
1. Check your OpenAI account billing status
2. Ensure the API key has sufficient credits
3. Verify the correct environment variables are loaded

### Model Name Issues
If the model isn't found:
1. Check that OPENAI_MODEL_NAME is set correctly in .env
2. Verify the model name is "gpt-4o-mini" (or the correct identifier for your use case)
3. Restart the server after making changes

### CORS Issues
If you encounter CORS errors:
```bash
# Check your FastAPI CORS middleware configuration in main.py
# Restart the server after making changes
uvicorn main:app --reload
```

### Package Version Compatibility
If you encounter module import errors:
```bash
# Check installed package versions
pip list | grep langchain
pip list | grep openai

# Update packages if needed
pip install -U langchain==0.1.11 openai
```
