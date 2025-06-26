import React from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { chats, currentChat, selectChat } = useAppContext();
  
  // Format date to display only the relevant parts
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <aside 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:static left-0 top-0 z-40 h-screen w-64 bg-primary-light transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-semibold">Chat History</h2>
          <button 
            onClick={onClose}
            className="text-white block md:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-3" />
            <p className="text-center">No chat history yet</p>
            <p className="text-center text-sm">Start a new chat to begin</p>
          </div>
        ) : (
          <ul className="space-y-2 overflow-y-auto">
            {chats.map(chat => (
              <li key={chat.id}>
                <button
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg ${
                    currentChat?.id === chat.id 
                      ? 'bg-accent text-white' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="capitalize">{chat.agentType} Agent</span>
                    <span>{formatDate(chat.lastUpdated)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
