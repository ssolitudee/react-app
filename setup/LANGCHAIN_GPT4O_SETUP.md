# LangChain GPT-4o Mini Integration Setup Guide

This document outlines the steps required to set up a financial advisor chatbot with two specialized agents (Summary Agent and Chatbot Agent) using LangChain v0.1.11 and OpenAI's GPT-4o mini model.

## Prerequisites

- Python 3.11+
- FastAPI v0.115.12
- Uvicorn v0.29.0
- An OpenAI API key with credits available
- React frontend with TanStack Query v5 set up

## Backend Setup Steps

### 1. Install Required Python Dependencies

Install the following Python packages in your virtual environment:
- langchain==0.1.11
- openai (latest version)
- python-dotenv
- pydantic==2.6.3
- fastapi==0.115.12
- uvicorn==0.29.0

### 2. Directory Structure Setup

Ensure your backend project has the following directory structure:
```
backend/
├── main.py                  # FastAPI application
├── .env                     # Environment variables (not in version control)
├── .env.example             # Example environment variables template
└── app/
    ├── __init__.py
    └── services/
        ├── __init__.py
        ├── ai_service.py    # AI service with agent handlers
        ├── database.py      # Database service
        └── llm_service.py   # LangChain GPT-4o mini service
```

### 3. Environment Variables Configuration

Create a `.env` file in the backend directory with the following variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL_NAME`: The model to use (set to "gpt-4o-mini")

Also create an `.env.example` file as a template for others.

### 4. LLM Service Implementation

Implement the LLM service that:
- Uses LangChain to connect to OpenAI's GPT-4o mini
- Provides conversation memory using ConversationBufferMemory
- Handles errors and exceptions gracefully
- Uses environment variables for configuration

### 5. AI Service Configuration

Update the AI service to:
- Import the LLM service
- Implement different agent types (chatbot, summary)
- Use the LLM service for generating responses
- Add proper error handling for each agent

### 6. FastAPI Endpoint Implementation

Add endpoints in `main.py`:
- Test endpoint `/test-llm` to verify LLM connectivity
- Main chat endpoint `/chat` that uses the AI service
- History and FAQ endpoints as needed

### 7. Backend Testing

Test your implementation by:
- Starting the FastAPI server using Uvicorn
- Testing the `/test-llm` endpoint using Swagger UI or direct API calls
- Verifying responses from the GPT-4o mini model

## Frontend Integration

Your frontend should already be set up with:
- React 19.1.0+ with TypeScript
- TanStack Query v5 for API communication
- QueryClientProvider configured for state management
- Chat UI components for interaction

The frontend should:
1. Make API calls to the backend through the useApi hooks
2. Display loading states during API calls
3. Show optimistic UI updates for better user experience
4. Allow switching between different agent types

## Troubleshooting

Common issues and solutions:
- **API Quota Errors**: Ensure your OpenAI account has sufficient credits and billing set up
- **Model Name Issues**: Double-check the model name in .env matches available OpenAI models
- **CORS Errors**: Ensure the FastAPI CORS middleware is properly configured
- **Environment Variable Problems**: Verify .env file is correctly loaded and formatted

## Next Steps

After completing the basic integration:
1. Implement specialized prompts for the financial advisor chatbot
2. Enhance the Summary Agent for better information condensing
3. Add agent selection controls in the frontend
4. Improve error handling and response formatting
