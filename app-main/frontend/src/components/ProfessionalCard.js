import React from 'react';
import { MessageCircle, Briefcase } from 'lucide-react';

const ProfessionalCard = ({ professional }) => {
  const handleContact = () => {
    const message = `Olá ${professional.name}, encontrei seu contato no Ipaporanga Hub e gostaria de solicitar seus serviços de ${professional.service}.`;
    const whatsappUrl = `https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      data-testid={`professional-card-${professional.id}`}
      className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 group"
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0">
          {professional.photo ? (
            <img src={professional.photo} alt={professional.name} className="w-full h-full object-cover" />
          ) : (
            professional.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg font-heading truncate group-hover:text-emerald-600 transition-colors">
            {professional.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <Briefcase className="w-4 h-4" />
            <span>{professional.service}</span>
          </div>
          {professional.specialty && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{professional.specialty}</p>
          )}
          
          {/* Contact Button */}
          <button
            onClick={handleContact}
            data-testid={`contact-professional-${professional.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
