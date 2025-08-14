'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';

/**
 * Specialized error boundary for search-related components
 * Provides search-specific error handling and graceful degradation
 */
export default function SearchErrorBoundary({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const handleSearchError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.group('🔍 Search Error Boundary');
    console.error('Search component error:', error);
    console.error('Error context:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    console.groupEnd();

    // Track specific search errors
    if (error.message.includes('country') || error.message.includes('search')) {
      console.warn('🌍 Country search error detected');
    }
    if (error.message.includes('dropdown') || error.message.includes('autocomplete')) {
      console.warn('📋 Dropdown UI error detected');
    }
  };

  const SearchErrorFallback = () => (
    <div className={`
      w-full p-3 rounded-lg border-2 border-dashed
      ${currentTheme.cardBg} 
      ${theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-300/50'}
    `}>
      <div className="text-center">
        <div className="text-2xl mb-2">🔍</div>
        
        <div className={`text-sm font-medium mb-2 ${currentTheme.primaryText}`}>
          Search Temporarily Unavailable
        </div>
        
        <div className={`text-xs ${currentTheme.mutedText}`}>
          You can still browse the map and use region filters
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      level="component"
      name="Search Component"
      onError={handleSearchError}
      fallback={<SearchErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}