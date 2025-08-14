'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'component' | 'feature';
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * Provides different fallback UIs based on error level and context
 */
class ErrorBoundary extends Component<Props, State> {
  private errorId: string;

  constructor(props: Props) {
    super(props);
    this.errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.errorId
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details for debugging
    console.group(`🚨 Error Boundary: ${this.props.name || 'Unknown'}`);
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.groupEnd();

    // In development, also log to help with debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error ID for tracking:', this.errorId);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    const reportData = {
      errorId: this.errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      level: this.props.level,
      component: this.props.name,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('Error report data:', reportData);
    // In a real app, this would send to an error reporting service
    // Example: errorReportingService.report(reportData);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on error level
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        level={this.props.level || 'component'}
        name={this.props.name}
        onRetry={this.handleRetry}
        onReport={this.handleReportError}
        errorId={this.state.errorId}
      />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component with themed UI
 */
function ErrorFallback({ 
  error, 
  errorInfo, 
  level, 
  name, 
  onRetry, 
  onReport, 
  errorId 
}: {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  level: 'app' | 'component' | 'feature';
  name?: string;
  onRetry: () => void;
  onReport: () => void;
  errorId: string;
}) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const getErrorTitle = () => {
    switch (level) {
      case 'app':
        return 'Application Error';
      case 'feature':
        return `Feature Error${name ? `: ${name}` : ''}`;
      case 'component':
      default:
        return `Component Error${name ? `: ${name}` : ''}`;
    }
  };

  const getErrorMessage = () => {
    if (level === 'app') {
      return 'Something went wrong with the application. Please try refreshing the page.';
    }
    return 'Something went wrong with this part of the application. You can try again or continue using other features.';
  };

  const getErrorIcon = () => {
    switch (level) {
      case 'app':
        return '💥';
      case 'feature':
        return '⚠️';
      case 'component':
      default:
        return '🔧';
    }
  };

  return (
    <div className={`
      ${level === 'app' ? 'min-h-screen flex items-center justify-center' : 'p-4 rounded-lg border-2 border-dashed'}
      ${currentTheme.mainBg} ${level === 'app' ? '' : currentTheme.cardBg}
      ${theme === 'dark' ? 'border-red-500/30' : 'border-red-300/50'}
    `}>
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">{getErrorIcon()}</div>
        
        <h2 className={`text-xl font-heading font-bold mb-4 ${currentTheme.primaryText}`}>
          {getErrorTitle()}
        </h2>
        
        <p className={`${currentTheme.secondaryText} mb-6 leading-relaxed`}>
          {getErrorMessage()}
        </p>

        {/* Error details in development */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className={`cursor-pointer ${currentTheme.accent} font-medium mb-2`}>
              Show Error Details
            </summary>
            <div className={`
              p-3 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-40
              ${theme === 'dark' ? 'bg-gray-800 text-red-300' : 'bg-red-50 text-red-800'}
            `}>
              <strong>Error:</strong> {error.message}
              {error.stack && (
                <>
                  <br /><br />
                  <strong>Stack:</strong>
                  <br />
                  {error.stack}
                </>
              )}
              {errorInfo?.componentStack && (
                <>
                  <br /><br />
                  <strong>Component Stack:</strong>
                  <br />
                  {errorInfo.componentStack}
                </>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onRetry}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }
            `}
          >
            {level === 'app' ? 'Reload App' : 'Try Again'}
          </button>

          {level === 'app' && (
            <button
              onClick={() => window.location.reload()}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
                }
              `}
            >
              Refresh Page
            </button>
          )}

          <button
            onClick={onReport}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            Report Issue
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className={`mt-4 text-xs ${currentTheme.mutedText}`}>
            Error ID: {errorId}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;