import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let users = [];
let sessions = [];
let products = [
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
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = {
    id: uuidv4(),
    email,
    name: email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
  };
  
  res.json({ success: true, data: { user } });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  const user = {
    id: uuidv4(),
    email,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
  };
  
  users.push(user);
  res.json({ success: true, data: { user } });
});

app.get('/api/products/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  
  let filteredProducts = products;
  
  if (q) {
    const query = q.toLowerCase();
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
  }
  
  res.json({ success: true, data: filteredProducts });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  res.json({ success: true, data: product });
});

app.get('/api/products/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ success: true, data: categories });
});

app.post('/api/chat/session', (req, res) => {
  const { userId } = req.body;
  
  const session = {
    id: uuidv4(),
    userId,
    messages: [],
    cart: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  sessions.push(session);
  res.json({ success: true, data: session });
});

app.get('/api/chat/session/:id', (req, res) => {
  const session = sessions.find(s => s.id === req.params.id);
  
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  
  res.json({ success: true, data: session });
});

app.post('/api/chat/message', (req, res) => {
  const { sessionId, message } = req.body;
  
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  
  const userMessage = {
    id: uuidv4(),
    content: message,
    type: 'user',
    timestamp: new Date(),
  };
  
  const botResponse = processMessage(message);
  
  session.messages.push(userMessage, botResponse);
  session.updatedAt = new Date();
  
  res.json({ success: true, data: { userMessage, botResponse } });
});

app.post('/api/cart/add', (req, res) => {
  const { sessionId, productId, quantity } = req.body;
  
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  const existingItem = session.cart.find(item => item.product.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    session.cart.push({ product, quantity });
  }
  
  session.updatedAt = new Date();
  
  res.json({ success: true, data: session.cart });
});

app.get('/api/cart/:sessionId', (req, res) => {
  const session = sessions.find(s => s.id === req.params.sessionId);
  
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  
  res.json({ success: true, data: session.cart });
});

function processMessage(content) {
  const lowerContent = content.toLowerCase();
  
  let responseContent = "I'd be happy to help you! Let me know what you're looking for.";
  let responseProducts = [];
  
  if (lowerContent.includes('laptop') || lowerContent.includes('computer')) {
    responseContent = "Here are our top laptop recommendations:";
    responseProducts = products.filter(p => p.category === 'Electronics' && p.subcategory === 'Laptops').slice(0, 3);
  } else if (lowerContent.includes('help')) {
    responseContent = "I can help you with:\n\n• 🔍 Product Search\n• 📱 Product Details\n• 🛒 Shopping Cart\n• 💡 Recommendations\n\nWhat would you like to do?";
  }
  
  return {
    id: uuidv4(),
    content: responseContent,
    type: 'bot',
    timestamp: new Date(),
    products: responseProducts,
  };
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});