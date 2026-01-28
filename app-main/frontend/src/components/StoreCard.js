import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ store }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/stores/${store.id}`)}
      data-testid={`store-card-${store.id}`}
      className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex gap-4">
        {/* Logo */}
        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0">
          {store.logo ? (
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
          ) : (
            store.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg font-heading truncate group-hover:text-emerald-600 transition-colors">
            {store.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{store.category}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(store.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
            <span className="text-sm font-semibold ml-1">{store.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {store.description && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {store.description}
        </p>
      )}
    </div>
  );
};

export default StoreCard;
