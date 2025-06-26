import React from 'react';
import AgentSelection from '../components/AgentSelection';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-4">
        <span className="text-accent text-3xl font-bold mr-2">Hi,</span>
        <span className="text-white text-3xl font-bold">I'm Inventory Analyzer AI</span>
      </div>
      
      <p className="text-gray-400 text-base mb-5 max-w-2xl">
        Select an agent type below:
      </p>
      
      <AgentSelection />
    </div>
  );
};

export default WelcomeScreen;
