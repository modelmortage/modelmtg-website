/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Private Client Dark Palette
        'mm-bg': '#070A0F',           // Deep ink background
        'mm-bg2': '#0B1220',          // Navy ink secondary
        'mm-surface': 'rgba(255,255,255,0.04)',
        'mm-surface2': 'rgba(255,255,255,0.06)',
        'mm-border': 'rgba(255,255,255,0.10)',
        'mm-borderSoft': 'rgba(255,255,255,0.06)',
        'mm-text': '#E9EEF7',         // Warm off-white
        'mm-muted': 'rgba(233,238,247,0.72)',
        'mm-subtle': 'rgba(233,238,247,0.55)',
        'mm-gold': '#C9A44C',
        'mm-gold2': '#B89139',        // Darker gold for hover

        // Legacy compatibility (map to CSS vars in globals)
        'mm-ink': '#000000',
        'mm-ink-soft': '#0a0a0a',
        'mm-text-subtle': 'rgba(255, 255, 255, 0.55)',

        // User requested palette
        primary: "#C5A059",
        "background-light": "#F8F8F7",
        "background-dark": "#0A0A0A",
        "obsidian-light": "#141414",
        "obsidian-accent": "#1A1A1A",
      },
      spacing: {
        // Editorial rhythm scale
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '2rem',
        'lg': '4rem',
        'xl': '6rem',

        // Section-specific
        'hero-pt': '9rem',
        'hero-pb': '8rem',
        'major': '7rem',
        'narrow': '6rem',
        'data': '5rem',
        'final': '8rem',
      },
      borderRadius: {
        'mm': '14px',     // Premium radius
        'mmSm': '10px',
      },
      boxShadow: {
        'mm-card': '0 8px 30px rgba(0,0,0,0.45)',
        'mm-hairline': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      maxWidth: {
        'container': '1220px',  // Slightly tighter than 1280 for editorial feel
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      fontSize: {
        // Refined typography scale
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3.5rem',
      },
      lineHeight: {
        'tight': '1.2',
        'normal': '1.5',
        'relaxed': '1.7',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      backgroundImage: {
        'mm-gradient': 'linear-gradient(135deg, #070A0F 0%, #0B1220 100%)',
        'mm-noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' result=\'noise\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.025\'/%3E%3C/svg%3E")',
      },
      transitionDuration: {
        'fast': '0.2s',
        'smooth': '0.3s',
      },
    },
  },
  plugins: [],
}
