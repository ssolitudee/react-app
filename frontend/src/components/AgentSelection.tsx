import React, { useContext } from 'react';
import { ChartPieIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

interface AgentSelectionProps {
  compact?: boolean;
}

const AgentSelection: React.FC<AgentSelectionProps> = ({ compact = false }) => {
  const { selectedAgentType, setAgentType } = useAppContext();

  return (
    <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-3 w-full ${compact ? 'max-w-lg' : 'max-w-xl'}`}>
      <button
        onClick={() => setAgentType('summary')}
        className={`flex flex-col items-center ${compact ? 'p-3' : 'p-4'} rounded-lg border transition-all duration-300 hover:scale-105 ${selectedAgentType === 'summary' 
          ? 'bg-blue-600 bg-opacity-20 border-blue-500 shadow-lg' 
          : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'}`}
      >
        <ChartPieIcon className={`${compact ? 'h-6 w-6 mb-1' : 'h-8 w-8 mb-2'} ${selectedAgentType === 'summary' ? 'text-blue-400' : 'text-gray-400'}`} />
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold mb-1 ${selectedAgentType === 'summary' ? 'text-white' : 'text-gray-200'}`}>Summary Agent</h3>
        <p className={`text-center ${compact ? 'text-xs leading-tight' : 'text-xs'} ${selectedAgentType === 'summary' ? 'text-gray-200' : 'text-gray-400'}`}>
          {compact ? 'Concise insights & summaries' : 'Get concise insights and summaries from your inventory data'}
        </p>
      </button>
      
      <button
        onClick={() => setAgentType('chatbot')}
        className={`flex flex-col items-center ${compact ? 'p-3' : 'p-4'} rounded-lg border transition-all duration-300 hover:scale-105 ${selectedAgentType === 'chatbot' 
          ? 'bg-blue-600 bg-opacity-20 border-blue-500 shadow-lg' 
          : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'}`}
      >
        <ChatBubbleBottomCenterTextIcon className={`${compact ? 'h-6 w-6 mb-1' : 'h-8 w-8 mb-2'} ${selectedAgentType === 'chatbot' ? 'text-blue-400' : 'text-gray-400'}`} />
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold mb-1 ${selectedAgentType === 'chatbot' ? 'text-white' : 'text-gray-200'}`}>Chatbot Agent</h3>
        <p className={`text-center ${compact ? 'text-xs leading-tight' : 'text-xs'} ${selectedAgentType === 'chatbot' ? 'text-gray-200' : 'text-gray-400'}`}>
          {compact ? 'Interactive conversations' : 'Have interactive conversations about your inventory'}
        </p>
      </button>
    </div>
  );
};

export default AgentSelection;
