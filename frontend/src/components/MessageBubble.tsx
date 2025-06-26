import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        flex max-w-[80%] md:max-w-[70%] 
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
          ${isUser ? 'ml-3' : 'mr-3'} 
          ${isUser ? 'bg-accent' : 'bg-primary-light'}`
        }>
          {isUser ? (
            <UserCircleIcon className="h-9 w-9 text-white" />
          ) : (
            <ComputerDesktopIcon className="h-6 w-6 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`
          py-3 px-4 rounded-lg 
          ${isUser ? 'bg-accent text-white' : 'bg-primary-light text-white border border-gray-700'}
        `}>
          <p className="text-sm md:text-base whitespace-pre-wrap">{content}</p>
          <div className={`text-xs mt-1 ${isUser ? 'text-white text-opacity-80' : 'text-gray-400'}`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
