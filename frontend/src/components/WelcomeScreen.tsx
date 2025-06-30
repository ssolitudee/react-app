import React, { useEffect, useState } from 'react';
import AgentSelection from '../components/AgentSelection';
import logo from '../assets/logo.svg';

const WelcomeScreen: React.FC = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [scale, setScale] = useState(1);
  
  // Update viewport height on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      
      // Calculate scale factor based on screen height
      // Adjust content to fit within available height (minus headers and paddings)
      const availableHeight = window.innerHeight - 120; // Account for headers/nav
      const minHeight = 500; // Minimum height the content is designed for
      
      // Only scale down, never up
      if (availableHeight < minHeight) {
        setScale(Math.max(0.7, availableHeight / minHeight)); // Don't scale below 70%
      } else {
        setScale(1);
      }
    };
    
    // Initial calculation
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto"
      style={{
        padding: `${Math.max(8, 16 * scale)}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        height: '100%',
      }}
    >
      <div className={`${scale < 1 ? 'mb-2' : 'mb-6'}`}>
        <img 
          src={logo} 
          alt="Logo" 
          className="mx-auto" 
          style={{
            width: `${Math.min(192, 192 * scale)}px`,
            height: `${Math.min(96, 96 * scale)}px`,
            marginBottom: `${Math.max(12, 24 * scale)}px`
          }}
        />
        <div className={`${scale < 1 ? 'mb-2' : 'mb-4'}`}>
          <span className="text-red-800 font-bold mr-2" style={{ fontSize: `${Math.max(18, 28 * scale)}px` }}>Hi,</span>
          <span className="text-white font-semibold" style={{ fontSize: `${Math.max(18, 28 * scale)}px` }}>I'm Inventory Analyzer AI</span>
        </div>
        <p className="text-gray-300 font-light" style={{ fontSize: `${Math.max(14, 20 * scale)}px` }}>
          A personalized AI assistant powered by advanced analytics that helps you manage and analyze your inventory data.
        </p>
      </div>
      
      <div className={`${scale < 1 ? 'mb-2' : 'mb-8'}`}>
        <AgentSelection />
      </div>
    </div>
  );
};

export default WelcomeScreen;
