import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { AppContext } from '../context/AppContext';

// Mock the context provider
const mockCreateNewChat = jest.fn();
const mockGoToWelcomeScreen = jest.fn();
const mockAppContextValue = {
  chats: [],
  currentChat: null,
  faqs: [],
  isDarkMode: true,
  selectedAgentType: 'summary' as 'summary' | 'chatbot',
  createNewChat: mockCreateNewChat,
  createNewChatWithMessage: jest.fn(),
  createNewChatWithMessageAndResponse: jest.fn(),
  addMessage: jest.fn(),
  addMessageToChat: jest.fn(),
  selectChat: jest.fn(),
  toggleDarkMode: jest.fn(),
  setAgentType: jest.fn(),
  goToWelcomeScreen: mockGoToWelcomeScreen,
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <AppContext.Provider value={mockAppContextValue}>
      {ui}
    </AppContext.Provider>
  );
};

describe('Header Component', () => {
  const mockSidebarToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with title', () => {
    renderWithContext(<Header onSidebarToggle={mockSidebarToggle} />);
    
    // Check if the title is rendered
    expect(screen.getByText('Inventory Analyzer AI')).toBeInTheDocument();
    
    // Check if the New Chat button is present
    expect(screen.getByText('New Chat')).toBeInTheDocument();
  });

  test('calls sidebar toggle when button is clicked', () => {
    renderWithContext(<Header onSidebarToggle={mockSidebarToggle} />);
    
    // Find and click the sidebar toggle button (in mobile view)
    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);
    
    // Check if mockSidebarToggle was called
    expect(mockSidebarToggle).toHaveBeenCalledTimes(1);
  });

  test('calls createNewChat when New Chat button is clicked', () => {
    renderWithContext(<Header onSidebarToggle={mockSidebarToggle} />);
    
    // Find and click the New Chat button
    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    fireEvent.click(newChatButton);
    
    // Check if createNewChat was called (no arguments now)
    expect(mockCreateNewChat).toHaveBeenCalledTimes(1);
  });

  test('calls goToWelcomeScreen when logo is clicked', () => {
    renderWithContext(<Header onSidebarToggle={mockSidebarToggle} />);
    
    // Find and click the logo button (containing the logo image and app title)
    const logoButton = screen.getByRole('button', { name: /inventory analyzer ai logo inventory analyzer ai/i });
    fireEvent.click(logoButton);
    
    // Check if goToWelcomeScreen was called
    expect(mockGoToWelcomeScreen).toHaveBeenCalledTimes(1);
  });
});
