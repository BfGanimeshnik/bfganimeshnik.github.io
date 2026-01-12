import React from 'react';

const Scanlines: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden h-full w-full">
      {/* Dark vignette - Static */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
      
      {/* Scanlines - Static pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
      
      {/* Removed the flickering white overlay that caused the strobing effect */}
    </div>
  );
};

export default Scanlines;