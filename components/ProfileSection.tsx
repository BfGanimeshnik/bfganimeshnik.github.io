import React from 'react';
import { USER_INFO, SOCIAL_LINKS } from '../constants';
import { ExternalLink } from 'lucide-react';

const ProfileSection: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
      {/* Avatar Container with glowing border */}
      <div className="relative w-40 h-40 mx-auto mb-6 group cursor-pointer">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-sg-orange/30 animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full border border-sg-orange/50 shadow-[0_0_15px_rgba(255,126,0,0.3)] bg-black overflow-hidden">
           <img 
             src={USER_INFO.avatarUrl} 
             alt="Avatar" 
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
           />
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
          {USER_INFO.nickname}
        </h1>
        <p className="text-sg-orange text-lg tracking-widest uppercase">
          {USER_INFO.tagline}
        </p>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto my-4"></div>
        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
          {USER_INFO.description}
        </p>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4 md:grid-cols-1">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              relative group flex items-center justify-between p-4
              bg-gray-900/40 border border-gray-700
              hover:border-sg-orange/70 hover:shadow-[0_0_15px_rgba(255,126,0,0.15)]
              transition-all duration-300 transform hover:-translate-y-1 overflow-hidden
            `}
          >
            {/* Hover Background Fill */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white`}></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className={`p-2 rounded-lg bg-black/50 border border-gray-700 group-hover:border-sg-orange text-gray-300 group-hover:text-sg-orange transition-colors`}>
                <link.icon size={24} />
              </div>
              <span className="text-xl font-bold text-gray-200 group-hover:text-white tracking-wide">
                {link.title}
              </span>
            </div>
            
            <ExternalLink size={18} className="text-gray-600 group-hover:text-sg-orange transition-colors relative z-10" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-600 group-hover:border-sg-orange transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-600 group-hover:border-sg-orange transition-colors"></div>
          </a>
        ))}
      </div>
      
      {/* Footer / El Psy Kongroo */}
      <div className="mt-16 text-center">
        <p className="text-xs text-gray-600 mb-2">Operation Skuld Status: Active</p>
        <p className="text-2xl font-bold text-sg-orange opacity-80 tracking-widest" style={{ textShadow: '0 0 10px rgba(255, 126, 0, 0.5)' }}>
          EL PSY KONGROO
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;