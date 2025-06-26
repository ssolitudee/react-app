import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our chat functionality
type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  agentType: 'summary' | 'chatbot';
  createdAt: Date;
  lastUpdated: Date;
};

type FAQ = {
  question: string;
  answer: string;
};

type AppContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  faqs: FAQ[];
  isDarkMode: boolean;
  selectedAgentType: 'summary' | 'chatbot';
  createNewChat: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  selectChat: (chatId: string) => void;
  toggleDarkMode: () => void;
  setAgentType: (agentType: 'summary' | 'chatbot') => void;
};

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  chats: [],
  currentChat: null,
  faqs: [],
  isDarkMode: true, // Default to dark mode as per project requirements
  selectedAgentType: 'summary', // Default to summary agent
  createNewChat: () => {},
  addMessage: () => {},
  selectChat: () => {},
  toggleDarkMode: () => {},
  setAgentType: () => {},
});

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedAgentType, setSelectedAgentType] = useState<'summary' | 'chatbot'>('summary');
  
  // Sample FAQs
  const [faqs] = useState<FAQ[]>([
    {
      question: 'What can Inventory Analyzer AI do?',
      answer: 'Inventory Analyzer AI helps you analyze and understand your inventory data through natural language conversations.'
    },
    {
      question: 'How do I start a new chat?',
      answer: 'Click on the "New Chat" button in the header to start a new conversation.'
    },
    {
      question: 'What are the different agent types?',
      answer: 'We offer two agent types: Summary Agent for condensed analysis and Chatbot Agent for detailed conversations.'
    },
    {
      question: 'Can I see my chat history?',
      answer: 'Yes, all your previous chats are stored in the sidebar for easy access.'
    },
  ]);

  // Function to create a new chat using the currently selected agent type
  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title: `New Chat ${chats.length + 1}`,
      messages: [],
      agentType: selectedAgentType,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };
  
  // Function to set agent type
  const setAgentType = (agentType: 'summary' | 'chatbot') => {
    setSelectedAgentType(agentType);
  };

  // Function to add a message to the current chat
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentChat) return;

    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      lastUpdated: new Date(),
    };

    setCurrentChat(updatedChat);
    setChats(chats.map(chat => (chat.id === currentChat.id ? updatedChat : chat)));
  };

  // Function to select a chat
  const selectChat = (chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Context value
  const value = {
    chats,
    currentChat,
    faqs,
    isDarkMode,
    selectedAgentType,
    createNewChat,
    addMessage,
    selectChat,
    toggleDarkMode,
    setAgentType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
