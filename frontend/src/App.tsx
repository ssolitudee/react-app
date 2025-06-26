import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import FAQGrid from './components/FAQGrid';
import { useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const { currentChat } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-primary text-white">
      <Header onSidebarToggle={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className="h-full flex flex-col">
            {!currentChat ? (
              <div className="flex flex-col h-full">
                <div className="flex-grow flex flex-col items-center justify-center">
                  <WelcomeScreen />
                </div>
                <div className="flex-shrink-0 pt-3 pb-3 w-full px-2">
                  <FAQGrid />
                </div>
                <div className="flex-shrink-0">
                  <ChatInput />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto">
                  <ChatContainer />
                </div>
                <ChatInput />
              </>
            )}
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
