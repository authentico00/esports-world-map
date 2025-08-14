export const themes = {
  dark: {
    // Backgrounds
    mainBg: 'bg-gradient-to-b from-gray-900 to-gray-950',
    mapContainer: 'bg-gradient-to-b from-gray-800 to-gray-900',
    mapContainerBorder: 'border-gray-600',
    controlPanel: 'bg-gray-800',
    controlPanelBorder: 'border-gray-600',
    buttons: 'bg-gray-700 border-gray-500 hover:bg-gray-600',
    closeButton: 'bg-gray-700 border-gray-500 hover:bg-gray-600',
    hoverModal: 'bg-white',
    
    // Text colors
    primaryText: 'text-white',
    secondaryText: 'text-white/80',
    tertiaryText: 'text-white/70',
    badgeText: 'text-white/80',
    hoverModalText: 'text-gray-900',
    hoverModalSecondary: 'text-gray-700',
    hoverModalTertiary: 'text-gray-600',
    
    // Dot patterns
    pageDots: {
      color: '%23374151',
      opacity: '0.6'
    },
    oceanDots: {
      color: '#D1D5DB',
      opacity: 0.1
    },
    
    // Special elements
    badge: 'bg-gray-800 border-gray-600',
    gradientText: 'bg-gradient-to-r from-white via-purple-200 to-emerald-200',
    emeraldAccent: 'text-emerald-400',
    
    // Interactive states
    hoverBg: 'hover:bg-gray-700',
    
    // Missing properties for error boundaries
    cardBg: 'bg-gray-800',
    mutedText: 'text-gray-500',
    accent: 'text-emerald-400',
  },
  
  light: {
    // Backgrounds - Deeper, eye-friendly tones
    mainBg: 'bg-gradient-to-br from-slate-200 via-gray-200 to-stone-200',
    mapContainer: 'bg-gradient-to-b from-slate-300/90 to-gray-300/90',
    mapContainerBorder: 'border-slate-400/80',
    controlPanel: 'bg-orange-50/95',
    controlPanelBorder: 'border-orange-50/80',
    buttons: 'bg-slate-200/95 border-slate-300 hover:bg-slate-300/95',
    closeButton: 'bg-orange-50/95 border-orange-200 hover:bg-orange-100/95',
    hoverModal: 'bg-slate-100/98',
    
    // Text colors - Rich, easy-to-read contrast
    primaryText: 'text-slate-800',
    secondaryText: 'text-slate-700',
    tertiaryText: 'text-slate-600',
    badgeText: 'text-slate-800',
    hoverModalText: 'text-slate-900',
    hoverModalSecondary: 'text-slate-800',
    hoverModalTertiary: 'text-slate-600',
    
    // Dot patterns - More visible but still gentle
    pageDots: {
      color: '%23475569',
      opacity: '0.15'
    },
    oceanDots: {
      color: '#64748B',
      opacity: 0.12
    },
    
    // Special elements - Richer accent colors
    badge: 'bg-orange-100/95 border-orange-200/80',
    gradientText: 'bg-gradient-to-r from-slate-700 via-slate-800 to-emerald-700',
    emeraldAccent: 'text-orange-600',
    
    // Interactive states
    hoverBg: 'hover:bg-slate-200/80',
    
    // Missing properties for error boundaries
    cardBg: 'bg-slate-100/95',
    mutedText: 'text-slate-600',
    accent: 'text-emerald-700',
  }
};

export type ThemeConfig = typeof themes.dark;