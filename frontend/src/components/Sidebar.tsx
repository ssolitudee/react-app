import React from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { chats, currentChat, selectChat, createNewChat } = useAppContext();
  
  // Format date to display only the relevant parts
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleNewThread = () => {
    createNewChat();
    onClose(); // Close sidebar on mobile after creating new chat
  };

  return (
    <aside 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:static left-0 top-0 z-40 h-screen w-64 bg-gray-950 transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* New Thread Button */}
        <button
          onClick={handleNewThread}
          className="flex items-center justify-center w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg mb-6 transition-colors border border-gray-800 hover:border-gray-600"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          <span className="font-medium">New Thread</span>
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-semibold">Recent Chats</h2>
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
            <p className="text-center text-sm">Start a new thread to begin</p>
          </div>
        ) : (
          <ul className="space-y-2 overflow-y-auto">
            {chats.map(chat => (
              <li key={chat.id}>
                <button
                  onClick={() => {
                    selectChat(chat.id);
                    onClose(); // Close sidebar on mobile after selecting chat
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentChat?.id === chat.id 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.messages.length > 0 
                          ? chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? '...' : '')
                          : 'New Chat'
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(chat.createdAt)}
                      </p>
                    </div>
                    <ChatBubbleLeftRightIcon className="h-4 w-4 ml-2 flex-shrink-0" />
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
