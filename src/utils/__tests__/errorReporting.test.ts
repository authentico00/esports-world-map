/**
 * Unit tests for error reporting utilities
 */

import { ErrorReportingService, useErrorReporting } from '../errorReporting';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock fetch for remote reporting tests
global.fetch = jest.fn();

describe('Error Reporting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (global.fetch as jest.Mock).mockClear();
    console.group = jest.fn();
    console.groupEnd = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  describe('ErrorReportingService', () => {
    describe('Basic error reporting', () => {
      it('should report a basic error', () => {
        const service = new ErrorReportingService({
          enableConsoleLogging: true,
          enableLocalStorage: false,
          enableRemoteReporting: false
        });

        const error = new Error('Test error');
        const errorId = service.reportError(error, 'component', 'TestComponent');

        expect(errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
        expect(console.group).toHaveBeenCalledWith('🔧 Error Report - TestComponent');
        expect(console.error).toHaveBeenCalledWith('Message:', 'Test error');
      });

      it('should report boundary errors', () => {
        const service = new ErrorReportingService();
        const error = new Error('Boundary error');
        const errorInfo = {
          componentStack: 'in TestComponent\n  in App'
        };

        const errorId = service.reportBoundaryError(
          error, 
          errorInfo, 
          'feature', 
          'TestFeature'
        );

        expect(errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
      });

      it('should report custom errors', () => {
        const service = new ErrorReportingService();
        const errorId = service.reportCustomError(
          'Custom error message',
          'app',
          'CustomComponent'
        );

        expect(errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
      });
    });

    describe('Console logging', () => {
      it('should log to console when enabled', () => {
        const service = new ErrorReportingService({
          enableConsoleLogging: true
        });

        const error = new Error('Console test');
        service.reportError(error, 'component', 'TestComponent');

        expect(console.group).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Message:', 'Console test');
        expect(console.groupEnd).toHaveBeenCalled();
      });

      it('should not log to console when disabled', () => {
        const service = new ErrorReportingService({
          enableConsoleLogging: false
        });

        const error = new Error('No console test');
        service.reportError(error, 'component', 'TestComponent');

        expect(console.group).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
      });

      it('should use correct emojis for different error levels', () => {
        const service = new ErrorReportingService({
          enableConsoleLogging: true
        });

        service.reportError(new Error('App error'), 'app', 'App');
        expect(console.group).toHaveBeenCalledWith('💥 Error Report - App');

        service.reportError(new Error('Feature error'), 'feature', 'Feature');
        expect(console.group).toHaveBeenCalledWith('⚠️ Error Report - Feature');

        service.reportError(new Error('Component error'), 'component', 'Component');
        expect(console.group).toHaveBeenCalledWith('🔧 Error Report - Component');
      });
    });

    describe('Local storage', () => {
      it('should save errors to localStorage when enabled', () => {
        const service = new ErrorReportingService({
          enableLocalStorage: true
        });

        const error = new Error('Storage test');
        service.reportError(error, 'component', 'TestComponent');

        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        const calls = (mockLocalStorage.setItem as jest.Mock).mock.calls;
        const [key, value] = calls[0];
        expect(key).toBe('esports-map-errors');
        
        const storedErrors = JSON.parse(value);
        expect(storedErrors).toHaveLength(1);
        expect(storedErrors[0].message).toBe('Storage test');
      });

      it('should limit stored errors to maxLocalErrors', () => {
        const service = new ErrorReportingService({
          enableLocalStorage: true,
          maxLocalErrors: 2
        });

        // Add 3 errors
        service.reportError(new Error('Error 1'), 'component', 'Test1');
        service.reportError(new Error('Error 2'), 'component', 'Test2');
        service.reportError(new Error('Error 3'), 'component', 'Test3');

        const calls = (mockLocalStorage.setItem as jest.Mock).mock.calls;
        const lastCall = calls[calls.length - 1];
        const storedErrors = JSON.parse(lastCall[1]);
        
        expect(storedErrors).toHaveLength(2);
        expect(storedErrors[0].message).toBe('Error 2'); // Oldest should be removed
        expect(storedErrors[1].message).toBe('Error 3');
      });

      it('should retrieve stored errors', () => {
        const testErrors = [
          { message: 'Test error 1', level: 'component' },
          { message: 'Test error 2', level: 'feature' }
        ];
        
        mockLocalStorage.setItem('esports-map-errors', JSON.stringify(testErrors));
        
        const service = new ErrorReportingService();
        const storedErrors = service.getStoredErrors();
        
        expect(storedErrors).toHaveLength(2);
        expect(storedErrors[0].message).toBe('Test error 1');
        expect(storedErrors[1].message).toBe('Test error 2');
      });

      it('should clear stored errors', () => {
        mockLocalStorage.setItem('esports-map-errors', JSON.stringify([{ message: 'test' }]));
        
        const service = new ErrorReportingService();
        service.clearStoredErrors();
        
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('esports-map-errors');
      });
    });

    describe('Remote reporting', () => {
      it('should send errors to remote endpoint when enabled', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK'
        });

        const service = new ErrorReportingService({
          enableRemoteReporting: true,
          remoteEndpoint: 'https://api.example.com/errors'
        });

        const error = new Error('Remote test');
        service.reportError(error, 'component', 'TestComponent');

        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.example.com/errors',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('Remote test')
          })
        );
      });

      it('should handle remote reporting failures gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const service = new ErrorReportingService({
          enableRemoteReporting: true,
          remoteEndpoint: 'https://api.example.com/errors'
        });

        const error = new Error('Remote failure test');
        service.reportError(error, 'component', 'TestComponent');

        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(console.warn).toHaveBeenCalledWith('Remote error reporting failed:', expect.any(Error));
      });

      it('should not send to remote when endpoint not configured', async () => {
        const service = new ErrorReportingService({
          enableRemoteReporting: true
          // No remoteEndpoint
        });

        const error = new Error('No endpoint test');
        service.reportError(error, 'component', 'TestComponent');

        // Wait for potential async operation
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    describe('Error statistics', () => {
      it('should calculate error statistics correctly', () => {
        const service = new ErrorReportingService({
          enableLocalStorage: true
        });

        // Add test errors
        service.reportError(new Error('Error 1'), 'app', 'App');
        service.reportError(new Error('Error 2'), 'component', 'Comp1');
        service.reportError(new Error('Error 3'), 'component', 'Comp2');
        service.reportError(new Error('Error 4'), 'feature', 'Feature');

        const stats = service.getErrorStats();

        expect(stats.total).toBe(4);
        expect(stats.byLevel.app).toBe(1);
        expect(stats.byLevel.component).toBe(2);
        expect(stats.byLevel.feature).toBe(1);
        expect(stats.byComponent.App).toBe(1);
        expect(stats.byComponent.Comp1).toBe(1);
        expect(stats.byComponent.Comp2).toBe(1);
        expect(stats.byComponent.Feature).toBe(1);
      });

      it('should calculate recent errors correctly', () => {
        // Mock stored errors with different timestamps
        const now = Date.now();
        const dayAgo = now - (25 * 60 * 60 * 1000); // 25 hours ago
        const hourAgo = now - (1 * 60 * 60 * 1000); // 1 hour ago

        const testErrors = [
          { message: 'Old error', timestamp: new Date(dayAgo).toISOString(), level: 'component' },
          { message: 'Recent error', timestamp: new Date(hourAgo).toISOString(), level: 'component' }
        ];

        mockLocalStorage.setItem('esports-map-errors', JSON.stringify(testErrors));

        const service = new ErrorReportingService();
        const stats = service.getErrorStats();

        expect(stats.total).toBe(2);
        expect(stats.recent).toBe(1); // Only the recent error
      });
    });
  });

  describe('useErrorReporting hook', () => {
    it('should provide error reporting functions', () => {
      const { result } = renderHook(() => useErrorReporting());

      expect(typeof result.current.reportError).toBe('function');
      expect(typeof result.current.reportCustomError).toBe('function');
      expect(typeof result.current.getStoredErrors).toBe('function');
      expect(typeof result.current.clearStoredErrors).toBe('function');
      expect(typeof result.current.getErrorStats).toBe('function');
    });

    it('should report errors through hook', () => {
      const { result } = renderHook(() => useErrorReporting());

      act(() => {
        const errorId = result.current.reportError(
          new Error('Hook test'),
          'component',
          'HookComponent'
        );
        expect(errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
      });
    });

    it('should report custom errors through hook', () => {
      const { result } = renderHook(() => useErrorReporting());

      act(() => {
        const errorId = result.current.reportCustomError(
          'Custom hook error',
          'feature',
          'HookFeature'
        );
        expect(errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
      });
    });

    it('should get stored errors through hook', () => {
      mockLocalStorage.setItem('esports-map-errors', JSON.stringify([
        { message: 'Hook stored error', level: 'component' }
      ]));

      const { result } = renderHook(() => useErrorReporting());

      const storedErrors = result.current.getStoredErrors();
      expect(storedErrors).toHaveLength(1);
      expect(storedErrors[0].message).toBe('Hook stored error');
    });

    it('should clear stored errors through hook', () => {
      mockLocalStorage.setItem('esports-map-errors', JSON.stringify([
        { message: 'To be cleared', level: 'component' }
      ]));

      const { result } = renderHook(() => useErrorReporting());

      act(() => {
        result.current.clearStoredErrors();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('esports-map-errors');
    });
  });

  describe('Error report data structure', () => {
    it('should include all required fields in error reports', () => {
      const service = new ErrorReportingService({
        enableLocalStorage: true
      });

      const error = new Error('Structure test');
      service.reportError(error, 'component', 'TestComponent', { 
        testContext: 'additional data' 
      });

      const storedErrors = service.getStoredErrors();
      const report = storedErrors[0];

      expect(report).toHaveProperty('errorId');
      expect(report).toHaveProperty('message', 'Structure test');
      expect(report).toHaveProperty('level', 'component');
      expect(report).toHaveProperty('component', 'TestComponent');
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('userAgent');
      expect(report).toHaveProperty('url');
      expect(report).toHaveProperty('sessionId');
      expect(report).toHaveProperty('additionalContext');
      expect(report.additionalContext).toEqual({ testContext: 'additional data' });

      // Validate timestamp format
      expect(new Date(report.timestamp).toString()).not.toBe('Invalid Date');
      
      // Validate error ID format
      expect(report.errorId).toMatch(/^err_\d+_[a-z0-9]{9}$/);
    });

    it('should handle boundary errors with component stack', () => {
      const service = new ErrorReportingService({
        enableLocalStorage: true
      });

      const error = new Error('Boundary test');
      const errorInfo = {
        componentStack: 'in TestComponent\n  in App\n  in Router'
      };

      service.reportBoundaryError(error, errorInfo, 'feature', 'BoundaryFeature');

      const storedErrors = service.getStoredErrors();
      const report = storedErrors[0];

      expect(report.message).toBe('Boundary test');
      expect(report.componentStack).toBe('in TestComponent\n  in App\n  in Router');
      expect(report.level).toBe('feature');
      expect(report.component).toBe('BoundaryFeature');
    });
  });
});