import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { getItemCount, setIsOpen } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col" data-testid="app-logo">
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
              <span className="text-slate-900 dark:text-white">Ipaporanga</span>
              <span className="text-emerald-600">Hub</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Inovação no Sertão de Crateús</p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              onClick={toggleTheme}
              className="h-12 w-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Cart Button */}
            <button
              data-testid="cart-button"
              onClick={() => setIsOpen(true)}
              className="relative h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              data-testid="profile-button"
              onClick={() => navigate('/admin')}
              className="h-12 w-12 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
