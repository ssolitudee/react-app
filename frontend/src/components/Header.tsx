import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { createNewChat } = useAppContext();

  const handleNewChat = () => {
    // Use the createNewChat function with no parameters
    createNewChat();
  };

  return (
    <header className="bg-primary-light flex justify-between items-center p-4 shadow-md">
      <div className="flex items-center">
        <button 
          onClick={onSidebarToggle}
          className="mr-4 text-white block md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-white text-xl font-bold">Inventory Analyzer AI</h1>
      </div>
      <button
        onClick={handleNewChat}
        className="flex items-center bg-accent hover:bg-accent-light text-white py-2 px-4 rounded-lg transition-colors"
      >
        <PlusCircleIcon className="h-5 w-5 mr-2" />
        <span>New Chat</span>
      </button>
    </header>
  );
};

export default Header;
