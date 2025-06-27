import React from 'react';
import { useAppContext } from '../context/AppContext';

const FAQGrid: React.FC = () => {
  const { faqs, createNewChatWithMessageAndResponse } = useAppContext();
  
  // Sample questions if no FAQs are available
  const sampleQuestions = [
    "What is the weather in Tokyo?",
    "What is assistant-ui?",
    "How do I analyze inventory data?",
    "What reports can you generate?"
  ];
  
  // Ensure we display exactly 4 FAQs in a 2x2 grid
  const displayQuestions = faqs.length > 0 
    ? faqs.slice(0, 4).map(faq => faq.question)
    : sampleQuestions.slice(0, 4);
    
  // If we have less than 4 FAQs, fill with placeholders
  while (displayQuestions.length < 4) {
    displayQuestions.push(`Question ${displayQuestions.length + 1}`);
  }

  const handleQuestionClick = (question: string) => {
    createNewChatWithMessageAndResponse(question);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-medium text-white mb-4 text-center">
        How can I help you today?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {displayQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 p-4 rounded-lg text-left transition-all duration-200 hover:shadow-lg group"
          >
            <p className="text-gray-300 group-hover:text-white text-sm font-medium leading-relaxed">
              {question}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FAQGrid;
