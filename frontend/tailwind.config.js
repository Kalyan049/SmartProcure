/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#166534', // Deep Green (Primary CTA, active nav, key links)
          hover: '#14532D',   // Deep Green Dark Hover
          secondary: '#22C55E', // Fresh Green (Progress, success, healthy capacity)
          tint: '#F0FDF4',    // Green 50 background tint
          mint: '#DCFCE7',    // Green 100 soft border/badge
          dark: '#14532D',
        },
        surface: {
          page: '#F8FAFC',    // Off-white neutral background
          card: '#FFFFFF',    // Pure white cards
          border: '#E2E8F0',  // Slate 200 border
          muted: '#F1F5F9',   // Slate 100 muted fills
          input: '#CBD5E1',   // Slate 300 control borders
          disabled: '#CBD5E1',// Slate 300 disabled
        },
        text: {
          primary: '#0F172A', // Slate 900 primary high contrast
          secondary: '#475569', // Slate 600 secondary
          muted: '#64748B',   // Slate 500 helper / timestamp
        },
        semantic: {
          success: '#22C55E', // Fresh Green
          warning: '#F59E0B', // Warm Amber (Warnings, queue pressure, pending)
          error: '#DC2626',   // Critical Red (Errors, critical load, cancellation)
          info: '#2563EB',    // Information Blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
        modal: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      },
      borderRadius: {
        xs: '4px',   // small controls / compact badges
        sm: '8px',   // buttons / inputs
        md: '12px',  // cards
        lg: '16px',  // major feature cards
        full: '9999px',
      },
      screens: {
        sm: '360px',
        mobile: '390px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};

