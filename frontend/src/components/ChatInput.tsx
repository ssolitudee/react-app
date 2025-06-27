import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../context/AppContext';

const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, currentChat, createNewChatWithMessageAndResponse } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    const userMessage = inputValue.trim();
    
    // If no current chat exists, create a new one with both the user message and assistant response
    if (!currentChat) {
      createNewChatWithMessageAndResponse(userMessage);
    } else {
      // Add user message to existing chat
      addMessage({
        content: userMessage,
        role: 'user',
      });
      
      // Simulate AI response
      setTimeout(() => {
        addMessage({
          content: `This is a simulated response to: "${userMessage}"`,
          role: 'assistant',
        });
      }, 1000);
    }
    
    // Clear input
    setInputValue('');
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
          placeholder="Message Inventory Analyzer AI..."
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 hover:border-gray-600 transition-colors pr-12"
        />
        <button
          type="submit"
          disabled={inputValue.trim() === ''}
          className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
