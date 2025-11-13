/**
 * The Heretical Game - Event Emitter
 * Simple event system for module communication
 */

/**
 * EventEmitter class for pub/sub pattern
 */
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to an event (one-time only)
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (...args) => {
      unsubscribe();
      callback(...args);
    });
    
    return unsubscribe;
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {...any} args - Arguments to pass to handlers
   */
  emit(event, ...args) {
    const callbacks = this.events.get(event);
    if (callbacks && callbacks.length > 0) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get all listeners for an event
   * @param {string} event - Event name
   * @returns {Array} Array of callback functions
   */
  listeners(event) {
    return this.events.get(event) || [];
  }

  /**
   * Check if there are listeners for an event
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListeners(event) {
    const callbacks = this.events.get(event);
    return callbacks && callbacks.length > 0;
  }

  /**
   * Get all registered events
   * @returns {Array} Array of event names
   */
  eventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    const callbacks = this.events.get(event);
    return callbacks ? callbacks.length : 0;
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.events.clear();
  }
}

/**
 * Global event bus for cross-module communication
 */
export class EventBus extends EventEmitter {
  constructor() {
    super();
    this.maxListeners = 100;
    this.warnings = new Set();
  }

  /**
   * Add event listener with warning for too many listeners
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  on(event, callback) {
    const listenerCount = this.listenerCount(event);
    
    if (listenerCount >= this.maxListeners && !this.warnings.has(event)) {
      console.warn(`Warning: Possible memory leak detected. ${listenerCount} listeners added to event '${event}'.`);
      this.warnings.add(event);
    }
    
    return super.on(event, callback);
  }

  /**
   * Set maximum listeners warning threshold
   * @param {number} max - Maximum listeners before warning
   */
  setMaxListeners(max) {
    this.maxListeners = max;
  }

  /**
   * Get event statistics
   * @returns {Object} Event statistics
   */
  getStats() {
    const stats = {};
    
    this.eventNames().forEach(event => {
      stats[event] = {
        listenerCount: this.listenerCount(event),
        hasListeners: this.hasListeners(event)
      };
    });
    
    return stats;
  }
}

// Export singleton event bus
export const eventBus = new EventBus();