import React, { useEffect, useState } from 'react';
import { USER_INFO } from '../constants';

const DivergenceMeter: React.FC = () => {
  const targetNumber = USER_INFO.divergenceNumber;
  const [displayNumber, setDisplayNumber] = useState("0.000000");
  
  // Simulate the numbers shuffling before settling
  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      const randomNum = (Math.random() * 2).toFixed(6);
      setDisplayNumber(randomNum);
      iterations++;
      
      if (iterations > 15) {
        clearInterval(interval);
        setDisplayNumber(targetNumber);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="flex flex-col items-center justify-center my-8 select-none">
      <div className="text-sg-orange text-xs tracking-[0.5em] mb-2 uppercase opacity-70 shadow-orange-500">
        Divergence Meter
      </div>
      <div className="relative bg-black/60 border border-gray-800 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(255,126,0,0.2)] backdrop-blur-sm">
        <div className="flex items-baseline space-x-1 sm:space-x-2">
          {displayNumber.split('').map((char, index) => (
            <span 
              key={index} 
              className={`
                font-mono text-3xl sm:text-5xl font-bold
                ${char === '.' ? 'text-gray-500' : 'text-sg-orange'}
                drop-shadow-[0_0_8px_rgba(255,126,0,0.8)]
              `}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-sg-orange opacity-50"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sg-orange opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sg-orange opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-sg-orange opacity-50"></div>
      </div>
    </div>
  );
};

export default DivergenceMeter;