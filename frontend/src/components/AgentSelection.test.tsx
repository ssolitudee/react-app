import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentSelection from './AgentSelection';
import { AppContext } from '../context/AppContext';

// Mock the context provider
const mockSetAgentType = jest.fn();
const mockAppContextValue = {
  chats: [],
  currentChat: null,
  faqs: [],
  isDarkMode: true,
  selectedAgentType: 'summary' as 'summary' | 'chatbot',
  createNewChat: jest.fn(),
  addMessage: jest.fn(),
  selectChat: jest.fn(),
  toggleDarkMode: jest.fn(),
  setAgentType: mockSetAgentType,
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <AppContext.Provider value={mockAppContextValue}>
      {ui}
    </AppContext.Provider>
  );
};

describe('AgentSelection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both agent options', () => {
    renderWithContext(<AgentSelection />);
    
    // Check if both agent buttons are present
    expect(screen.getByText('Summary Agent')).toBeInTheDocument();
    expect(screen.getByText('Chatbot Agent')).toBeInTheDocument();
  });

  test('calls setAgentType with "summary" when Summary Agent is clicked', () => {
    renderWithContext(<AgentSelection />);
    
    // Find and click the Summary Agent button
    const summaryButton = screen.getByText('Summary Agent').closest('button');
    fireEvent.click(summaryButton!);
    
    // Check if setAgentType was called with the right agent type
    expect(mockSetAgentType).toHaveBeenCalledTimes(1);
    expect(mockSetAgentType).toHaveBeenCalledWith('summary');
  });

  test('calls setAgentType with "chatbot" when Chatbot Agent is clicked', () => {
    renderWithContext(<AgentSelection />);
    
    // Find and click the Chatbot Agent button
    const chatbotButton = screen.getByText('Chatbot Agent').closest('button');
    fireEvent.click(chatbotButton!);
    
    // Check if setAgentType was called with the right agent type
    expect(mockSetAgentType).toHaveBeenCalledTimes(1);
    expect(mockSetAgentType).toHaveBeenCalledWith('chatbot');
  });

  test('displays description text for each agent option', () => {
    renderWithContext(<AgentSelection />);
    
    // Check if the descriptions are present
    expect(screen.getByText(/Get concise summaries and key insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Have detailed conversations and ask specific questions/i)).toBeInTheDocument();
  });
});
