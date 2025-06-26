import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

const FAQGrid: React.FC = () => {
  const { faqs } = useAppContext();
  
  // Ensure we display exactly 4 FAQs in a 2x2 grid
  const displayFaqs = faqs.slice(0, 4);
  
  // If we have less than 4 FAQs, fill with placeholders
  while (displayFaqs.length < 4) {
    displayFaqs.push({
      question: `Question ${displayFaqs.length + 1}`,
      answer: 'Information will be provided here.'
    });
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <QuestionMarkCircleIcon className="h-5 w-5 text-accent mr-2" />
        <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {displayFaqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-primary-light p-2 rounded-lg border border-gray-800 h-[65px] overflow-hidden flex flex-col"
          >
            <h3 className="text-white font-semibold text-sm mb-1">{faq.question}</h3>
            <p className="text-gray-400 text-xs flex-1">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQGrid;
