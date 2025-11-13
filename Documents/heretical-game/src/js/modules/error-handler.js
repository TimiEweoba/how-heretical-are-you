/**
 * The Heretical Game - Error Handler
 * Comprehensive error handling and logging system
 */

import { EventEmitter } from './event-emitter.js';

/**
 * ErrorHandler manages all error handling, logging, and user-friendly error messages
 */
export class ErrorHandler extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      enableGlobalHandlers: options.enableGlobalHandlers !== false,
      enableConsoleLogging: options.enableConsoleLogging !== false,
      enableUserNotifications: options.enableUserNotifications !== false,
      maxErrors: options.maxErrors || 100,
      errorExpirationTime: options.errorExpirationTime || 3600000, // 1 hour
      onError: options.onError || null,
      ...options
    };

    this.errors = [];
    this.errorCounts = new Map();
    this.isHandlingError = false;
    this.globalHandlersInstalled = false;

    this.init();
  }

  /**
   * Initialize error handler
   */
  init() {
    if (this.config.enableGlobalHandlers) {
      this.installGlobalHandlers();
    }

    this.emit('initialized');
  }

  /**
   * Install global error handlers
   */
  installGlobalHandlers() {
    if (this.globalHandlersInstalled) return;

    // Only install browser-specific handlers if window is available
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.handleGlobalError(event);
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.handleUnhandledRejection(event);
      });
    }

    // Console error override
    if (this.config.enableConsoleLogging) {
      this.overrideConsoleError();
    }

    this.globalHandlersInstalled = true;
  }

  /**
   * Handle global JavaScript errors
   */
  handleGlobalError(event) {
    const error = {
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: Date.now(),
      stack: event.error?.stack || null
    };

    this.handleError(error);
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event) {
    const error = {
      type: 'promise',
      message: event.reason?.message || 'Unhandled promise rejection',
      reason: event.reason,
      timestamp: Date.now(),
      stack: event.reason?.stack || null
    };

    this.handleError(error);
  }

  /**
   * Override console.error to capture errors
   */
  overrideConsoleError() {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      const error = {
        type: 'console',
        message: args.join(' '),
        timestamp: Date.now()
      };

      this.handleError(error);
    };
  }

  /**
   * Handle an error (main entry point)
   */
  handleError(error, context = {}) {
    if (this.isHandlingError) {
      // Prevent recursive error handling
      return;
    }

    this.isHandlingError = true;

    try {
      // Normalize error format
      const normalizedError = this.normalizeError(error, context);
      
      // Add to error log
      this.addError(normalizedError);
      
      // Log to console
      if (this.config.enableConsoleLogging) {
        this.logError(normalizedError);
      }
      
      // Call custom error handler
      if (this.config.onError) {
        this.config.onError(normalizedError);
      }
      
      // Show user notification
      if (this.config.enableUserNotifications && this.shouldNotifyUser(normalizedError)) {
        this.notifyUser(normalizedError);
      }
      
      // Emit error event
      this.emit('error', normalizedError);

    } catch (handlerError) {
      // Last resort - log the handler error
      console.error('Error in error handler:', handlerError);
    } finally {
      this.isHandlingError = false;
    }
  }

  /**
   * Normalize error to consistent format
   */
  normalizeError(error, context) {
    if (typeof error === 'string') {
      error = { message: error };
    }

    return {
      id: this.generateErrorId(),
      type: error.type || 'unknown',
      message: error.message || 'Unknown error',
      details: error.details || null,
      stack: error.stack || null,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : 'node.js',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node.js',
        timestamp: Date.now(),
        ...context
      },
      severity: this.determineSeverity(error),
      count: this.incrementErrorCount(error.message)
    };
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determine error severity
   */
  determineSeverity(error) {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('fatal') || message.includes('crash')) {
      return 'fatal';
    } else if (message.includes('network') || message.includes('connection')) {
      return 'error';
    } else if (message.includes('warning') || message.includes('deprecated')) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  /**
   * Increment error count for duplicate detection
   */
  incrementErrorCount(message) {
    const key = message || 'unknown';
    const count = (this.errorCounts.get(key) || 0) + 1;
    this.errorCounts.set(key, count);
    return count;
  }

  /**
   * Add error to error log
   */
  addError(error) {
    this.errors.push(error);
    
    // Limit error history
    if (this.errors.length > this.config.maxErrors) {
      this.errors.shift();
    }
    
    // Clean up old errors
    this.cleanupOldErrors();
    
    this.emit('errorAdded', error);
  }

  /**
   * Clean up old errors
   */
  cleanupOldErrors() {
    const cutoffTime = Date.now() - this.config.errorExpirationTime;
    this.errors = this.errors.filter(error => error.context.timestamp > cutoffTime);
  }

  /**
   * Log error to console
   */
  logError(error) {
    const logMessage = `[ErrorHandler] ${error.severity.toUpperCase()}: ${error.message}`;
    
    switch (error.severity) {
      case 'fatal':
        console.error(logMessage, error);
        break;
      case 'error':
        console.error(logMessage, error);
        break;
      case 'warning':
        console.warn(logMessage, error);
        break;
      default:
        console.log(logMessage, error);
    }
  }

  /**
   * Determine if user should be notified
   */
  shouldNotifyUser(error) {
    // Don't notify for info level errors
    if (error.severity === 'info') {
      return false;
    }
    
    // Don't notify for duplicate errors (count > 1)
    if (error.count > 1) {
      return false;
    }
    
    // Don't notify for errors in rapid succession
    const recentErrors = this.errors.filter(e => 
      e.context.timestamp > Date.now() - 5000 && // Last 5 seconds
      e.severity !== 'info'
    );
    
    return recentErrors.length <= 1;
  }

  /**
   * Show user-friendly error notification
   */
  notifyUser(error) {
    // Create error notification element
    const notification = document.createElement('div');
    notification.className = `error-notification error-${error.severity}`;
    notification.innerHTML = `
      <div class="error-icon">${this.getErrorIcon(error.severity)}</div>
      <div class="error-content">
        <div class="error-title">${this.getErrorTitle(error.severity)}</div>
        <div class="error-message">${this.getUserFriendlyMessage(error)}</div>
      </div>
      <button class="error-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after delay
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);
    
    this.emit('userNotified', error);
  }

  /**
   * Get error icon
   */
  getErrorIcon(severity) {
    switch (severity) {
      case 'fatal':
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  }

  /**
   * Get error title
   */
  getErrorTitle(severity) {
    switch (severity) {
      case 'fatal':
        return 'Critical Error';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error) {
    if (error.type === 'network') {
      return 'Network connection issue. Please check your internet connection.';
    } else if (error.type === 'promise') {
      return 'A processing error occurred. Please try again.';
    } else if (error.severity === 'fatal') {
      return 'A critical error occurred. Please refresh the page and try again.';
    } else {
      return 'An error occurred. Please try again or refresh the page.';
    }
  }

  /**
   * Get error statistics
   */
  getStats() {
    const now = Date.now();
    const lastHour = now - 3600000;
    const lastDay = now - 86400000;
    
    const recentErrors = this.errors.filter(e => e.context.timestamp > lastHour);
    const dailyErrors = this.errors.filter(e => e.context.timestamp > lastDay);
    
    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      dailyErrors: dailyErrors.length,
      errorCounts: Object.fromEntries(this.errorCounts),
      severityBreakdown: {
        fatal: this.errors.filter(e => e.severity === 'fatal').length,
        error: this.errors.filter(e => e.severity === 'error').length,
        warning: this.errors.filter(e => e.severity === 'warning').length,
        info: this.errors.filter(e => e.severity === 'info').length
      }
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit).reverse();
  }

  /**
   * Clear error log
   */
  clear() {
    this.errors = [];
    this.errorCounts.clear();
    this.emit('cleared');
  }

  /**
   * Export error log
   */
  export() {
    return JSON.stringify({
      errors: this.errors,
      stats: this.getStats(),
      exportedAt: Date.now()
    }, null, 2);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.removeAllListeners();
    this.clear();
  }

  /**
   * Create error boundary for async operations
   */
  createErrorBoundary(operation, fallback = null) {
    return async (...args) => {
      try {
        return await operation(...args);
      } catch (error) {
        this.handleError(error, { context: 'errorBoundary', operation: operation.name });
        
        if (fallback) {
          try {
            return await fallback(error, ...args);
          } catch (fallbackError) {
            this.handleError(fallbackError, { context: 'fallback', originalError: error.message });
            throw fallbackError;
          }
        }
        
        throw error;
      }
    };
  }

  /**
   * Retry failed operation with exponential backoff
   */
  async retryOperation(operation, options = {}) {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
      onRetry = null,
      shouldRetry = null
    } = options;

    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Check if we should retry this specific error
        if (shouldRetry && !shouldRetry(error, attempt)) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );
        
        this.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`, 'warning');
        
        // Call retry callback if provided
        if (onRetry) {
          await onRetry(error, attempt + 1, delay);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Validate data with error recovery
   */
  validateData(data, schema, options = {}) {
    const {
      fallbackValue = null,
      sanitize = true,
      strict = false
    } = options;

    try {
      // Simple validation - in real implementation, use a proper schema validator
      if (schema && typeof schema === 'object') {
        for (const [key, type] of Object.entries(schema)) {
          if (strict && !(key in data)) {
            throw new Error(`Missing required field: ${key}`);
          }
          
          if (key in data && typeof data[key] !== type) {
            if (sanitize) {
              // Attempt to sanitize/convert the value
              data[key] = this.sanitizeValue(data[key], type);
            } else {
              throw new Error(`Invalid type for field ${key}: expected ${type}, got ${typeof data[key]}`);
            }
          }
        }
      }
      
      return data;
    } catch (error) {
      this.handleError(error, { context: 'validation', data: JSON.stringify(data).slice(0, 200) });
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw error;
    }
  }

  /**
   * Sanitize value to expected type
   */
  sanitizeValue(value, expectedType) {
    try {
      switch (expectedType) {
        case 'string':
          return String(value);
        case 'number':
          const num = Number(value);
          if (isNaN(num)) {
            throw new Error(`Cannot convert ${value} to number`);
          }
          return num;
        case 'boolean':
          return Boolean(value);
        case 'object':
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return {};
            }
          }
          return typeof value === 'object' ? value : {};
        default:
          return value;
      }
    } catch (error) {
      this.handleError(error, { context: 'sanitization', value, expectedType });
      throw error;
    }
  }

  /**
   * Monitor memory usage and detect potential leaks
   */
  startMemoryMonitoring(options = {}) {
    const {
      interval = 30000, // 30 seconds
      threshold = 100 * 1024 * 1024, // 100MB
      onLeakDetected = null
    } = options;

    if (!window.performance || !window.performance.memory) {
      this.log('Memory monitoring not supported in this environment', 'warning');
      return null;
    }

    let lastMemoryUsage = window.performance.memory.usedJSHeapSize;
    let consecutiveIncreases = 0;
    
    const monitor = setInterval(() => {
      try {
        const currentMemory = window.performance.memory.usedJSHeapSize;
        const memoryIncrease = currentMemory - lastMemoryUsage;
        
        if (memoryIncrease > 0) {
          consecutiveIncreases++;
          
          if (consecutiveIncreases >= 3 && memoryIncrease > threshold) {
            const leakError = {
              type: 'memory_leak',
              message: `Potential memory leak detected: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB increase over ${consecutiveIncreases} intervals`,
              details: {
                lastMemoryUsage,
                currentMemory,
                memoryIncrease,
                consecutiveIncreases,
                memoryInfo: window.performance.memory
              },
              severity: 'warning'
            };
            
            this.handleError(leakError);
            
            if (onLeakDetected) {
              onLeakDetected(leakError);
            }
            
            consecutiveIncreases = 0;
          }
        } else {
          consecutiveIncreases = 0;
        }
        
        lastMemoryUsage = currentMemory;
        
      } catch (error) {
        this.handleError(error, { context: 'memoryMonitoring' });
      }
    }, interval);
    
    return {
      stop: () => clearInterval(monitor),
      getStats: () => ({
        lastMemoryUsage,
        consecutiveIncreases,
        memoryInfo: window.performance.memory
      })
    };
  }

  /**
   * Enhanced logging with context
   */
  log(message, level = 'info', context = {}) {
    if (!this.config.enableConsoleLogging) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      errorCount: this.errors.length
    };
    
    const logMessage = `[ErrorHandler ${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, context);
        break;
      case 'warning':
        console.warn(logMessage, context);
        break;
      default:
        console.log(logMessage, context);
    }
    
    // Store log entries for debugging
    if (!this.logEntries) {
      this.logEntries = [];
    }
    this.logEntries.push(logEntry);
    
    // Limit log entries
    if (this.logEntries.length > 1000) {
      this.logEntries = this.logEntries.slice(-500);
    }
  }

  /**
   * Get log entries for debugging
   */
  getLogEntries(level = null, limit = 100) {
    if (!this.logEntries) return [];
    
    let entries = this.logEntries;
    if (level) {
      entries = entries.filter(entry => entry.level === level);
    }
    
    return entries.slice(-limit);
  }
}