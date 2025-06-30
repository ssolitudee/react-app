import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, role, timestamp }) => {
  const isUser = role === 'user';
  
  // Format time as HH:MM
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`
        flex max-w-[80%] md:max-w-[70%] 
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
          ${isUser ? 'ml-3' : 'mr-3'} 
          ${isUser ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-gray-600 to-gray-800'}
          shadow-md transition-all duration-300`
        }>
          {isUser ? (
            <UserCircleIcon className="h-7 w-7 text-white" />
          ) : (
            <SparklesIcon className="h-5 w-5 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`
          py-3 px-4 rounded-2xl 
          ${isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
            : 'bg-gradient-to-r from-gray-800 to-gray-750 text-gray-100 border border-gray-700/30 shadow-md'
          }
          backdrop-blur-sm transition-all duration-300
        `}>
          <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{content}</p>
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100/80' : 'text-gray-400/80'} font-light`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
