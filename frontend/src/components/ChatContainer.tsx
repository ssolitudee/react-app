import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import MessageBubble from './MessageBubble';

const ChatContainer: React.FC = () => {
  const { currentChat } = useAppContext();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Check if user is near bottom of chat
  const checkScrollPosition = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = scrollBottom < 50; // Within 50px of bottom
    
    setIsNearBottom(isNearBottom);
    
    // Only show scroll button if we're not near bottom
    if (isNearBottom) {
      setShowScrollButton(false);
    }
  }, []);

  // Handle container scrolling
  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (!chatEndRef.current) return;
    
    chatEndRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
    
    setShowScrollButton(false);
  }, []);

  // Auto-scroll to bottom when new messages are added, respecting user scroll position
  useEffect(() => {
    // If no messages or same message count, do nothing
    if (!currentChat?.messages || !currentChat.messages.length) return;
    
    // Check if new messages were added
    const currentMessageCount = currentChat.messages.length;
    const hasNewMessages = currentMessageCount > lastMessageCount;
    setLastMessageCount(currentMessageCount);
    
    if (hasNewMessages) {
      // If user is already near bottom or this is the first message, scroll down
      if (isNearBottom || currentMessageCount === 1) {
        // Small timeout allows DOM to update before scrolling
        setTimeout(() => {
          if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ 
              behavior: currentMessageCount === 1 ? 'auto' : 'smooth',
              block: 'end', 
              inline: 'nearest'
            });
          }
        }, 50);
      } else {
        // User is scrolled up, show the scroll button
        setShowScrollButton(true);
      }
    }
  }, [currentChat?.messages, isNearBottom, lastMessageCount]);
  
  // Check scroll position on resize
  useEffect(() => {
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition]);

  if (!currentChat) {
    return null;
  }

  return (
    <div 
      className="flex-1 p-6 overflow-y-auto relative chat-container" 
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
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
      
      {/* New messages button - shown when user has scrolled up and new messages arrive */}
      {showScrollButton && (
        <button
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-gentle z-10 transition-all duration-300"
          onClick={scrollToBottom}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          New messages
        </button>
      )}
    </div>
  );
};

export default ChatContainer;
