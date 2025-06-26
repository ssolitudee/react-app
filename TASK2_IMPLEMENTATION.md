# Task 2: Implementation Instructions - Part 1

This document provides step-by-step instructions to implement Task 2 - Basic Frontend UI Components for the Inventory Analyzer AI project. Follow these steps in order.

## 1. Initial Setup

1. Navigate to the frontend directory in your terminal
2. Install Heroicons: `npm install @heroicons/react@2.1.1`
3. Install React Testing Library: `npm install --save-dev @testing-library/react@14.2.1 @testing-library/jest-dom @testing-library/user-event`

## 2. Create Component Directory Structure

1. Create directory `src/components` for React components
2. Create directory `src/context` for React Context provider

## 3. Set Up AppContext (React Context Provider)

1. Create `src/context/AppContext.tsx` 
2. Implement the global application state with:
   - Chat history array and current chat state
   - FAQ items array
   - Dark mode toggle functionality
   - Agent type selection ('summary' or 'chatbot')
   - Functions for creating new chats, adding messages, selecting chats
   - Hook for accessing the context from components

## 4. Create Header Component

1. Create `src/components/Header.tsx`
2. Implement a responsive header with:
   - App title "Inventory Analyzer AI"
   - New Chat button with PlusCircle icon from Heroicons
   - Mobile-friendly hamburger menu for sidebar toggle
3. Create `src/components/Header.test.tsx` to test the component

## 5. Create Sidebar Component

1. Create `src/components/Sidebar.tsx`
2. Implement sidebar with:
   - App title at top
   - List of chat history items
   - Empty state when no chats exist
   - Mobile-responsive design (hidden on small screens)

## 6. Create WelcomeScreen Component

1. Create `src/components/WelcomeScreen.tsx`
2. Implement welcome screen with:
   - Greeting text ("Hi, I'm Inventory Analyzer AI")
   - Brief instruction text
   - Integration with the AgentSelection component
