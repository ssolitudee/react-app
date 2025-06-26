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
- Node.js v20.11.1 LTS and npm v10.2.4
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
