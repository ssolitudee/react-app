import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MessageBubble from './MessageBubble';

const ChatContainer: React.FC = () => {
  const { currentChat } = useAppContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  if (!currentChat) {
    return null;
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex flex-col space-y-2 pb-4">
        {/* Agent type indicator */}
        <div className="text-center mb-6">
          <span className="bg-primary-light text-gray-300 px-4 py-1 rounded-full text-sm">
            {currentChat.agentType === 'summary' ? 'Summary Agent' : 'Chatbot Agent'}
          </span>
        </div>
        
        {/* Messages */}
        {currentChat.messages.length === 0 ? (
          <div className="text-center text-gray-400 my-8">
            <p>Start the conversation by sending a message below.</p>
          </div>
        ) : (
          currentChat.messages.map(message => (
            <MessageBubble
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))
        )}
        
        {/* Empty div for auto-scrolling to bottom */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
