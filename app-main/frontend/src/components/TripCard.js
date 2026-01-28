import React from 'react';
import { Clock, DollarSign, MapPin, User } from 'lucide-react';

const TripCard = ({ trip }) => {
  return (
    <div
      data-testid={`trip-card-${trip.id}`}
      className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 group"
    >
      {/* Time - Large */}
      <div className="flex items-baseline gap-3 mb-4">
        <Clock className="w-6 h-6 text-emerald-600" />
        <span className="text-4xl font-bold font-heading text-emerald-600">{trip.time}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{trip.route}</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        <span className="text-lg font-bold text-slate-900 dark:text-white">R$ {trip.price.toFixed(2)}</span>
      </div>

      {/* Driver */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Motorista:</span>
        </div>
        <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{trip.driverName}</p>
      </div>
    </div>
  );
};

export default TripCard;
