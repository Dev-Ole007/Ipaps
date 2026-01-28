import React from 'react';
import { Home, Store, Newspaper, Briefcase, Bus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/', testId: 'nav-home' },
    { icon: Store, label: 'Lojas', path: '/stores', testId: 'nav-stores' },
    { icon: Newspaper, label: 'Notícias', path: '/news', testId: 'nav-news' },
    { icon: Briefcase, label: 'Serviços', path: '/services', testId: 'nav-services' },
    { icon: Bus, label: 'Viagens', path: '/trips', testId: 'nav-trips' }
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50" data-testid="bottom-navigation">
      <div className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-full flex items-center justify-around px-4">
        {navItems.map(({ icon: Icon, label, path, testId }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              data-testid={testId}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-emerald-600 scale-110'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:scale-105'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
