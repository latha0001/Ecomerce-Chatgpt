import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, Session, Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from '../components/uuid';

interface ChatContextType {
  session: Session | null;
  messages: ChatMessage[];
  cart: CartItem[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearChat: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (user && !session) {
      initializeSession();
    }
  }, [user]);

  const initializeSession = () => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      setSession(parsedSession);
      setMessages(parsedSession.messages || []);
      setCart(parsedSession.cart || []);
    } else if (user) {
      const newSession: Session = {
        id: uuidv4(),
        userId: user.id,
        messages: [],
        cart: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSession(newSession);
      localStorage.setItem('session', JSON.stringify(newSession));
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        content: `Hello ${user.name}! 👋 I'm your shopping assistant. I can help you find products, answer questions, and assist with your purchase. What are you looking for today?`,
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const updateSession = (updatedSession: Session) => {
    setSession(updatedSession);
    localStorage.setItem('session', JSON.stringify(updatedSession));
  };

  const sendMessage = async (content: string) => {
    if (!session) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    const botResponse = await processMessage(content);
    const finalMessages = [...updatedMessages, botResponse];
    
    setMessages(finalMessages);
    setIsTyping(false);
    const updatedSession = {
      ...session,
      messages: finalMessages,
      cart,
      updatedAt: new Date(),
    };
    updateSession(updatedSession);
  };

  const processMessage = async (content: string): Promise<ChatMessage> => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('search') || lowerContent.includes('find') || lowerContent.includes('looking for')) {
      const products = await searchProducts(content);
      return {
        id: uuidv4(),
        content: `I found ${products.length} products that match your search. Here are some great options:`,
        type: 'bot',
        timestamp: new Date(),
        products: products.slice(0, 6),
        actions: [
          { type: 'search', label: 'Refine Search', data: { query: content } },
          { type: 'filter', label: 'Apply Filters' }
        ]
      };
    }
    if (lowerContent.includes('laptop') || lowerContent.includes('computer')) {
      const products = await getProductsByCategory('Electronics', 'Laptops');
      return {
        id: uuidv4(),
        content: "Here are our top laptop recommendations:",
        type: 'bot',
        timestamp: new Date(),
        products: products.slice(0, 4),
      };
    }

    if (lowerContent.includes('phone') || lowerContent.includes('smartphone')) {
      const products = await getProductsByCategory('Electronics', 'Smartphones');
      return {
        id: uuidv4(),
        content: "Check out these amazing smartphones:",
        type: 'bot',
        timestamp: new Date(),
        products: products.slice(0, 4),
      };
    }

    if (lowerContent.includes('book')) {
      const products = await getProductsByCategory('Books', 'Fiction');
      return {
        id: uuidv4(),
        content: "Here are some popular books you might enjoy:",
        type: 'bot',
        timestamp: new Date(),
        products: products.slice(0, 4),
      };
    }
    if (lowerContent.includes('cart') || lowerContent.includes('basket')) {
      if (cart.length === 0) {
        return {
          id: uuidv4(),
          content: "Your cart is currently empty. Would you like me to help you find some products?",
          type: 'bot',
          timestamp: new Date(),
        };
      } else {
        return {
          id: uuidv4(),
          content: `You have ${cart.length} item(s) in your cart with a total of $${getTotalPrice().toFixed(2)}. Would you like to proceed to checkout?`,
          type: 'bot',
          timestamp: new Date(),
          actions: [
            { type: 'checkout', label: 'Proceed to Checkout' }
          ]
        };
      }
    }
    if (lowerContent.includes('help') || lowerContent.includes('what can you do')) {
      return {
        id: uuidv4(),
        content: "I can help you with:\n\n• 🔍 **Product Search** - Find specific items or browse categories\n• 📱 **Product Details** - Get detailed information about any product\n• 🛒 **Shopping Cart** - Add items, view cart, and checkout\n• 💡 **Recommendations** - Get personalized product suggestions\n• 📞 **Support** - Answer questions about orders, shipping, and returns\n\nJust ask me anything! For example: 'Show me laptops under $1000' or 'I need a good smartphone'",
        type: 'bot',
        timestamp: new Date(),
      };
    }
    const suggestions = [
      "Show me laptops under $1000",
      "I need a new smartphone",
      "Find me some programming books",
      "What are your best sellers?",
    ];

    return {
      id: uuidv4(),
      content: `I'd be happy to help you! Here are some things you can try:\n\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nOr just tell me what you're looking for!`,
      type: 'bot',
      timestamp: new Date(),
    };
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getProductsByCategory = async (category: string, subcategory?: string): Promise<Product[]> => {
    return mockProducts.filter(product => 
      product.category === category && (!subcategory || product.subcategory === subcategory)
    );
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateCartItem(product.id, existingItem.quantity + quantity);
    } else {
      const newCart = [...cart, { product, quantity }];
      setCart(newCart);
      
      if (session) {
        updateSession({ ...session, cart: newCart });
      }
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    
    if (session) {
      updateSession({ ...session, cart: newCart });
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    
    if (session) {
      updateSession({ ...session, cart: newCart });
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (session) {
      const clearedSession = { ...session, messages: [] };
      updateSession(clearedSession);
    }
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ChatContext.Provider value={{
      session,
      messages,
      cart,
      isTyping,
      sendMessage,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearChat,
      getTotalPrice,
      getCartCount,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3',
    description: 'Powerful laptop with M3 chip, perfect for professionals and creatives.',
    price: 2399,
    originalPrice: 2599,
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
    rating: 4.8,
    reviewCount: 256,
    inStock: true,
    stockCount: 15,
    specifications: {
      'Processor': 'Apple M3 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '16.2" Liquid Retina XDR',
    },
    tags: ['laptop', 'apple', 'professional', 'creative'],
    discount: 8,
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with titanium design and advanced camera system.',
    price: 1199,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
    rating: 4.9,
    reviewCount: 542,
    inStock: true,
    stockCount: 8,
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Battery': 'All-day battery life',
    },
    tags: ['smartphone', 'apple', 'camera', 'premium'],
  },
  {
    id: '3',
    name: 'Clean Code: A Handbook',
    description: 'Essential reading for software developers. Learn to write clean, maintainable code.',
    price: 45,
    category: 'Books',
    subcategory: 'Programming',
    brand: 'Prentice Hall',
    imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
    images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'],
    rating: 4.7,
    reviewCount: 1829,
    inStock: true,
    stockCount: 50,
    specifications: {
      'Author': 'Robert C. Martin',
      'Pages': '464',
      'Publisher': 'Prentice Hall',
      'Language': 'English',
    },
    tags: ['programming', 'software', 'development', 'clean code'],
  },
  {
    id: '4',
    name: 'Dell XPS 13',
    description: 'Ultrabook with stunning InfinityEdge display and premium build quality.',
    price: 999,
    originalPrice: 1199,
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Dell',
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg'],
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stockCount: 12,
    specifications: {
      'Processor': 'Intel Core i7',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '13.4" FHD+',
    },
    tags: ['laptop', 'dell', 'ultrabook', 'portable'],
    discount: 17,
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen and advanced AI features.',
    price: 1299,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'],
    rating: 4.8,
    reviewCount: 387,
    inStock: true,
    stockCount: 6,
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Storage': '256GB',
      'Camera': '200MP Main Camera',
      'S Pen': 'Built-in S Pen',
    },
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
  },
  {
    id: '6',
    name: 'The Pragmatic Programmer',
    description: 'Your journey to mastery. Classic programming book with timeless advice.',
    price: 52,
    category: 'Books',
    subcategory: 'Programming',
    brand: 'Addison-Wesley',
    imageUrl: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg',
    images: ['https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg'],
    rating: 4.8,
    reviewCount: 892,
    inStock: true,
    stockCount: 35,
    specifications: {
      'Author': 'David Thomas, Andrew Hunt',
      'Pages': '352',
      'Edition': '20th Anniversary Edition',
      'Publisher': 'Addison-Wesley',
    },
    tags: ['programming', 'software', 'pragmatic', 'mastery'],
  },
];