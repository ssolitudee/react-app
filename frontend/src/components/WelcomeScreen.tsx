import React from 'react';
import AgentSelection from '../components/AgentSelection';
import logo from '../assets/logo.svg';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
      <div className="mb-8">
        <img src={logo} alt="Logo" className="w-48 h-24 mx-auto mb-6" />
        <div className="mb-4">
          <span className="text-red-800 text-4xl font-bold mr-2">Hi,</span>
          <span className="text-white text-4xl font-semibold">I'm Inventory Analyzer AI</span>
        </div>
        <p className="text-xl text-gray-300 font-light">
          A personalized AI assistant powered by advanced analytics that helps you manage and analyze your inventory data.
        </p>
      </div>
      
      <div className="mb-8">
        <AgentSelection />
      </div>
    </div>
  );
};

export default WelcomeScreen;
