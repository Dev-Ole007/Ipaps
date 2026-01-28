import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Newspaper } from 'lucide-react';
import NewsCard from '@/components/NewsCard';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn('Firestore not initialized');
      setNews([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = [];
      snapshot.forEach((doc) => {
        newsData.push({ id: doc.id, ...doc.data() });
      });
      setNews(newsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="pb-32 px-6">
      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">A Voz da Cidade</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ipaporanga em Tempo Real</p>
          </div>
        </div>
      </div>

      {/* News Feed */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 animate-pulse">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem] mb-4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12" data-testid="no-news-message">
          <p className="text-slate-500 dark:text-slate-400">Nenhuma notícia publicada ainda</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="news-feed">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
