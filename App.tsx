import React, { useState } from 'react';
import GearsBackground from './components/GearsBackground';
import DivergenceMeter from './components/DivergenceMeter';
import ProfileSection from './components/ProfileSection';
import Scanlines from './components/Scanlines';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [showContent, setShowContent] = useState(false);

  // Simple intro animation state
  React.useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-gray-200 font-mono overflow-hidden flex flex-col">
      {/* Visual Effects Layer */}
      <Scanlines />
      <GearsBackground />

      {/* Main Content Area */}
      <main className={`
        relative z-10 flex-grow flex flex-col items-center justify-start pt-10 pb-20
        transition-opacity duration-1000 ease-in-out
        ${showContent ? 'opacity-100' : 'opacity-0'}
      `}>
        
        {/* Header/Nav */}
        <header className="w-full max-w-4xl px-6 flex justify-between items-center mb-4 opacity-60">
          <div className="flex items-center space-x-2 text-xs text-sg-orange border border-sg-orange/30 px-3 py-1 rounded bg-black/40">
            <Terminal size={14} />
            <span>LAB_MEM_001_SYSTEM</span>
          </div>
          <div className="text-xs text-gray-500">
             {new Date().toISOString().split('T')[0]}
          </div>
        </header>

        {/* The Meter */}
        <DivergenceMeter />

        {/* Profile */}
        <ProfileSection />

      </main>
    </div>
  );
};

export default App;