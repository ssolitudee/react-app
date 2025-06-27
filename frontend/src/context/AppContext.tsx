import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define types for our chat functionality
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  agentType: 'summary' | 'chatbot';
  createdAt: Date;
  lastUpdated: Date;
}

interface FAQ {
  question: string;
  answer: string;
}

interface AppContextType {
  chats: Chat[];
  currentChat: Chat | null;
  faqs: FAQ[];
  isDarkMode: boolean;
  selectedAgentType: 'summary' | 'chatbot';
  createNewChat: () => void;
  createNewChatWithMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  createNewChatWithMessageAndResponse: (userMessage: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addMessageToChat: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  selectChat: (chatId: string) => void;
  toggleDarkMode: () => void;
  setAgentType: (agentType: 'summary' | 'chatbot') => void;
  goToWelcomeScreen: () => void;
}

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  chats: [],
  currentChat: null,
  faqs: [],
  isDarkMode: true, // Default to dark mode as per project requirements
  selectedAgentType: 'summary', // Default to summary agent
  createNewChat: () => {},
  createNewChatWithMessage: () => {},
  createNewChatWithMessageAndResponse: () => {},
  addMessage: () => {},
  addMessageToChat: () => {},
  selectChat: () => {},
  toggleDarkMode: () => {},
  setAgentType: () => {},
  goToWelcomeScreen: () => {},
});

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAgentType, setSelectedAgentType] = useState<'summary' | 'chatbot'>('summary');
  
  // Sample FAQ data
  const [faqs] = useState<FAQ[]>([
    {
      question: 'How do I start a new conversation?',
      answer: 'Click the "New Chat" button or simply start typing in the message box below.'
    },
    {
      question: 'What types of agents are available?',
      answer: 'We offer two agent types: Summary Agent for condensed analysis and Chatbot Agent for detailed conversations.'
    },
    {
      question: 'Can I see my chat history?',
      answer: 'Yes, all your previous chats are stored in the sidebar for easy access.'
    },
  ]);

  // Helper function to generate unique IDs
  const generateId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Helper function to create a message
  const createMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>): Message => {
    return {
      ...messageData,
      id: generateId(),
      timestamp: new Date(),
    };
  }, [generateId]);

  // Helper function to update chats state
  const updateChatsState = useCallback((updatedChats: Chat[]) => {
    setChats(updatedChats);
  }, []);

  // Helper function to update current chat state
  const updateCurrentChatState = useCallback((updatedChat: Chat | null) => {
    setCurrentChat(updatedChat);
  }, []);

  // Function to create a new chat using the currently selected agent type
  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: `New Chat ${chats.length + 1}`,
      messages: [],
      agentType: selectedAgentType,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    const updatedChats = [...chats, newChat];
    updateChatsState(updatedChats);
    updateCurrentChatState(newChat);
  }, [chats, selectedAgentType, generateId, updateChatsState, updateCurrentChatState]);
  
  // Function to set agent type
  const setAgentType = useCallback((agentType: 'summary' | 'chatbot') => {
    setSelectedAgentType(agentType);
  }, []);

  // Function to add a message to a specific chat by ID
  const addMessageToChat = useCallback((chatId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = createMessage(messageData);
    
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastUpdated: new Date(),
          };
        }
        return chat;
      });
      return updatedChats;
    });

    // Update current chat if this is the active chat
    setCurrentChat(prevCurrentChat => {
      if (prevCurrentChat && prevCurrentChat.id === chatId) {
        return {
          ...prevCurrentChat,
          messages: [...prevCurrentChat.messages, newMessage],
          lastUpdated: new Date(),
        };
      }
      return prevCurrentChat;
    });
  }, [createMessage]);

  // Function to add a message to the current chat
  const addMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentChat) {
      console.warn('No current chat selected. Cannot add message.');
      return;
    }
    addMessageToChat(currentChat.id, messageData);
  }, [currentChat, addMessageToChat]);
  
  // Function to create a new chat and immediately add a message to it
  const createNewChatWithMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = createMessage(messageData);
    
    const newChat: Chat = {
      id: generateId(),
      title: `New Chat ${chats.length + 1}`,
      messages: [newMessage],
      agentType: selectedAgentType,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    
    const updatedChats = [...chats, newChat];
    updateChatsState(updatedChats);
    updateCurrentChatState(newChat);
  }, [chats, selectedAgentType, generateId, createMessage, updateChatsState, updateCurrentChatState]);
  
  // Function to create a new chat with a user message and an assistant response
  const createNewChatWithMessageAndResponse = useCallback((userMessage: string) => {
    const userMsg = createMessage({
      content: userMessage,
      role: 'user',
    });
    
    const assistantMsg = createMessage({
      content: `This is a simulated response to: "${userMessage}"`,
      role: 'assistant',
    });
    
    const newChat: Chat = {
      id: generateId(),
      title: `New Chat ${chats.length + 1}`,
      messages: [userMsg, assistantMsg],
      agentType: selectedAgentType,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    
    const updatedChats = [...chats, newChat];
    updateChatsState(updatedChats);
    updateCurrentChatState(newChat);
  }, [chats, selectedAgentType, generateId, createMessage, updateChatsState, updateCurrentChatState]);

  // Function to select a chat
  const selectChat = useCallback((chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      updateCurrentChatState(selected);
    }
  }, [chats, updateCurrentChatState]);

  // Function to toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Function to go to welcome screen
  const goToWelcomeScreen = useCallback(() => {
    updateCurrentChatState(null);
  }, [updateCurrentChatState]);

  // Context value
  const value = {
    chats,
    currentChat,
    faqs,
    isDarkMode,
    selectedAgentType,
    createNewChat,
    createNewChatWithMessage,
    createNewChatWithMessageAndResponse,
    addMessage,
    addMessageToChat,
    selectChat,
    toggleDarkMode,
    setAgentType,
    goToWelcomeScreen,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
