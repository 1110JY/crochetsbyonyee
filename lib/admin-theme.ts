/**
 * Admin Theme Configuration
 * 
 * This file extends the Tailwind configuration with admin-specific
 * design tokens and utilities for consistent styling.
 */

export const adminTheme = {
  extend: {
    colors: {
      admin: {
        // Background colors
        bg: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        
        // Text colors
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
        
        // Border colors
        border: {
          default: '#e2e8f0',
          hover: '#cbd5e1',
        },
        
        // Accent colors (Lilac theme)
        accent: {
          bg: '#f3f4f6',      // purple-100
          text: '#581c87',     // purple-900  
          active: '#8b5cf6',   // purple-500
          border: '#8b5cf6',   // purple-500
        },
        
        // Semantic status colors (for badges and indicators)
        status: {
          success: {
            bg: '#dcfce7',     // green-100
            text: '#166534',   // green-800
            border: '#bbf7d0', // green-200
            indicator: '#22c55e', // green-500
          },
          warning: {
            bg: '#fef3c7',     // yellow-100
            text: '#92400e',   // yellow-800
            border: '#fde68a', // yellow-200
            indicator: '#eab308', // yellow-500
          },
          error: {
            bg: '#fee2e2',     // red-100
            text: '#991b1b',   // red-800
            border: '#fecaca', // red-200
            indicator: '#ef4444', // red-500
          },
          info: {
            bg: '#dbeafe',     // blue-100
            text: '#1e40af',   // blue-800
            border: '#bfdbfe', // blue-200
            indicator: '#3b82f6', // blue-500
          },
        },
        
        // Interactive colors
        button: {
          primary: '#0f172a',      // slate-900
          'primary-hover': '#1e293b', // slate-800
        },
      },
    },
    
    spacing: {
      admin: {
        xs: '0.25rem',
        sm: '0.5rem', 
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
    },
    
    fontSize: {
      admin: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
    },
    
    borderRadius: {
      admin: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
    
    boxShadow: {
      admin: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
}

// Utility classes for common admin patterns
export const adminUtilities = {
  '.admin-page': {
    '@apply min-h-screen bg-slate-50': {},
  },
  
  '.admin-container': {
    '@apply p-6': {},
  },
  
  '.admin-header': {
    '@apply mb-8': {},
  },
  
  '.admin-title': {
    '@apply text-2xl font-bold text-slate-900 mb-2': {},
  },
  
  '.admin-description': {
    '@apply text-slate-600': {},
  },
  
  '.admin-card': {
    '@apply bg-white border border-slate-200 rounded-lg': {},
  },
  
  '.admin-card-secondary': {
    '@apply bg-slate-50 border border-slate-200 rounded-lg': {},
  },
  
  '.admin-button-primary': {
    '@apply bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-medium transition-colors': {},
  },
  
  '.admin-button-secondary': {
    '@apply border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-md font-medium transition-colors': {},
  },
  
  '.admin-nav-active': {
    '@apply bg-purple-100 text-purple-900 hover:bg-purple-100 hover:text-purple-900': {},
  },
  
  '.admin-nav-inactive': {
    '@apply text-slate-600 hover:text-slate-900 hover:bg-slate-50': {},
  },
  
  '.admin-badge': {
    '@apply bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm font-medium': {},
  },
  
  '.admin-badge-active': {
    '@apply bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm font-medium': {},
  },
  
  // Semantic status badges
  '.admin-badge-success': {
    '@apply bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium border border-green-200': {},
  },
  
  '.admin-badge-warning': {
    '@apply bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-medium border border-yellow-200': {},
  },
  
  '.admin-badge-error': {
    '@apply bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium border border-red-200': {},
  },
  
  '.admin-badge-info': {
    '@apply bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium border border-blue-200': {},
  },
  
  '.admin-input': {
    '@apply border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 rounded-md': {},
  },
  
  '.admin-switch-active': {
    '@apply data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-200': {},
  },
  
  '.admin-checkbox-active': {
    '@apply data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500': {},
  },
}

// Component variants for admin area
export const adminComponentVariants = {
  button: {
    adminPrimary: 'admin-button-primary',
    adminSecondary: 'admin-button-secondary',
  },
  
  badge: {
    admin: 'admin-badge',
    adminActive: 'admin-badge-active',
  },
  
  card: {
    admin: 'admin-card',
    adminSecondary: 'admin-card-secondary',
  },
}

export default {
  theme: adminTheme,
  utilities: adminUtilities,
  variants: adminComponentVariants,
}
