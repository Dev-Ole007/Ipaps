import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bus, ArrowRight } from 'lucide-react';
import TripCard from '@/components/TripCard';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'trips'), orderBy('time'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = [];
      snapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });
      setTrips(tripsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="pb-32 px-6">
      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">Viagens & Topics</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Conexão com Crateús</p>
          </div>
        </div>

        {/* Route Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Rota</p>
              <p className="text-2xl font-bold font-heading">Ipaporanga</p>
            </div>
            <ArrowRight className="w-8 h-8" />
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Destino</p>
              <p className="text-2xl font-bold font-heading">Crateús</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12" data-testid="no-trips-message">
          <p className="text-slate-500 dark:text-slate-400">Nenhum horário cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="trips-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;
