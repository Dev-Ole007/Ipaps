import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Star, Phone, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const StoreProfile = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      if (!db) {
        console.warn('Firestore not initialized');
        setLoading(false);
        return;
      }
      try {
        const storeDoc = await getDoc(doc(db, 'stores', storeId));
        if (storeDoc.exists()) {
          setStore({ id: storeDoc.id, ...storeDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchStore();
  }, [storeId]);

  useEffect(() => {
    if (!db) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'products'), where('storeId', '==', storeId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId]);

  if (!store && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500 dark:text-slate-400">Loja não encontrada</p>
      </div>
    );
  }

  const handleContact = () => {
    const message = `Olá! Vim do Ipaporanga Hub e gostaria de saber mais sobre ${store.name}.`;
    const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate('/stores')}
        data-testid="back-button"
        className="fixed top-20 left-6 z-30 h-12 w-12 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Store Banner */}
      <div className="relative h-64 bg-gradient-to-br from-emerald-500 to-teal-500" data-testid="store-banner">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-4xl font-bold font-heading mb-2">{store?.name}</h1>
          <p className="text-sm opacity-90">{store?.category}</p>
        </div>
      </div>

      {/* Store Info Card */}
      <div className="px-6 -mt-8 relative z-10 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(store?.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
              <span className="text-lg font-bold ml-1">{store?.rating?.toFixed(1)}</span>
            </div>

            {/* Contact Button */}
            <button
              onClick={handleContact}
              data-testid="contact-store-button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              Contato
            </button>
          </div>

          {store?.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{store.description}</p>
          )}

          {store?.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Phone className="w-4 h-4" />
              <span>{store.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-[2rem] p-2 shadow-sm border border-slate-100 dark:border-slate-800">
          {['products', 'about', 'photos'].map((tab) => (
            <button
              key={tab}
              data-testid={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-[1.5rem] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'products' && 'Produtos'}
              {tab === 'about' && 'Sobre'}
              {tab === 'photos' && 'Fotos'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === 'products' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 animate-pulse">
                    <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12" data-testid="no-products-message">
                <p className="text-slate-500 dark:text-slate-400">Nenhum produto cadastrado ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4" data-testid="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} store={store} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6" data-testid="about-tab">
            <h3 className="font-bold text-lg font-heading mb-3">Sobre a Loja</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {store?.description || 'Informações sobre a loja em breve.'}
            </p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 text-center" data-testid="photos-tab">
            <p className="text-slate-500 dark:text-slate-400">Galeria de fotos em breve</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreProfile;
