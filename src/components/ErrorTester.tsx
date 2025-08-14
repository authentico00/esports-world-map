'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';
import { useErrorReporting } from '@/utils/errorReporting';

/**
 * Development-only component for testing error boundaries
 * Shows only in development mode with error testing controls
 */
export default function ErrorTester() {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { reportError, reportCustomError, getErrorStats, clearStoredErrors } = useErrorReporting();
  const [showTester, setShowTester] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byLevel: {} as Record<string, number>,
    byComponent: {} as Record<string, number>,
    recent: 0
  });

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Get error stats only on client side
  useEffect(() => {
    if (showTester) {
      try {
        const errorStats = getErrorStats();
        setStats(errorStats);
      } catch (err) {
        console.warn('Failed to get error stats:', err);
      }
    }
  }, [showTester, getErrorStats]);

  const triggerRenderError = () => {
    throw new Error('Test render error: Component intentionally crashed for testing');
  };

  const triggerAsyncError = () => {
    setTimeout(() => {
      throw new Error('Test async error: Simulated async operation failure');
    }, 100);
  };

  const triggerPromiseRejection = () => {
    Promise.reject(new Error('Test promise rejection: Simulated promise failure'));
  };

  const triggerCustomError = () => {
    reportCustomError('Test custom error: Manual error reporting', 'component', 'ErrorTester');
  };

  const triggerTryCatchError = () => {
    try {
      // Simulate some operation that fails
      const obj: any = null;
      obj.property.access(); // This will throw
    } catch (error) {
      reportError(error as Error, 'component', 'ErrorTester', { context: 'try-catch block' });
    }
  };

  if (!showTester) {
    return (
      <button
        onClick={() => setShowTester(true)}
        className={`
          fixed bottom-4 right-4 z-50 px-3 py-2 text-xs rounded-lg font-mono
          ${theme === 'dark' 
            ? 'bg-red-800 hover:bg-red-700 text-red-100 border border-red-600' 
            : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
          }
        `}
        title="Open Error Testing Panel (Development Only)"
      >
        🧪 Error Tests
      </button>
    );
  }

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 p-4 max-w-sm rounded-lg shadow-lg border
      ${theme === 'dark' 
        ? 'bg-gray-800 border-gray-600 text-gray-100' 
        : 'bg-white border-gray-300 text-gray-800'
      }
    `}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">🧪 Error Testing</h3>
        <button
          onClick={() => setShowTester(false)}
          className={`text-xs px-2 py-1 rounded ${currentTheme.buttons}`}
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div>Errors: {stats.total}</div>
          <div>Recent: {stats.recent}</div>
          <div>Levels: {Object.entries(stats.byLevel).map(([k, v]) => `${k}:${v}`).join(', ')}</div>
        </div>

        <button
          onClick={triggerRenderError}
          className="w-full px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
        >
          🔥 Trigger Render Error
        </button>

        <button
          onClick={triggerAsyncError}
          className="w-full px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
        >
          ⏰ Trigger Async Error
        </button>

        <button
          onClick={triggerPromiseRejection}
          className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs"
        >
          🚫 Trigger Promise Rejection
        </button>

        <button
          onClick={triggerCustomError}
          className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
        >
          📝 Trigger Custom Error
        </button>

        <button
          onClick={triggerTryCatchError}
          className="w-full px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
        >
          🎯 Trigger Try/Catch Error
        </button>

        <button
          onClick={clearStoredErrors}
          className={`w-full px-2 py-1 rounded text-xs ${currentTheme.buttons}`}
        >
          🧹 Clear Error Log
        </button>
      </div>
    </div>
  );
}