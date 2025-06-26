import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../context/AppContext';

const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, currentChat } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' || !currentChat) return;
    
    // Add user message
    addMessage({
      content: inputValue.trim(),
      role: 'user',
    });
    
    // Clear input
    setInputValue('');
    
    // Simulate AI response (in a real app, this would come from the backend)
    setTimeout(() => {
      addMessage({
        content: `This is a simulated response to: "${inputValue.trim()}"`,
        role: 'assistant',
      });
    }, 1000);
  };

  return (
    <div className="border-t border-gray-800 bg-primary p-2">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-primary-light text-white rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={inputValue.trim() === ''}
          className="bg-accent hover:bg-accent-light disabled:bg-gray-700 disabled:cursor-not-allowed p-2 rounded-full transition-colors"
        >
          <PaperAirplaneIcon className="h-5 w-5 text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
