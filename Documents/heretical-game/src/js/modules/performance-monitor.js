/**
 * The Heretical Game - Performance Monitor
 * Performance monitoring, metrics collection, and optimization utilities
 */

import { EventEmitter } from './event-emitter.js';

/**
 * PerformanceMonitor handles performance tracking, metrics collection, and optimization
 */
export class PerformanceMonitor extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      enableMetrics: options.enableMetrics !== false,
      enableMemoryTracking: options.enableMemoryTracking !== false,
      enableFPSMonitoring: options.enableFPSMonitoring !== false,
      enableNetworkTracking: options.enableNetworkTracking !== false,
      metricsInterval: options.metricsInterval || 1000, // 1 second
      maxMetricsHistory: options.maxMetricsHistory || 1000,
      performanceThresholds: {
        fps: options.fpsThreshold || 30,
        memory: options.memoryThreshold || 100 * 1024 * 1024, // 100MB
        responseTime: options.responseTimeThreshold || 1000, // 1 second
        ...options.performanceThresholds
      },
      ...options
    };

    this.metrics = {
      fps: [],
      memory: [],
      responseTimes: [],
      networkRequests: [],
      customMetrics: new Map()
    };
    
    this.timers = new Map();
    this.activeRequests = new Map();
    this.isMonitoring = false;
    this.metricsIntervalId = null;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsIntervalId = null;

    this.init();
  }

  /**
   * Initialize performance monitor
   */
  init() {
    this.setupPerformanceObservers();
    this.startMonitoring();
    
    this.emit('initialized');
  }

  /**
   * Setup performance observers
   */
  setupPerformanceObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      // Monitor navigation timing
      if (this.config.enableNetworkTracking) {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordNetworkMetric(entry);
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
      }

      // Monitor resource loading
      if (this.config.enableNetworkTracking) {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordResourceMetric(entry);
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      }

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordLongTask(entry);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

    } catch (error) {
      console.warn('Failed to setup performance observers:', error);
    }
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Start metrics collection interval
    if (this.config.enableMetrics) {
      this.metricsIntervalId = setInterval(() => {
        this.collectMetrics();
      }, this.config.metricsInterval);
    }

    // Start FPS monitoring
    if (this.config.enableFPSMonitoring) {
      this.startFPSMonitoring();
    }

    // Monitor memory usage
    if (this.config.enableMemoryTracking && performance.memory) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;

    if (this.metricsIntervalId) {
      clearInterval(this.metricsIntervalId);
      this.metricsIntervalId = null;
    }

    if (this.fpsIntervalId) {
      cancelAnimationFrame(this.fpsIntervalId);
      this.fpsIntervalId = null;
    }
  }

  /**
   * Start FPS monitoring
   */
  startFPSMonitoring() {
    if (!this.config.enableFPSMonitoring) return;
    
    // Skip FPS monitoring in Node.js environment
    if (typeof requestAnimationFrame === 'undefined') {
      console.warn('requestAnimationFrame not available, skipping FPS monitoring');
      return;
    }

    const measureFPS = () => {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      
      if (deltaTime >= 1000) { // Every second
        const fps = Math.round((this.frameCount * 1000) / deltaTime);
        this.recordFPS(fps);
        
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      
      this.frameCount++;
      this.fpsIntervalId = requestAnimationFrame(measureFPS);
    };

    this.fpsIntervalId = requestAnimationFrame(measureFPS);
  }

  /**
   * Start memory monitoring
   */
  startMemoryMonitoring() {
    // Memory monitoring is handled in collectMetrics()
  }

  /**
   * Collect current metrics
   */
  collectMetrics() {
    const timestamp = Date.now();

    // Collect memory metrics
    if (this.config.enableMemoryTracking && performance.memory && typeof performance.memory !== 'undefined') {
      const memoryInfo = {
        timestamp,
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      
      this.recordMemoryUsage(memoryInfo);
    }

    // Check for performance issues
    this.checkPerformanceIssues();
  }

  /**
   * Record FPS measurement
   */
  recordFPS(fps) {
    const metric = {
      timestamp: Date.now(),
      value: fps
    };

    this.metrics.fps.push(metric);
    
    // Limit history size
    if (this.metrics.fps.length > this.config.maxMetricsHistory) {
      this.metrics.fps.shift();
    }

    // Check FPS threshold
    if (fps < this.config.performanceThresholds.fps) {
      this.emit('performanceWarning', {
        type: 'low_fps',
        value: fps,
        threshold: this.config.performanceThresholds.fps,
        message: `Low FPS detected: ${fps}`
      });
    }

    this.emit('fpsRecorded', metric);
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(memoryInfo) {
    this.metrics.memory.push(memoryInfo);
    
    // Limit history size
    if (this.metrics.memory.length > this.config.maxMetricsHistory) {
      this.metrics.memory.shift();
    }

    // Check memory threshold
    if (memoryInfo.used > this.config.performanceThresholds.memory) {
      this.emit('performanceWarning', {
        type: 'high_memory',
        value: memoryInfo.used,
        threshold: this.config.performanceThresholds.memory,
        message: `High memory usage: ${this.formatBytes(memoryInfo.used)}`
      });
    }

    this.emit('memoryRecorded', memoryInfo);
  }

  /**
   * Record network metric
   */
  recordNetworkMetric(entry) {
    const metric = {
      timestamp: Date.now(),
      type: entry.type,
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || 0
    };

    this.metrics.networkRequests.push(metric);
    
    // Limit history size
    if (this.metrics.networkRequests.length > this.config.maxMetricsHistory) {
      this.metrics.networkRequests.shift();
    }

    this.emit('networkMetricRecorded', metric);
  }

  /**
   * Record resource loading metric
   */
  recordResourceMetric(entry) {
    const metric = {
      timestamp: Date.now(),
      type: entry.initiatorType,
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || 0,
      status: entry.responseStatus
    };

    this.metrics.networkRequests.push(metric);
    
    if (this.metrics.networkRequests.length > this.config.maxMetricsHistory) {
      this.metrics.networkRequests.shift();
    }

    this.emit('resourceMetricRecorded', metric);
  }

  /**
   * Record long task
   */
  recordLongTask(entry) {
    this.emit('longTaskDetected', {
      duration: entry.duration,
      startTime: entry.startTime,
      attribution: entry.attribution
    });
  }

  /**
   * Start timing an operation
   */
  startTimer(name) {
    this.timers.set(name, {
      startTime: performance.now(),
      startMemory: performance.memory?.usedJSHeapSize || 0
    });
  }

  /**
   * End timing an operation
   */
  endTimer(name) {
    const timer = this.timers.get(name);
    if (!timer) {
      console.warn(`Timer '${name}' not found`);
      return null;
    }

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    const duration = endTime - timer.startTime;
    const memoryDelta = endMemory - timer.startMemory;

    const metric = {
      name,
      duration,
      memoryDelta,
      timestamp: Date.now()
    };

    this.metrics.responseTimes.push(metric);
    
    if (this.metrics.responseTimes.length > this.config.maxMetricsHistory) {
      this.metrics.responseTimes.shift();
    }

    this.timers.delete(name);

    // Check response time threshold
    if (duration > this.config.performanceThresholds.responseTime) {
      this.emit('performanceWarning', {
        type: 'slow_response',
        value: duration,
        threshold: this.config.performanceThresholds.responseTime,
        message: `Slow response time: ${duration.toFixed(2)}ms`
      });
    }

    this.emit('timerCompleted', metric);
    return metric;
  }

  /**
   * Record custom metric
   */
  recordCustomMetric(name, value, metadata = {}) {
    if (!this.metrics.customMetrics.has(name)) {
      this.metrics.customMetrics.set(name, []);
    }

    const metric = {
      timestamp: Date.now(),
      value,
      metadata
    };

    this.metrics.customMetrics.get(name).push(metric);
    
    // Limit history size
    const metrics = this.metrics.customMetrics.get(name);
    if (metrics.length > this.config.maxMetricsHistory) {
      metrics.shift();
    }

    this.emit('customMetricRecorded', { name, metric });
  }

  /**
   * Check for performance issues
   */
  checkPerformanceIssues() {
    const recentMetrics = this.getRecentMetrics(10); // Last 10 measurements
    
    if (recentMetrics.length === 0) return;

    // Check for memory leaks
    if (this.config.enableMemoryTracking) {
      const memoryTrend = this.calculateTrend(recentMetrics.map(m => m.memory?.used || 0));
      if (memoryTrend > 0.1) { // 10% increase trend
        this.emit('performanceWarning', {
          type: 'memory_leak',
          trend: memoryTrend,
          message: 'Potential memory leak detected'
        });
      }
    }

    // Check for FPS drops
    if (this.config.enableFPSMonitoring) {
      const lowFPSCount = recentMetrics.filter(m => m.fps && m.fps.value < this.config.performanceThresholds.fps).length;
      if (lowFPSCount > recentMetrics.length * 0.5) { // More than 50% of measurements
        this.emit('performanceWarning', {
          type: 'persistent_low_fps',
          count: lowFPSCount,
          message: 'Persistent low FPS detected'
        });
      }
    }
  }

  /**
   * Calculate trend in data series
   */
  calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return firstAvg === 0 ? 0 : (secondAvg - firstAvg) / firstAvg;
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(count = 10) {
    const recent = [];
    
    for (let i = 0; i < count; i++) {
      const metric = {};
      
      if (this.metrics.fps.length > i) {
        metric.fps = this.metrics.fps[this.metrics.fps.length - 1 - i];
      }
      
      if (this.metrics.memory.length > i) {
        metric.memory = this.metrics.memory[this.metrics.memory.length - 1 - i];
      }
      
      if (this.metrics.responseTimes.length > i) {
        metric.responseTime = this.metrics.responseTimes[this.metrics.responseTimes.length - 1 - i];
      }
      
      if (Object.keys(metric).length > 0) {
        recent.push(metric);
      }
    }
    
    return recent;
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const stats = {
      monitoring: this.isMonitoring,
      uptime: this.isMonitoring ? Date.now() - this.startTime : 0,
      metrics: {}
    };

    // FPS statistics
    if (this.metrics.fps.length > 0) {
      const fpsValues = this.metrics.fps.map(m => m.value);
      stats.metrics.fps = {
        average: fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length,
        minimum: Math.min(...fpsValues),
        maximum: Math.max(...fpsValues),
        count: fpsValues.length
      };
    }

    // Memory statistics
    if (this.metrics.memory.length > 0) {
      const memoryValues = this.metrics.memory.map(m => m.used);
      stats.metrics.memory = {
        average: memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length,
        minimum: Math.min(...memoryValues),
        maximum: Math.max(...memoryValues),
        current: performance.memory?.usedJSHeapSize || 0
      };
    }

    // Response time statistics
    if (this.metrics.responseTimes.length > 0) {
      const responseValues = this.metrics.responseTimes.map(m => m.duration);
      stats.metrics.responseTime = {
        average: responseValues.reduce((a, b) => a + b, 0) / responseValues.length,
        minimum: Math.min(...responseValues),
        maximum: Math.max(...responseValues),
        count: responseValues.length
      };
    }

    return stats;
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Export performance data
   */
  export() {
    return JSON.stringify({
      config: this.config,
      metrics: {
        fps: this.metrics.fps,
        memory: this.metrics.memory,
        responseTimes: this.metrics.responseTimes,
        networkRequests: this.metrics.networkRequests,
        customMetrics: Object.fromEntries(this.metrics.customMetrics)
      },
      stats: this.getStats(),
      exportedAt: Date.now()
    }, null, 2);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopMonitoring();
    this.removeAllListeners();
  }
}