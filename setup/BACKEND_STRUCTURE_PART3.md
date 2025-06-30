# Backend Structure and Code Explanation - Part 3

## Database Service (`app/services/database.py`)

### Purpose

The `database.py` file implements the database service for storing chat messages, user information, and conversation history. It:

1. Provides an abstraction layer over the database operations
2. Manages message persistence
3. Handles chat history retrieval
4. Supports user data operations

### Key Components

1. **DatabaseService Class**
   - Core class that handles database operations
   - Dependency injected into the AI service and API routes

2. **Message Storage**
   - Methods for saving chat messages
   - Support for different message types (user, AI)
   - Metadata handling (timestamps, agent types)

3. **Chat History Retrieval**
   - Conversation history by user ID
   - Filtering and pagination support
   - Chronological ordering

4. **User Management**
   - User creation and retrieval
   - Session handling
   - Authentication support (if implemented)

## API Endpoints (Routes in `main.py`)

### `/chat` Endpoint

#### Purpose
Handles chat message exchange between users and the AI agents.

#### Request Flow
1. Receives POST request with message content, user ID, and agent type
2. Validates request using Pydantic models
3. Calls AI service with the validated data
4. Gets response from the appropriate agent
5. Saves the conversation to the database
6. Returns the AI response to the client

#### Parameters
- `message`: The user's input message
- `user_id`: Identifier for the user/conversation
- `agent_type`: Which agent to use (financial_advisor, summary)

### `/history` Endpoint

#### Purpose
Retrieves chat history for a specific user.

#### Request Flow
1. Receives GET request with user ID and optional filters
2. Validates the request parameters
3. Calls database service to retrieve conversation history
4. Formats the history data
5. Returns the history to the client

#### Parameters
- `user_id`: Identifier for the user/conversation
- `limit` (optional): Number of messages to retrieve
- `before` (optional): Timestamp for pagination

### `/faq` Endpoint

#### Purpose
Retrieves predefined FAQ questions and answers.

#### Request Flow
1. Receives GET request
2. Optionally filters by category or keyword
3. Returns FAQ data from static storage or database

### `/test-llm` Endpoint

#### Purpose
Direct testing endpoint for the LLM without agent-specific processing.

#### Request Flow
1. Receives POST request with a prompt
2. Forwards the prompt directly to the LLM service
3. Returns the raw LLM response
4. Useful for testing and debugging LLM connectivity

## Environment Configuration

### `.env` and `.env.example` Files

These files manage environment-specific configuration:

1. **API Keys**
   - OpenAI API key for accessing GPT-4o mini
   - Other service credentials if applicable

2. **Model Configuration**
   - Model name specification (gpt-4o-mini)
   - Temperature and other model parameters

3. **Environment Settings**
   - Development/production mode flags
   - Debugging options
   - Log levels

## Error Handling and Logging

### Global Exception Handlers

The application implements global exception handlers to:
1. Catch and process API errors
2. Format error responses consistently
3. Log errors for troubleshooting

### Error Response Format

All error responses follow a consistent structure:
- Error code
- Human-readable message
- Optional details for debugging (in dev mode)

### Logging

The application uses Python's logging module to:
1. Record application events
2. Track API calls and responses
3. Monitor performance and errors
4. Support troubleshooting

## Deployment Configuration

### Uvicorn Server

The application is designed to run with Uvicorn:
1. Configured in main.py for direct execution
2. Supports command-line parameter overrides
3. Configurable for production environments

### Production Considerations

For production deployment:
1. Use a reverse proxy (Nginx, etc.)
2. Implement proper security headers
3. Configure rate limiting
4. Set up monitoring
5. Use HTTPS for all communications
