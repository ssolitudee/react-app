# Backend Structure and Code Explanation - Part 2

## Service Layer

The service layer contains the core business logic of the application. Each service is responsible for a specific domain of functionality and is designed to be reusable and testable.

### AI Service (`app/services/ai_service.py`)

#### Purpose

The `ai_service.py` file implements the AI service that acts as a coordinator between the API endpoints and the underlying LLM service. It:

1. Handles different agent types (chatbot, summary)
2. Formats messages for the LLM
3. Processes and transforms LLM responses
4. Manages errors and exceptions
5. Coordinates with the database service for message storage

#### Key Components

1. **AIService Class**
   - Central class that manages different agent functionalities
   - Dependency injected into API routes

2. **Agent Type Handling**
   - Determines which agent to use based on user request
   - Maps agent types to specific prompt templates and processing logic
   - Supports multiple agent types (financial advisor, summary)

3. **Chatbot Agent Implementation**
   - Financial advisor specific prompts
   - Message handling for chatbot conversations
   - Response formatting for chat interface

4. **Summary Agent Implementation**
   - Specialized prompt engineering for summarization tasks
   - Chat history processing
   - Concise output generation

5. **Error Handling**
   - Exception catching and standardized error responses
   - Service-level logging
   - Rate limit handling for API calls

#### Integration Points

1. **Database Service Integration**
   - Storing chat messages
   - Retrieving conversation history
   - User data management

2. **LLM Service Integration**
   - Passing formatted prompts to the LLM service
   - Receiving and processing LLM responses
   - Error propagation and handling

### LLM Service (`app/services/llm_service.py`)

#### Purpose

The `llm_service.py` file handles direct interaction with the OpenAI API via LangChain. It:

1. Sets up the connection to the GPT-4o mini model
2. Manages conversation memory
3. Handles prompt formatting specific to LangChain
4. Processes API responses and errors

#### Key Components

1. **Environment Configuration**
   - Loads OpenAI API key from environment variables
   - Configures model parameters (temperature, etc.)
   - Sets up fallback mechanisms

2. **LLMService Class**
   - Initializes the LangChain ChatOpenAI model
   - Configures conversation memory
   - Provides methods for generating responses

3. **Conversation Management**
   - Uses ConversationBufferMemory for context retention
   - Manages conversation chains
   - Handles context window limitations

4. **Response Generation**
   - Asynchronous API calls (arun method)
   - Direct model interactions
   - Response processing

5. **Error Handling**
   - API-specific error handling (rate limits, token limits, etc.)
   - Connection error management
   - Fallback responses when API fails

#### LangChain Integration

1. **ChatOpenAI Model**
   - Configuration for GPT-4o mini
   - Temperature and other parameter settings
   - API key management

2. **ConversationBufferMemory**
   - Stores conversation history
   - Provides context for the model
   - Manages memory size

3. **ConversationChain**
   - Links the model, memory, and prompt template
   - Manages the flow of conversation
   - Handles prompt formatting

4. **Prompt Templates**
   - Financial advisor specific templates
   - Summary agent templates
   - System message configuration
