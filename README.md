# E-commerce Sales Chatbot

A comprehensive, AI-powered sales chatbot designed for e-commerce platforms, featuring intelligent product search, natural language processing, and seamless shopping experiences across all devices.

## Project Overview

This project implements a full-stack e-commerce chatbot solution that enhances the shopping experience by enabling efficient search, exploration, and purchase processes. The application features a modern, responsive interface with advanced conversational AI capabilities and a complete backend simulation.

### Key Features

- **Intelligent Chatbot Interface**: Natural language processing for product queries
-  **User Authentication**: Secure login and registration system
-  **Advanced Product Search**: Smart filtering and exploration capabilities
-  **Shopping Cart Management**: Real-time cart updates and checkout simulation
-  **Responsive Design**: Optimized for desktop, tablet, and mobile devices
-  **Session Management**: Persistent conversations with timestamps
-  **Premium UI/UX**: Modern design with smooth animations and micro-interactions

## Architecture

### Frontend Architecture
```
src/
├── components/   
│   ├── AuthForm.tsx    
│   ├── ChatInterface.tsx 
│   ├── ProductCard.tsx 
│   └── TypingIndicator.tsx 
├── contexts/           
│   ├── AuthContext.tsx 
│   └── ChatContext.tsx 
├── types/              
├── utils/              
└── App.tsx           
```

### Backend Architecture
```
server/
└── index.js  
```

### Technology Stack

#### Frontend
- **React** with TypeScript for type-safe component development
- **Tailwind CSS** for utility-first styling and responsive design
- **Lucide React** for consistent iconography

#### Backend
- **Node.js** with Express.js for RESTful API development
- **CORS** for cross-origin resource sharing
- **UUID** for unique identifier generation

#### Development Tools
- **ESLint** for code quality and consistency
- **TypeScript** for static type checking
- **PostCSS** with Autoprefixer for CSS processing

## Installation & Setup

### Prerequisites
- Node.js 
- npm 

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3001`

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start the backend API server
- `npm run lint` - Run ESLint for code quality checks

### Sample Queries
- "I need a new laptop for programming ?"
- "Show me smartphones under $800 ?"
- "Find me some programming books ?"
- "What are your best sellers ?"
- "Add this to my cart ?"
- "Show me my cart ?"

## Usage Guide

### Authentication
1. **Registration**: Create a new account with name, email, and password
2. **Login**: Sign in with existing credentials
3. **Session Management**: User sessions persist across browser refreshes

### Chatbot Interaction
1. **Natural Language Queries**: Ask questions like "Show me laptops under $1000"
2. **Product Search**: Search by category, brand, or specific features
3. **Product Exploration**: View detailed product information and specifications
4. **Cart Management**: Add products to cart and manage quantities

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly interface elements
- Optimized chat interface for small screens
- Responsive product grid layouts
- Mobile-first CSS approach

## Future Enhancements

### Planned Features
- **AI Integration**: Advanced NLP with OpenAI or similar services
- **Real Database**: PostgreSQL or MongoDB integration
- **Payment Processing**: Stripe or PayPal integration
- **Order Management**: Complete order lifecycle
- **Admin Dashboard**: Product and user management
- **Analytics**: User behavior tracking and insights

### Technical Improvements
- **Microservices Architecture**: Separate services for different domains
- **Real-time Features**: WebSocket integration for live chat
- **Progressive Web App**: Offline functionality and push notifications
- **Advanced Search**: Elasticsearch integration for complex queries

#### CORS Issues
- Ensure backend server is running on port 3001
- Check CORS configuration in server/index.js
