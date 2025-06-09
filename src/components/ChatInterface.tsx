import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingCart, RotateCcw, User, Bot } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import TypingIndicator from './TypingIndicator';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isTyping, clearChat, getCartCount } = useChat();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage('');
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Shopping Assistant</h1>
            <p className="text-sm text-gray-500">Online • Ready to help</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>
          <button onClick={clearChat} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Clear chat">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} space-x-3`}>
            {msg.type === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-3xl ${msg.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
              {msg.products && msg.products.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {msg.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((action, index) => (
                    <button key={index} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors">
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <div
                className={`text-xs text-gray-500 mt-1 ${
                  msg.type === 'user' ? 'text-right' : 'text-left'
                }`} >
                {formatTimestamp(msg.timestamp)}
              </div>
            </div>

            {msg.type === 'user' && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full"/>
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask me anything about our products..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isTyping}/>
          </div>
          <button type="submit" disabled={!message.trim() || isTyping} className="bg-gradient-to-r from-blue-500 to-orange-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-orange-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;