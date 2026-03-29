"use client";

import dynamic from 'next/dynamic';

const ProcessArchitecturalBackground = dynamic(
  () => import('./ProcessArchitecturalBackground'),
  { 
    ssr: false
  }
);

export default ProcessArchitecturalBackground;
