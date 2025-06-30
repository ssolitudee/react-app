import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import FAQGrid from './components/FAQGrid';
import { useAppContext } from './context/AppContext';
import logo from './assets/logo.svg';

// Separate component for the logo button to properly use hooks
const LogoButton: React.FC = () => {
  const { goToWelcomeScreen } = useAppContext();
  
  return (
    <button 
      onClick={goToWelcomeScreen} 
      className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-125 relative"
      aria-label="Return to main page"
    >
      <img src={logo} alt="Logo" className="h-12 w-28" />
    </button>
  );
};

const AppContent: React.FC = () => {
  const { currentChat } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex border-b border-gray-700">
        <div className="w-64 md:flex hidden bg-gray-950 items-center p-4">
          <LogoButton />
        </div>
        <div className="flex-1 border-l border-gray-700 bg-gray-950">
          <Header onSidebarToggle={toggleSidebar} showLogo={false} />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main content area with absolute positioned input */}
        <div className="flex-1 relative overflow-hidden border-l border-gray-700">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Content area with bottom padding to avoid overlap with fixed input */}
          <div className="h-full overflow-y-auto pb-20">
            {!currentChat ? (
              <div className="h-full flex flex-col">
                {/* Welcome screen content */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <WelcomeScreen />
                </div>
                {/* FAQ section */}
                <div className="flex-shrink-0 w-full px-2 pb-3">
                  <FAQGrid />
                </div>
              </div>
            ) : (
              /* Chat container */
              <ChatContainer />
            )}
          </div>
          
          {/* Input area - absolutely positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gray-700">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
