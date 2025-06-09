const API_BASE = 'http://localhost:3001/api';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  searchProducts: (query: string, filters?: Record<string, any>) =>
    apiRequest(`/products/search?q=${encodeURIComponent(query)}${filters ? '&' + new URLSearchParams(filters).toString() : ''}`),

  getProduct: (id: string) =>
    apiRequest(`/products/${id}`),

  getCategories: () =>
    apiRequest('/products/categories'),

  sendMessage: (sessionId: string, message: string) =>
    apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message }),
    }),

  createSession: (userId: string) =>
    apiRequest('/chat/session', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  getSession: (sessionId: string) =>
    apiRequest(`/chat/session/${sessionId}`),

  addToCart: (sessionId: string, productId: string, quantity: number) =>
    apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ sessionId, productId, quantity }),
    }),

  getCart: (sessionId: string) =>
    apiRequest(`/cart/${sessionId}`),

  updateCartItem: (sessionId: string, productId: string, quantity: number) =>
    apiRequest('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ sessionId, productId, quantity }),
    }),

  removeFromCart: (sessionId: string, productId: string) =>
    apiRequest('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ sessionId, productId }),
    }),
};