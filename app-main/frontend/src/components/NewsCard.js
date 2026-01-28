import React from 'react';
import { Calendar, Tag } from 'lucide-react';

const NewsCard = ({ news }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Alerta': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Obra': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Evento': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Geral': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    };
    return colors[category] || colors['Geral'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div
      data-testid={`news-card-${news.id}`}
      className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 group cursor-pointer"
    >
      {/* Image */}
      {news.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
            {news.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            {formatDate(news.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg font-heading mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {news.title}
        </h3>

        {/* Content */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {news.content}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
