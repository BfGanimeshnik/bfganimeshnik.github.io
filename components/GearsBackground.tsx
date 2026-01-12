import React from 'react';
import { Settings } from 'lucide-react';

const GearsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Large Gear Left */}
      <div className="absolute -top-20 -left-20 text-gray-800/30 animate-spin-slow">
        <Settings size={300} strokeWidth={1} />
      </div>

      {/* Medium Gear Left Bottom */}
      <div className="absolute top-1/2 -left-10 text-gray-800/20 animate-spin-slow-reverse">
        <Settings size={200} strokeWidth={1.5} />
      </div>

      {/* Large Gear Right Bottom */}
      <div className="absolute -bottom-32 -right-32 text-gray-800/30 animate-spin-slow">
        <Settings size={400} strokeWidth={0.5} />
      </div>

      {/* Small Gear Top Right */}
      <div className="absolute top-10 right-10 text-gray-800/20 animate-spin-slow-reverse">
        <Settings size={120} strokeWidth={2} />
      </div>
      
      {/* Floating particles suggestion */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
    </div>
  );
};

export default GearsBackground;