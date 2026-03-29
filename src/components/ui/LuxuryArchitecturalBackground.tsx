"use client";

/**
 * Luxury Architectural Background - Simple CSS approach
 * One full-width subtle structural field
 */
export default function LuxuryArchitecturalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle black relief texture - full width */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(25, 25, 25, 0.8) 0%, 
              rgba(18, 18, 18, 0.6) 25%, 
              rgba(15, 15, 15, 0.5) 50%, 
              rgba(18, 18, 18, 0.6) 75%, 
              rgba(25, 25, 25, 0.8) 100%
            )
          `,
        }}
      />

      {/* Subtle depth variation */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, 
              rgba(35, 35, 35, 0.4) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse at 70% 60%, 
              rgba(30, 30, 30, 0.35) 0%, 
              transparent 50%
            )
          `,
        }}
      />

      {/* Very subtle noise texture for material feel */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}
