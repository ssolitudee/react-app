import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../context/AppContext';
import { useSendMessage } from '../hooks/useApi';

const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, currentChat, createNewChat, selectChat } = useAppContext();
  
  // Use the TanStack Query mutation hook for sending messages
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' || isPending) return;
    
    const userMessage = inputValue.trim();
    
    // If no current chat exists, create a new one
    if (!currentChat) {
      // Create new chat first
      createNewChat();
    }
    
    // Add user message immediately for optimistic UI update
    addMessage({
      content: userMessage,
      role: 'user',
    });
    
    // Clear input right away for better UX
    setInputValue('');
    
    // Send message using our react-query mutation hook
    sendMessage({
        messages: [{ content: userMessage, role: 'user' }],
        agent_type: currentChat?.agentType || 'chatbot',
      },
      {
        onSuccess: (data: { message: { content: string, role: string }, chat_id: string }) => {
          // Add assistant response from API on success
          addMessage({
            content: data.message.content,
            role: 'assistant',
          });
        },
        onError: (error: Error) => {
          console.error('Error sending message:', error);
          
          // Add error message to chat
          addMessage({
            content: 'Sorry, there was an error processing your request. Please try again.',
            role: 'assistant',
          });
        }
      }
    );
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-4">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center max-w-3xl mx-auto relative"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isPending ? "Waiting for response..." : "Message Inventory Analyzer AI..."}
          disabled={isPending}
          className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 hover:border-gray-600 transition-colors pr-12 ${isPending ? 'opacity-70' : ''}`}
        />
        <button
          type="submit"
          disabled={inputValue.trim() === '' || isPending}
          className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          {isPending ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <PaperAirplaneIcon className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
