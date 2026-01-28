import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Briefcase, Search } from 'lucide-react';
import ProfessionalCard from '@/components/ProfessionalCard';

const Services = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'professionals'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profData = [];
      snapshot.forEach((doc) => {
        profData.push({ id: doc.id, ...doc.data() });
      });
      setProfessionals(profData);
      setFilteredProfessionals(profData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(
        (prof) =>
          prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfessionals(filtered);
    }
  }, [searchQuery, professionals]);

  return (
    <div className="pb-32 px-6">
      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">Serviços Locais</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Profissionais de Ipaporanga</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            data-testid="services-search-input"
            placeholder="Buscar profissionais ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Professionals List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 animate-pulse">
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
            </div>
          ))}
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <div className="text-center py-12" data-testid="no-professionals-message">
          <p className="text-slate-500 dark:text-slate-400">Nenhum profissional encontrado</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="professionals-list">
          {filteredProfessionals.map((prof) => (
            <ProfessionalCard key={prof.id} professional={prof} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
