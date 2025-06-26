import React from 'react';
import { ChartPieIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

const AgentSelection: React.FC = () => {
  const { selectedAgentType, setAgentType } = useAppContext();

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
      <button
        onClick={() => setAgentType('summary')}
        className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-300 ${selectedAgentType === 'summary' 
          ? 'bg-accent bg-opacity-20 border-accent' 
          : 'bg-primary-light border-gray-700 opacity-60'}`}
      >
        <ChartPieIcon className={`h-8 w-8 mb-2 ${selectedAgentType === 'summary' ? 'text-accent' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-bold mb-1 ${selectedAgentType === 'summary' ? 'text-white' : 'text-gray-300'}`}>Summary Agent</h3>
        <p className={`text-center text-xs ${selectedAgentType === 'summary' ? 'text-gray-200' : 'text-gray-500'}`}>
          Concise insights from your data
        </p>
      </button>
      
      <button
        onClick={() => setAgentType('chatbot')}
        className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-300 ${selectedAgentType === 'chatbot' 
          ? 'bg-accent bg-opacity-20 border-accent' 
          : 'bg-primary-light border-gray-700 opacity-60'}`}
      >
        <ChatBubbleBottomCenterTextIcon className={`h-8 w-8 mb-2 ${selectedAgentType === 'chatbot' ? 'text-accent' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-bold mb-1 ${selectedAgentType === 'chatbot' ? 'text-white' : 'text-gray-300'}`}>Chatbot Agent</h3>
        <p className={`text-center text-xs ${selectedAgentType === 'chatbot' ? 'text-gray-200' : 'text-gray-500'}`}>
          Interactive conversations about inventory
        </p>
      </button>
    </div>
  );
};

export default AgentSelection;
