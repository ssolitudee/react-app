# Inventory Analyzer AI - Setup Instructions

This document provides step-by-step instructions to replicate the Inventory Analyzer AI project setup in your corporate environment.

## Project Structure

The project follows this structure:
```
inventory-analyzer-ai/
├── frontend/         # React application
├── backend/          # FastAPI application
└── README.md
```

## Prerequisites

- Node.js v22.16.0 or compatible
- npm v10.9.2 or compatible
- Python 3.11+
- Git

## Step 1: Create Project Repository

1. Create a new directory for your project:
   ```
   mkdir inventory-analyzer-ai
   cd inventory-analyzer-ai
   ```

2. Initialize a Git repository:
   ```
   git init
   ```

3. Create the basic project structure:
   ```
   mkdir frontend
   mkdir backend
   ```

## Step 2: Set Up Backend with FastAPI

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```
   python -m venv venv
   
   # On Windows:
   .\venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```
   pip install fastapi uvicorn pydantic langchain
   ```
   
   Note: This will install the latest compatible versions:
   - FastAPI (v0.115.13)
   - Uvicorn (v0.34.3)
   - Pydantic (v2.11.7)
   - LangChain (v0.1.11)

4. Create a basic FastAPI application (main.py):
   ```python
   from fastapi import FastAPI
   from pydantic import BaseModel
   from typing import List, Optional
   
   app = FastAPI(title="Inventory Analyzer API")
   
   
   class Message(BaseModel):
       content: str
       role: str
   
   
   class ChatRequest(BaseModel):
       messages: List[Message]
       agent_type: Optional[str] = "summary"
   
   
   @app.get("/")
   async def root():
       return {"message": "Welcome to Inventory Analyzer API"}
   
   
   @app.post("/chat")
   async def chat(request: ChatRequest):
       # This is a placeholder for the actual LangChain implementation
       return {
           "response": "This is a placeholder response from the API.",
           "agent_type": request.agent_type
       }
   
   
   @app.get("/history")
   async def get_history():
       # This is a placeholder for retrieving chat history
       return {"history": []}
   
   
   @app.get("/faq")
   async def get_faq():
       # This is a placeholder for retrieving FAQ items
       return {
           "faq": [
               {"question": "What can Inventory Analyzer AI do?", "answer": "It can analyze inventory data using AI."},
               {"question": "How do I start a new chat?", "answer": "Click on the 'New Chat' button."}
           ]
       }
   ```

5. Return to the project root:
   ```
   cd ..
   ```

## Step 3: Set Up Frontend with React and Tailwind CSS

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Create a new React application using Create React App v5.1.0 with TypeScript:
   ```
   npx create-react-app . --template typescript
   ```

3. Install Tailwind CSS and its dependencies:
   ```
   npm install --save-dev tailwindcss@3.4.1 postcss autoprefixer
   ```

4. Initialize Tailwind CSS:
   ```
   npx tailwindcss init -p
   ```

5. Configure the Tailwind CSS configuration file (tailwind.config.js):
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
       "./public/index.html"
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: '#1a1a1a', // Dark theme background
             light: '#2a2a2a',
           },
           accent: {
             DEFAULT: '#8B0000', // Darker red for "Hi"
             light: '#ff4040',
           },
         },
       },
     },
     plugins: [],
   }
   ```

6. Update the CSS file (src/index.css) to include Tailwind CSS directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   body {
     margin: 0;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
       sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     @apply bg-primary text-white;
   }
   
   code {
     font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
       monospace;
   }
   ```

7. Install ESLint and Prettier (already included with Create React App, but you can configure them further if needed):
   ```
   npm install --save-dev eslint@8.56.0 prettier@3.2.5
   ```

8. Install Heroicons (for icons used throughout the application):
   ```
   npm install @heroicons/react@2.1.1
   ```

9. Install React Testing Library for component testing:
   ```
   npm install --save-dev @testing-library/react@14.2.1 @testing-library/jest-dom @testing-library/user-event
   ```

10. Return to the project root:
   ```
   cd ..
   ```

## Step 4: Create README.md

Create a README.md file at the project root with the following content:

```markdown
# Inventory Analyzer AI

A fullstack web application with a React frontend and FastAPI backend for analyzing inventory data using AI.

## Project Structure

```
inventory-analyzer-ai/
├── frontend/         # React application
├── backend/          # FastAPI application
└── README.md
```

## Technology Stack

### Frontend
- React: v18.2.0
- Create React App: v5.1.0
- Tailwind CSS: v3.4.1
- Heroicons: v2.1.1
- React Testing Library: v14.2.1
- ESLint: v8.56.0
- Prettier: v3.2.5
- Node.js: v22.16.0
- npm: v10.9.2

### Backend
- Python: 3.11+
- FastAPI: latest compatible (v0.115.13)
- Uvicorn: latest compatible (v0.34.3)
- Pydantic: latest compatible (v2.11.7)
- LangChain: v0.1.11
- pytest: v7.4.4

## Setup Instructions

### Prerequisites
- Node.js v22.16.0 and npm v10.9.2
- Python 3.11+

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The frontend will be available at http://localhost:3000

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```
   pip install fastapi uvicorn pydantic langchain
   ```

4. Start the development server:
   ```
   uvicorn main:app --reload
   ```
   The backend API will be available at http://localhost:8000

## Features
- Interactive chat interface with dual AI agents (Summary Agent and Chatbot Agent)
- Chat history management
- FAQ quick access
- Dark theme, modern UI

## API Endpoints
- `/chat` - Send and receive chat messages
- `/history` - Retrieve chat history
- `/faq` - Get predefined FAQ questions

## Development
This project is managed using the `task-master` CLI tool with tasks generated from a PRD file.
```

## Step 5: Verify Installation

1. Test the frontend:
   ```
   cd frontend
   npm start
   ```
   You should see the React application running at http://localhost:3000

2. Test the backend (in another terminal):
   ```
   cd backend
   # Activate virtual environment if not already activated
   uvicorn main:app --reload
   ```
   You should see the FastAPI application running at http://localhost:8000
   
   You can check the API documentation at http://localhost:8000/docs

## Notes

1. The CSS lint errors for `@tailwind` and `@apply` in `src/index.css` are expected and will be resolved by the build process.

2. Dependencies versions:
   - If you encounter issues with specific versions, you can use the latest compatible versions as an alternative.
   - FastAPI, Uvicorn, and Pydantic might require specific versions if you encounter Rust dependency issues.

3. The project is currently set up with placeholder code and is ready for implementation of the actual features as per Task 2 onwards.

4. In a corporate environment, you might need to adjust proxy settings, package sources, or other environment-specific configurations.
