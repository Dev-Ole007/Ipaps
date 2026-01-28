import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Group items by store
    const itemsByStore = {};
    cart.forEach(item => {
      const storeId = item.store.id;
      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = {
          store: item.store,
          items: []
        };
      }
      itemsByStore[storeId].items.push(item);
    });

    // Create WhatsApp message for each store
    Object.values(itemsByStore).forEach(({ store, items }) => {
      let message = `Olá! Gostaria de fazer um pedido via Ipaporanga Hub:\n\n`;
      let storeTotal = 0;

      items.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        storeTotal += itemTotal;
        message += `${item.quantity}x ${item.product.name} - R$ ${itemTotal.toFixed(2)}\n`;
      });

      message += `\nTotal: R$ ${storeTotal.toFixed(2)}\n\n`;
      message += `Endereço de entrega: [Por favor, preencha seu endereço]`;

      const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });

    clearCart();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
        data-testid="cart-overlay"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col" data-testid="cart-drawer">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading">Carrinho</h2>
          <button
            onClick={() => setIsOpen(false)}
            data-testid="close-cart-button"
            className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center" data-testid="empty-cart-message">
              <p className="text-slate-500 dark:text-slate-400">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  data-testid={`cart-item-${item.product.id}`}
                  className="bg-slate-50 dark:bg-slate-800 rounded-[2rem] p-4 flex gap-4"
                >
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-[1.5rem]"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.store.name}</p>
                    <p className="text-emerald-600 font-bold mt-1">R$ {item.product.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        data-testid={`decrease-quantity-${item.product.id}`}
                        className="h-8 w-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        data-testid={`increase-quantity-${item.product.id}`}
                        className="h-8 w-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        data-testid={`remove-item-${item.product.id}`}
                        className="ml-auto h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-emerald-600" data-testid="cart-total">
                R$ {getTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              data-testid="checkout-button"
              className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              Finalizar Pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
