'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';

/**
 * Specialized error boundary for map-related components
 * Provides map-specific error handling and fallback UI
 */
export default function MapErrorBoundary({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const handleMapError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.group('🗺️ Map Error Boundary');
    console.error('Map component error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    console.groupEnd();

    // Track specific map errors
    if (error.message.includes('world-atlas') || error.message.includes('topology')) {
      console.warn('🌍 Map data loading error detected');
    }
    if (error.message.includes('svg') || error.message.includes('path')) {
      console.warn('🎨 SVG rendering error detected');
    }
    if (error.message.includes('geo') || error.message.includes('projection')) {
      console.warn('🌐 Geographic projection error detected');
    }
  };

  const MapErrorFallback = () => (
    <div className={`
      w-full h-[75vh] flex items-center justify-center rounded-3xl border
      ${currentTheme.cardBg} ${currentTheme.mapContainerBorder}
    `}>
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-8xl mb-6">🗺️</div>
        
        <h3 className={`text-xl font-heading font-bold mb-4 ${currentTheme.primaryText}`}>
          Map Loading Error
        </h3>
        
        <p className={`${currentTheme.secondaryText} mb-6 leading-relaxed`}>
          We're having trouble loading the world map. This could be due to:
        </p>

        <ul className={`text-left ${currentTheme.secondaryText} mb-6 space-y-2`}>
          <li>• Network connectivity issues</li>
          <li>• Map data source unavailable</li>
          <li>• Browser compatibility problems</li>
          <li>• Rendering engine errors</li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className={`
              block w-full px-4 py-3 rounded-lg font-medium transition-colors
              ${theme === 'dark' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }
            `}
          >
            🔄 Reload Map
          </button>

          <button
            onClick={() => {
              // Clear any cached map data
              if ('caches' in window) {
                caches.delete('map-data').catch(() => {});
              }
              window.location.reload();
            }}
            className={`
              block w-full px-4 py-3 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
              }
            `}
          >
            🧹 Clear Cache & Reload
          </button>
        </div>

        <div className={`mt-6 text-sm ${currentTheme.mutedText}`}>
          The rest of the application should continue working normally.
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      level="feature"
      name="Map Component"
      onError={handleMapError}
      fallback={<MapErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}