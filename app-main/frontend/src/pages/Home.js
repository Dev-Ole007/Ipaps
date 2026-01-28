import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShoppingBag, Pill, Utensils, IceCream, Hammer, Smartphone, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StoreCard from '@/components/StoreCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredStores, setFeaturedStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn('Firestore not initialized - using demo data');
      setFeaturedStores([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'stores'),
      orderBy('rating', 'desc'),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stores = [];
      snapshot.forEach((doc) => {
        stores.push({ id: doc.id, ...doc.data() });
      });
      setFeaturedStores(stores);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { icon: ShoppingBag, label: 'Mercados', color: 'from-emerald-500 to-teal-500' },
    { icon: Smartphone, label: 'Eletrônicos', color: 'from-blue-500 to-cyan-500' },
    { icon: Pill, label: 'Farmácia', color: 'from-red-500 to-pink-500' },
    { icon: Utensils, label: 'Comida', color: 'from-orange-500 to-amber-500' },
    { icon: IceCream, label: 'Sorveteria', color: 'from-purple-500 to-fuchsia-500' },
    { icon: Hammer, label: 'Construção', color: 'from-slate-600 to-slate-800' }
  ];

  return (
    <div className="pb-32 px-6">
      {/* Hero Section */}
      <div className="relative rounded-[2rem] overflow-hidden mb-8 mt-6" data-testid="hero-section">
        <img
          src="https://images.unsplash.com/photo-1758300468850-acaecff32c68?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Ipaporanga"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">Bem-vindo ao</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">
            Ipaporanga Hub Pro
          </h2>
          <p className="text-sm opacity-90">Tudo o que você precisa, em um só lugar</p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold font-heading mb-6">Categorias Rápidas</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4" data-testid="categories-grid">
          {categories.map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              data-testid={`category-${label.toLowerCase()}`}
              onClick={() => navigate('/stores')}
              className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all hover:scale-105 active:scale-95"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold text-center">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Stores */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-heading">Lojas em Destaque</h3>
          <button
            onClick={() => navigate('/stores')}
            data-testid="view-all-stores-button"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Ver todas
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 animate-pulse">
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4" data-testid="featured-stores-list">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
