import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';

// Types
interface Message {
  content: string;
  role: 'user' | 'assistant';
}

interface ChatRequest {
  messages: Message[];
  agent_type: 'chatbot' | 'summary';
}

interface ChatResponse {
  message: Message;
  chat_id: string;
}

interface ChatHistoryResponse {
  history: Record<string, Message[]>;
}

interface FAQResponse {
  faqs: { question: string; answer: string }[];
}

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// API Functions
const fetchFAQs = async (): Promise<FAQResponse> => {
  const response = await fetch(`${API_BASE_URL}/faq`);
  if (!response.ok) {
    throw new Error('Failed to fetch FAQs');
  }
  return response.json();
};

const fetchChatHistory = async (chatId?: string): Promise<ChatHistoryResponse> => {
  const url = chatId 
    ? `${API_BASE_URL}/history?chat_id=${chatId}` 
    : `${API_BASE_URL}/history`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
};

const sendMessage = async (chatRequest: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chatRequest),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};

// Custom Hooks
export const useFAQs = (options?: Omit<UseQueryOptions<FAQResponse, Error, FAQResponse>, 'queryKey' | 'queryFn'>) => {
  return useQuery<FAQResponse, Error>({
    queryKey: ['faqs'],
    queryFn: fetchFAQs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const useChatHistory = (chatId?: string, options?: Omit<UseQueryOptions<ChatHistoryResponse, Error, ChatHistoryResponse>, 'queryKey' | 'queryFn'>) => {
  return useQuery<ChatHistoryResponse, Error>({
    queryKey: ['chatHistory', chatId],
    queryFn: () => fetchChatHistory(chatId),
    staleTime: 30 * 1000, // 30 seconds
    ...options
  });
};

export const useSendMessage = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: sendMessage
  });
};
