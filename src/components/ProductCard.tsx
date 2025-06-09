import React from 'react';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { useChat } from '../contexts/ChatContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useChat();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative group">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
        
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
            -{product.discount}%
          </div>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}/>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
            product.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
          </div>
        </div>

        <button onClick={handleAddToCart} disabled={!product.inStock} className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-orange-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;