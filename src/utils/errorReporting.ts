/**
 * Error reporting and tracking utilities
 * Provides centralized error handling, logging, and reporting
 */

import { ErrorInfo } from 'react';

export interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  level: 'app' | 'feature' | 'component';
  component?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  additionalContext?: Record<string, unknown>;
}

export interface ErrorReportingConfig {
  enableConsoleLogging: boolean;
  enableLocalStorage: boolean;
  enableRemoteReporting: boolean;
  maxLocalErrors: number;
  remoteEndpoint?: string;
}

export class ErrorReportingService {
  private config: ErrorReportingConfig = {
    enableConsoleLogging: true,
    enableLocalStorage: process.env.NODE_ENV === 'development',
    enableRemoteReporting: false,
    maxLocalErrors: 50
  };

  private sessionId: string = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  constructor(config?: Partial<ErrorReportingConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Reports an error from React Error Boundary
   */
  reportBoundaryError(
    error: Error, 
    errorInfo: ErrorInfo, 
    level: 'app' | 'feature' | 'component' = 'component',
    component?: string,
    additionalContext?: Record<string, unknown>
  ): string {
    const errorId = this.generateErrorId();
    
    const report: ErrorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || undefined,
      level,
      component,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      additionalContext
    };

    this.processErrorReport(report);
    return errorId;
  }

  /**
   * Reports a general JavaScript error
   */
  reportError(
    error: Error,
    level: 'app' | 'feature' | 'component' = 'component',
    component?: string,
    additionalContext?: Record<string, unknown>
  ): string {
    const errorId = this.generateErrorId();

    const report: ErrorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      level,
      component,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      additionalContext
    };

    this.processErrorReport(report);
    return errorId;
  }

  /**
   * Reports a custom error message
   */
  reportCustomError(
    message: string,
    level: 'app' | 'feature' | 'component' = 'component',
    component?: string,
    additionalContext?: Record<string, unknown>
  ): string {
    return this.reportError(new Error(message), level, component, additionalContext);
  }

  /**
   * Process and distribute error report
   */
  private processErrorReport(report: ErrorReport): void {
    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logErrorToConsole(report);
    }

    // Local storage (for development/debugging)
    if (this.config.enableLocalStorage) {
      this.saveErrorToLocalStorage(report);
    }

    // Remote reporting (for production monitoring)
    if (this.config.enableRemoteReporting) {
      this.sendErrorToRemote(report).catch((err) => {
        console.warn('Failed to send error report:', err);
      });
    }
  }

  /**
   * Log error to browser console with formatting
   */
  private logErrorToConsole(report: ErrorReport): void {
    const emoji = this.getErrorEmoji(report.level);
    console.group(`${emoji} Error Report - ${report.component || 'Unknown'}`);
    console.error('Message:', report.message);
    console.error('Level:', report.level);
    console.error('Timestamp:', report.timestamp);
    console.error('Error ID:', report.errorId);
    
    if (report.stack) {
      console.error('Stack:', report.stack);
    }
    
    if (report.componentStack) {
      console.error('Component Stack:', report.componentStack);
    }
    
    if (report.additionalContext) {
      console.error('Additional Context:', report.additionalContext);
    }
    
    console.groupEnd();
  }

  /**
   * Save error to localStorage for debugging
   */
  private saveErrorToLocalStorage(report: ErrorReport): void {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      const key = 'esports-map-errors';
      const existingErrors = JSON.parse(localStorage.getItem(key) || '[]');
      
      existingErrors.push(report);
      
      // Keep only the most recent errors
      if (existingErrors.length > this.config.maxLocalErrors) {
        existingErrors.splice(0, existingErrors.length - this.config.maxLocalErrors);
      }
      
      localStorage.setItem(key, JSON.stringify(existingErrors));
    } catch (err) {
      console.warn('Failed to save error to localStorage:', err);
    }
  }

  /**
   * Send error to remote monitoring service
   */
  private async sendErrorToRemote(report: ErrorReport): Promise<void> {
    if (!this.config.remoteEndpoint) {
      return;
    }

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.warn('Remote error reporting failed:', err);
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get emoji for error level
   */
  private getErrorEmoji(level: string): string {
    switch (level) {
      case 'app': return '💥';
      case 'feature': return '⚠️';
      case 'component': return '🔧';
      default: return '❌';
    }
  }

  /**
   * Get stored errors from localStorage
   */
  getStoredErrors(): ErrorReport[] {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        return [];
      }
      
      const key = 'esports-map-errors';
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (err) {
      console.warn('Failed to retrieve stored errors:', err);
      return [];
    }
  }

  /**
   * Clear stored errors from localStorage
   */
  clearStoredErrors(): void {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      localStorage.removeItem('esports-map-errors');
    } catch (err) {
      console.warn('Failed to clear stored errors:', err);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byLevel: Record<string, number>;
    byComponent: Record<string, number>;
    recent: number; // Last 24 hours
  } {
    const errors = this.getStoredErrors();
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);

    const stats = {
      total: errors.length,
      byLevel: {} as Record<string, number>,
      byComponent: {} as Record<string, number>,
      recent: 0
    };

    errors.forEach(error => {
      // Count by level
      stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
      
      // Count by component
      const component = error.component || 'Unknown';
      stats.byComponent[component] = (stats.byComponent[component] || 0) + 1;
      
      // Count recent errors
      if (new Date(error.timestamp).getTime() > dayAgo) {
        stats.recent++;
      }
    });

    return stats;
  }
}

// Global error reporting service instance
export const errorReporter = new ErrorReportingService({
  enableConsoleLogging: true,
  enableLocalStorage: process.env.NODE_ENV === 'development',
  enableRemoteReporting: process.env.NODE_ENV === 'production'
});

/**
 * Hook for using error reporting in React components
 */
export function useErrorReporting() {
  const reportError = (
    error: Error,
    level: 'app' | 'feature' | 'component' = 'component',
    component?: string,
    additionalContext?: Record<string, unknown>
  ) => {
    return errorReporter.reportError(error, level, component, additionalContext);
  };

  const reportCustomError = (
    message: string,
    level: 'app' | 'feature' | 'component' = 'component',
    component?: string,
    additionalContext?: Record<string, unknown>
  ) => {
    return errorReporter.reportCustomError(message, level, component, additionalContext);
  };

  return {
    reportError,
    reportCustomError,
    getStoredErrors: () => errorReporter.getStoredErrors(),
    clearStoredErrors: () => errorReporter.clearStoredErrors(),
    getErrorStats: () => errorReporter.getErrorStats()
  };
}

/**
 * Global error handler for unhandled promise rejections
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    errorReporter.reportCustomError(
      `Unhandled promise rejection: ${event.reason}`,
      'app',
      'Global Handler',
      { reason: event.reason }
    );
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    errorReporter.reportError(
      event.error || new Error(event.message),
      'app',
      'Global Handler',
      { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  });
}