import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search } from 'lucide-react';
import StoreCard from '@/components/StoreCard';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn('Firestore not initialized');
      setStores([]);
      setFilteredStores([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'stores'), orderBy('rating', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storesData = [];
      snapshot.forEach((doc) => {
        storesData.push({ id: doc.id, ...doc.data() });
      });
      setStores(storesData);
      setFilteredStores(storesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);

  return (
    <div className="pb-32 px-6">
      {/* Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">Shopping Digital</h1>
        <p className="text-slate-600 dark:text-slate-400">Descubra as melhores lojas de Ipaporanga</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            data-testid="stores-search-input"
            placeholder="Buscar lojas ou categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Stores List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 animate-pulse">
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
            </div>
          ))}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-12" data-testid="no-stores-message">
          <p className="text-slate-500 dark:text-slate-400">Nenhuma loja encontrada</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="stores-list">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
