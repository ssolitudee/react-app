import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MessageBubble from './MessageBubble';

const ChatContainer: React.FC = () => {
  const { currentChat } = useAppContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    // Use instant scroll to prevent layout shifts that might affect input positioning
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'auto',  // Changed from 'smooth' to 'auto' to prevent viewport interference
        block: 'end',      // Scroll to the end of the element
        inline: 'nearest'  // Don't interfere with horizontal scrolling
      });
    }
  }, [currentChat?.messages]);

  if (!currentChat) {
    return null;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
        {/* Agent type indicator */}
        <div className="text-center mb-6">
          <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700">
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
        
        {/* Invisible element to scroll to */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
