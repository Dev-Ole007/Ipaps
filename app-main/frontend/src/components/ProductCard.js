import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product, store }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, store);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-base font-heading truncate group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{product.category}</p>
        
        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-2xl font-bold text-emerald-600">
            R$ {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            data-testid={`add-to-cart-${product.id}`}
            className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
