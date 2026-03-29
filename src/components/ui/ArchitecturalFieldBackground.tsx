"use client";

import dynamic from 'next/dynamic';

const ArchitecturalFieldBackground = dynamic(
  () => import('./ArchitecturalFieldBackgroundCore'),
  { 
    ssr: false,
    loading: () => (
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ background: 'rgba(10, 10, 10, 0.5)' }}
        aria-hidden="true"
      />
    )
  }
);

export default ArchitecturalFieldBackground;
