/**
 * The Heretical Game - State Manager
 * Manages game state, persistence, and state transitions
 */

import { EventEmitter } from './event-emitter.js';

/**
 * StateManager handles all game state operations including persistence
 */
export class StateManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      storageKey: options.storageKey || 'heretical-game-state',
      maxHistory: options.maxHistory || 50,
      enableCompression: options.enableCompression !== false,
      encryptionKey: options.encryptionKey || null,
      ...options
    };

    this.state = this.createInitialState();
    this.history = [];
    this.hasUnsavedChanges = false;
    this.lastSaveTime = null;
    this.saveInProgress = false;

    this.init();
  }

  /**
   * Create initial game state
   */
  createInitialState() {
    return {
      version: '1.0.0',
      phase: 'start', // start, playing, verdict, paused
      difficulty: 'normal',
      startTime: null,
      endTime: null,
      questionsAnswered: [],
      councilsOffended: [],
      currentQuestion: null,
      questionIndex: 0,
      score: 0,
      verdict: null,
      settings: {
        soundEnabled: true,
        animationsEnabled: true,
        autoSaveEnabled: true,
        difficulty: 'normal'
      },
      statistics: {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCouncilsOffended: 0,
        averageGameTime: 0,
        bestScore: 0,
        favoriteCouncil: null
      }
    };
  }

  /**
   * Initialize state manager
   */
  async init() {
    try {
      // Try to load saved state
      const savedState = await this.load();
      if (savedState && savedState.state) {
        this.state = this.validateState(savedState.state);
        this.history = savedState.history || [];
        this.lastSaveTime = savedState.timestamp || null;
      }

      this.emit('initialized', this.state);
    } catch (error) {
      console.warn('Failed to load saved state:', error);
      this.emit('initialized', this.state);
    }
  }

  /**
   * Get a state value
   * @param {string} key - State key (supports dot notation)
   * @returns {any} State value
   */
  get(key) {
    if (!key) return this.state;
    
    const keys = key.split('.');
    let current = this.state;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  /**
   * Set a state value
   * @param {string} key - State key (supports dot notation)
   * @param {any} value - Value to set
   * @param {Object} options - Options
   */
  set(key, value, options = {}) {
    const { silent = false, addToHistory = true } = options;
    
    if (!key) return;
    
    const oldValue = this.get(key);
    const newValue = value;
    
    // Update state
    const keys = key.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = newValue;
    
    // Mark as changed
    this.hasUnsavedChanges = true;
    
    // Add to history if requested
    if (addToHistory) {
      this.addToHistory(key, oldValue, newValue);
    }
    
    // Emit change event
    if (!silent) {
      this.emit('stateChanged', {
        key,
        oldValue,
        newValue,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get all state
   * @returns {Object} Complete state object
   */
  getAll() {
    return { ...this.state };
  }

  /**
   * Set all state
   * @param {Object} newState - New state object
   * @param {Object} options - Options
   */
  setAll(newState, options = {}) {
    const { silent = false } = options;
    
    const oldState = { ...this.state };
    this.state = this.validateState(newState);
    this.hasUnsavedChanges = true;
    
    if (!silent) {
      this.emit('stateChanged', {
        key: null,
        oldValue: oldState,
        newValue: this.state,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Reset state to initial values
   * @param {Object} options - Options
   */
  reset(options = {}) {
    const { keepStatistics = false, silent = false } = options;
    
    const oldStatistics = keepStatistics ? { ...this.state.statistics } : null;
    this.state = this.createInitialState();
    
    if (keepStatistics && oldStatistics) {
      this.state.statistics = oldStatistics;
    }
    
    this.hasUnsavedChanges = true;
    this.history = [];
    
    if (!silent) {
      this.emit('stateReset', this.state);
    }
  }

  /**
   * Add change to history
   */
  addToHistory(key, oldValue, newValue) {
    const entry = {
      timestamp: Date.now(),
      key,
      oldValue,
      newValue
    };
    
    this.history.push(entry);
    
    // Limit history size
    if (this.history.length > this.config.maxHistory) {
      this.history.shift();
    }
    
    this.emit('historyAdded', entry);
  }

  /**
   * Get state history
   * @returns {Array} History entries
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Check if there are unsaved changes
   * @returns {boolean}
   */
  hasChanges() {
    return this.hasUnsavedChanges;
  }

  /**
   * Save state to storage
   * @param {Object} data - Optional data to save (defaults to current state)
   */
  async save(data = null) {
    if (this.saveInProgress) {
      console.warn('Save already in progress');
      return;
    }
    
    this.saveInProgress = true;
    
    try {
      const saveData = {
        state: data?.state || this.state,
        history: data?.history || this.history,
        timestamp: Date.now(),
        version: this.state.version
      };
      
      // Compress if enabled
      let dataToSave = saveData;
      if (this.config.enableCompression) {
        dataToSave = this.compress(saveData);
      }
      
      // Encrypt if enabled
      if (this.config.encryptionKey) {
        dataToSave = this.encrypt(dataToSave);
      }
      


      // Save to localStorage (skip if not available in Node.js environment)
      if (typeof localStorage !== 'undefined') {
          const serialized = JSON.stringify(dataToSave);
        localStorage.setItem(this.config.storageKey, serialized);
      }
      
      this.lastSaveTime = Date.now();
      this.hasUnsavedChanges = false;
      
      this.emit('saved', saveData);
      
    } catch (error) {
      console.error('Failed to save state:', error);
      this.emit('saveError', error);
      throw error;
    } finally {
      this.saveInProgress = false;
    }
  }

  /**
   * Load state from storage
   */
  async load() {
    try {
      // Skip loading if localStorage is not available (Node.js environment)
      if (typeof localStorage === 'undefined') {
        return null;
      }
      
      const serialized = localStorage.getItem(this.config.storageKey);
      if (!serialized) {
        return null;
      }
      
      let dataToLoad = JSON.parse(serialized);
      
      // Decrypt if enabled
      if (this.config.encryptionKey) {
        dataToLoad = this.decrypt(dataToLoad);
      }
      
      // Decompress if enabled
      if (this.config.enableCompression && dataToLoad.compressed) {
        dataToLoad = this.decompress(dataToLoad);
      }
      
      // Validate loaded data
      const validatedState = this.validateState(dataToLoad.state);
      
      return {
        state: validatedState,
        history: dataToLoad.history || [],
        timestamp: dataToLoad.timestamp
      };
      
    } catch (error) {
      console.error('Failed to load state:', error);
      this.emit('loadError', error);
      return null;
    }
  }

  /**
   * Clear saved state
   */
  async clear() {
    try {
      // Skip clearing if localStorage is not available (Node.js environment)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.config.storageKey);
      }
      this.hasUnsavedChanges = false;
      this.lastSaveTime = null;
      this.emit('cleared');
    } catch (error) {
      console.error('Failed to clear state:', error);
      throw error;
    }
  }

  /**
   * Validate state structure
   */
  validateState(state) {
    if (!state || typeof state !== 'object') {
      return this.createInitialState();
    }
    
    const requiredKeys = ['version', 'phase', 'difficulty', 'questionsAnswered'];
    const hasAllKeys = requiredKeys.every(key => key in state);
    
    if (!hasAllKeys) {
      console.warn('Invalid state structure, using default state');
      return this.createInitialState();
    }
    
    // Validate specific fields
    const validatedState = { ...this.createInitialState(), ...state };
    
    // Ensure arrays are actually arrays
    if (!Array.isArray(validatedState.questionsAnswered)) {
      validatedState.questionsAnswered = [];
    }
    
    if (!Array.isArray(validatedState.councilsOffended)) {
      validatedState.councilsOffended = [];
    }
    
    return validatedState;
  }

  /**
   * Compress data
   */
  compress(data) {
    // Simple compression - remove unnecessary whitespace and duplicate data
    const compressed = {
      compressed: true,
      state: data.state,
      history: data.history.slice(-10), // Keep only recent history
      timestamp: data.timestamp,
      version: data.version
    };
    
    return compressed;
  }

  /**
   * Decompress data
   */
  decompress(data) {
    return {
      state: data.state,
      history: data.history || [],
      timestamp: data.timestamp,
      version: data.version
    };
  }

  /**
   * Encrypt data (simple XOR encryption for now)
   */
  encrypt(data) {
    if (!this.config.encryptionKey) return data;
    
    const key = this.config.encryptionKey;
    const serialized = JSON.stringify(data);
    let encrypted = '';
    
    for (let i = 0; i < serialized.length; i++) {
      encrypted += String.fromCharCode(
        serialized.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return {
      encrypted: true,
      data: btoa(encrypted) // Base64 encode
    };
  }

  /**
   * Decrypt data
   */
  decrypt(data) {
    if (!data.encrypted) return data;
    if (!this.config.encryptionKey) return data;
    
    const key = this.config.encryptionKey;
    const encrypted = atob(data.data); // Base64 decode
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return JSON.parse(decrypted);
  }

  /**
   * Get state statistics
   */
  getStats() {
    return {
      phase: this.state.phase,
      questionsAnswered: this.state.questionsAnswered.length,
      councilsOffended: this.state.councilsOffended.length,
      hasUnsavedChanges: this.hasUnsavedChanges,
      lastSaveTime: this.lastSaveTime,
      historySize: this.history.length,
      gameTime: this.state.startTime ? Date.now() - this.state.startTime : 0
    };
  }

  /**
   * Export state as JSON
   */
  export() {
    return JSON.stringify({
      state: this.state,
      history: this.history,
      timestamp: Date.now(),
      stats: this.getStats()
    }, null, 2);
  }

  /**
   * Import state from JSON
   */
  import(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.state) {
        this.setAll(data.state, { silent: true });
        this.history = data.history || [];
        this.hasUnsavedChanges = true;
        
        this.emit('imported', data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.hasUnsavedChanges) {
      // Attempt final save
      this.save().catch(error => {
        console.warn('Failed to save on destroy:', error);
      });
    }
    
    this.removeAllListeners();
  }
}