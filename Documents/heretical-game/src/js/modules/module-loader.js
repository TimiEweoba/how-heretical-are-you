/**
 * The Heretical Game - Module Loader
 * Advanced module loading system with dependency management and caching
 */

/**
 * ModuleLoader handles dynamic module loading with dependency resolution
 */
export class ModuleLoader {
  constructor(options = {}) {
    this.config = {
      basePath: options.basePath || '/src/js/',
      enableCaching: options.enableCaching !== false,
      cacheExpiry: options.cacheExpiry || 3600000, // 1 hour
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      enablePreloading: options.enablePreloading !== false,
      ...options
    };

    this.moduleCache = new Map();
    this.loadingPromises = new Map();
    this.dependencyGraph = new Map();
    this.loadedModules = new Map();
    this.preloadQueue = [];
    this.isPreloading = false;

    this.init();
  }

  /**
   * Initialize the module loader
   */
  init() {
    this.setupServiceWorker();
    this.setupPreloading();
    
    console.log('📦 ModuleLoader initialized');
  }

  /**
   * Setup service worker for advanced caching
   */
  async setupServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }

  /**
   * Setup preloading system
   */
  setupPreloading() {
    if (!this.config.enablePreloading) return;

    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.preloadModule(entry.target.dataset.module);
            this.observer.unobserve(entry.target);
          }
        });
      });
    }

    // Preload critical modules
    this.preloadCriticalModules();
  }

  /**
   * Preload critical modules
   */
  async preloadCriticalModules() {
    const criticalModules = [
      'modules/event-emitter.js',
      'modules/error-handler.js',
      'modules/performance-monitor.js',
      'templates/html-templates.js'
    ];

    for (const modulePath of criticalModules) {
      this.preloadQueue.push(modulePath);
    }

    this.processPreloadQueue();
  }

  /**
   * Process preload queue
   */
  async processPreloadQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) return;

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const modulePath = this.preloadQueue.shift();
      
      try {
        await this.loadModule(modulePath, { preload: true });
        console.log(`🔄 Preloaded: ${modulePath}`);
      } catch (error) {
        console.warn(`Failed to preload: ${modulePath}`, error);
      }

      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.isPreloading = false;
  }

  /**
   * Load a module with dependency resolution
   */
  async loadModule(modulePath, options = {}) {
    const { preload = false, dependencies = [], forceReload = false } = options;

    // Check cache first
    if (!forceReload && this.config.enableCaching) {
      const cached = this.getFromCache(modulePath);
      if (cached) {
        console.log(`📋 Cache hit: ${modulePath}`);
        return cached;
      }
    }

    // Check if already loading
    if (this.loadingPromises.has(modulePath)) {
      console.log(`⏳ Already loading: ${modulePath}`);
      return this.loadingPromises.get(modulePath);
    }

    // Create loading promise
    const loadingPromise = this.doLoadModule(modulePath, { preload, dependencies });
    this.loadingPromises.set(modulePath, loadingPromise);

    try {
      const module = await loadingPromise;
      
      // Store in cache
      if (this.config.enableCaching && !preload) {
        this.setCache(modulePath, module);
      }

      // Store as loaded
      this.loadedModules.set(modulePath, module);

      console.log(`✅ Loaded: ${modulePath}`);
      return module;

    } catch (error) {
      console.error(`❌ Failed to load: ${modulePath}`, error);
      throw error;
    } finally {
      this.loadingPromises.delete(modulePath);
    }
  }

  /**
   * Actually load the module
   */
  async doLoadModule(modulePath, options = {}) {
    const { preload = false, dependencies = [] } = options;

    // Resolve dependencies first
    if (dependencies.length > 0) {
      console.log(`🔗 Resolving dependencies for: ${modulePath}`);
      await this.resolveDependencies(dependencies);
    }

    // Build full path
    const fullPath = this.resolvePath(modulePath);

    // Attempt to load with retries
    let lastError;
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const module = await this.importModule(fullPath);
        
        // Initialize module if it has an init function
        if (module.init && typeof module.init === 'function') {
          await module.init();
        }

        return module;

      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${modulePath}:`, error);
        
        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    throw new Error(`Failed to load ${modulePath} after ${this.config.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Resolve module dependencies
   */
  async resolveDependencies(dependencies) {
    const dependencyPromises = dependencies.map(dep => {
      if (typeof dep === 'string') {
        return this.loadModule(dep);
      } else if (dep.path && dep.name) {
        return this.loadModule(dep.path).then(module => ({
          [dep.name]: module
        }));
      }
      return Promise.resolve(dep);
    });

    return Promise.all(dependencyPromises);
  }

  /**
   * Import module using dynamic import
   */
  async importModule(path) {
    // Use dynamic import
    const module = await import(path);
    
    // Handle both default and named exports
    if (module.default) {
      return module.default;
    }
    
    return module;
  }

  /**
   * Resolve module path
   */
  resolvePath(modulePath) {
    // Remove leading slash if present
    if (modulePath.startsWith('/')) {
      modulePath = modulePath.slice(1);
    }

    // Add base path if not already present
    if (!modulePath.startsWith(this.config.basePath)) {
      modulePath = this.config.basePath + modulePath;
    }

    // Add .js extension if not present
    if (!modulePath.endsWith('.js')) {
      modulePath += '.js';
    }

    return modulePath;
  }

  /**
   * Preload a module
   */
  async preloadModule(modulePath) {
    if (!this.config.enablePreloading) return;

    // Add to preload queue
    if (!this.preloadQueue.includes(modulePath)) {
      this.preloadQueue.push(modulePath);
    }

    // Process queue if not already processing
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  /**
   * Load multiple modules in parallel
   */
  async loadModules(modulePaths, options = {}) {
    const loadPromises = modulePaths.map(path => {
      if (typeof path === 'string') {
        return this.loadModule(path, options);
      } else {
        return this.loadModule(path.path, { ...options, dependencies: path.dependencies });
      }
    });

    return Promise.all(loadPromises);
  }

  /**
   * Get module from cache
   */
  getFromCache(modulePath) {
    if (!this.config.enableCaching) return null;

    const cached = this.moduleCache.get(modulePath);
    if (!cached) return null;

    // Check if cache has expired
    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheExpiry) {
      this.moduleCache.delete(modulePath);
      return null;
    }

    return cached.module;
  }

  /**
   * Set module in cache
   */
  setCache(modulePath, module) {
    if (!this.config.enableCaching) return;

    this.moduleCache.set(modulePath, {
      module,
      timestamp: Date.now()
    });
  }

  /**
   * Clear module cache
   */
  clearCache() {
    this.moduleCache.clear();
    console.log('🗑️ Module cache cleared');
  }

  /**
   * Get loaded modules
   */
  getLoadedModules() {
    return new Map(this.loadedModules);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.moduleCache.size,
      loadedModules: this.loadedModules.size,
      loadingPromises: this.loadingPromises.size,
      preloadQueue: this.preloadQueue.length,
      isPreloading: this.isPreloading
    };
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.clearCache();
    this.loadingPromises.clear();
    this.loadedModules.clear();
    this.preloadQueue = [];
    this.isPreloading = false;

    if (this.observer) {
      this.observer.disconnect();
    }

    console.log('🧹 ModuleLoader destroyed');
  }
}

/**
 * Service Worker for advanced caching
 */
const serviceWorkerCode = `
const CACHE_NAME = 'heretical-game-v1';
const urlsToCache = [
  '/',
  '/src/css/main.css',
  '/src/css/components.css',
  '/src/css/buttons.css',
  '/src/js/modules/game-engine.js',
  '/src/js/modules/state-manager.js',
  '/src/js/modules/dom-manager.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
`;

/**
 * Create and export singleton instance
 */
export const moduleLoader = new ModuleLoader({
  basePath: '/src/js/',
  enableCaching: true,
  enablePreloading: true,
  maxRetries: 3,
  retryDelay: 1000
});