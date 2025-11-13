/**
 * The Heretical Game - Council Manager
 * Manages council data, reactions, and notifications
 */

import { EventEmitter } from './event-emitter.js';

/**
 * CouncilManager handles all council-related operations
 */
export class CouncilManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      dataPath: options.dataPath || '/src/data/councils.json',
      enableNotifications: options.enableNotifications !== false,
      maxConcurrentNotifications: options.maxConcurrentNotifications || 3,
      notificationDuration: options.notificationDuration || 5000,
      ...options
    };

    this.councils = new Map();
    this.offendedCouncils = new Set();
    this.activeNotifications = [];
    this.councilReactions = new Map();
    this.isLoading = false;

    this.init();
  }

  /**
   * Initialize council manager
   */
  async init() {
    try {
      // Load councils if data path is provided
      if (this.config.dataPath) {
        await this.loadCouncils();
      } else {
        // Use built-in councils
        this.loadBuiltInCouncils();
      }
      
      this.emit('initialized', { councilCount: this.councils.size });
    } catch (error) {
      console.warn('Failed to initialize councils:', error);
      // Fallback to built-in councils
      this.loadBuiltInCouncils();
      this.emit('initialized', { councilCount: this.councils.size, fallback: true });
    }
  }

  /**
   * Load councils from external data source
   */
  async loadCouncils() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      const response = await fetch(this.config.dataPath);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.councils)) {
        throw new Error('Invalid councils data format');
      }
      
      this.processCouncils(data.councils);
      this.emit('councilsLoaded', { count: this.councils.size });
      
    } catch (error) {
      console.warn('Failed to load councils from external source:', error);
      this.loadBuiltInCouncils();
      this.emit('councilsLoaded', { count: this.councils.size, fallback: true });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load built-in councils (fallback)
   */
  loadBuiltInCouncils() {
    const builtInCouncils = [
      {
        id: 'catholic-church',
        name: 'Catholic Church',
        icon: '⛪',
        description: 'The powerful Roman Catholic Church, guardian of doctrine and tradition.',
        offendedMessage: 'The Church is deeply offended by your heretical views!',
        severity: 'severe',
        tolerance: 2, // How many negative reactions before being offended
        interests: ['doctrine', 'tradition', 'authority', 'scripture'],
        color: '#8B4513'
      },
      {
        id: 'protestant-reformation',
        name: 'Protestant Reformation',
        icon: '✝️',
        description: 'Reforming voices calling for church reform and scripture access.',
        offendedMessage: 'The Reformers are offended by your resistance to change!',
        severity: 'high',
        tolerance: 3,
        interests: ['reform', 'scripture', 'individual-faith', 'criticism'],
        color: '#A0522D'
      },
      {
        id: 'scientific-community',
        name: 'Scientific Community',
        icon: '🔬',
        description: 'Natural philosophers and early scientists seeking truth through observation.',
        offendedMessage: 'The Scientific Community is offended by your rejection of evidence!',
        severity: 'medium',
        tolerance: 1,
        interests: ['observation', 'evidence', 'natural-law', 'experiment'],
        color: '#4682B4'
      },
      {
        id: 'political-authority',
        name: 'Political Authority',
        icon: '👑',
        description: 'Monarchs and nobles defending the divine right of kings.',
        offendedMessage: 'The Political Authority is offended by your challenge to divine right!',
        severity: 'high',
        tolerance: 2,
        interests: ['authority', 'divine-right', 'order', 'hierarchy'],
        color: '#FFD700'
      },
      {
        id: 'academic-institution',
        name: 'Academic Institution',
        icon: '🎓',
        description: 'Universities and scholars preserving and expanding knowledge.',
        offendedMessage: 'The Academic Institution is offended by your anti-intellectualism!',
        severity: 'medium',
        tolerance: 3,
        interests: ['knowledge', 'reason', 'debate', 'scholarship'],
        color: '#8B4513'
      },
      {
        id: 'religious-order',
        name: 'Religious Order',
        icon: '🕊️',
        description: 'Monastic orders dedicated to spiritual contemplation and service.',
        offendedMessage: 'The Religious Orders are offended by your worldly focus!',
        severity: 'low',
        tolerance: 4,
        interests: ['spirituality', 'contemplation', 'service', 'devotion'],
        color: '#9370DB'
      },
      {
        id: 'philosophical-school',
        name: 'Philosophical School',
        icon: '🤔',
        description: 'Thinkers and philosophers questioning fundamental assumptions.',
        offendedMessage: 'The Philosophical School is offended by your dogmatic thinking!',
        severity: 'low',
        tolerance: 5,
        interests: ['reason', 'questioning', 'logic', 'wisdom'],
        color: '#20B2AA'
      }
    ];
    
    this.processCouncils(builtInCouncils);
  }

  /**
   * Process and validate councils
   */
  processCouncils(councilsData) {
    if (!Array.isArray(councilsData)) {
      throw new Error('Councils must be an array');
    }
    
    this.councils.clear();
    
    councilsData.forEach(council => {
      if (this.validateCouncil(council)) {
        this.councils.set(council.id, {
          ...council,
          offendedCount: 0,
          lastReaction: null,
          reactionHistory: []
        });
      }
    });
    
    console.log(`Loaded ${this.councils.size} councils`);
  }

  /**
   * Validate council data
   */
  validateCouncil(council) {
    const required = ['id', 'name', 'icon', 'description'];
    const hasAllRequired = required.every(field => council[field]);
    
    if (!hasAllRequired) {
      console.warn('Council missing required fields:', council);
      return false;
    }
    
    return true;
  }

  /**
   * Process answer and determine council reactions
   */
  processAnswer(question, answer) {
    const reactions = {};
    const newlyOffended = [];
    
    if (!question.councils) {
      return [];
    }
    
    Object.entries(question.councils).forEach(([councilId, reactionMap]) => {
      const council = this.councils.get(councilId);
      if (!council) return;
      
      let score = 0;
      
      if (question.type === 'binary') {
        const isAgree = answer === true || answer === 'agree';
        score = isAgree ? (reactionMap.agree || 0) : (reactionMap.disagree || 0);
      } else if (question.type === 'multiple' && Array.isArray(question.options)) {
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption && reactionMap[answer] !== undefined) {
          score = reactionMap[answer];
        }
      }
      
      // Process reaction
      const reaction = this.processCouncilReaction(council, score);
      reactions[councilId] = reaction;
      
      // Check if council was newly offended
      if (reaction.offended && !this.offendedCouncils.has(councilId)) {
        this.offendedCouncils.add(councilId);
        newlyOffended.push(council);
        this.emit('councilOffended', council);
      }
      
      // Store reaction history
      council.reactionHistory.push({
        question: question.id,
        answer,
        score,
        timestamp: Date.now()
      });
    });
    
    this.councilReactions.set(question.id, reactions);
    
    return newlyOffended;
  }

  /**
   * Process individual council reaction
   */
  processCouncilReaction(council, score) {
    const wasOffended = this.offendedCouncils.has(council.id);
    
    if (score < 0) {
      council.offendedCount++;
    } else if (score > 0 && council.offendedCount > 0) {
      council.offendedCount = Math.max(0, council.offendedCount - 1);
    }
    
    const nowOffended = council.offendedCount >= council.tolerance;
    const newlyOffended = nowOffended && !wasOffended;
    
    council.lastReaction = {
      score,
      offended: nowOffended,
      timestamp: Date.now()
    };
    
    return {
      score,
      offended: nowOffended,
      newlyOffended,
      severity: this.calculateSeverity(score, council)
    };
  }

  /**
   * Calculate severity level
   */
  calculateSeverity(score, council) {
    const baseSeverity = Math.abs(score);
    const toleranceFactor = Math.max(0, council.offendedCount - council.tolerance + 1);
    
    const totalSeverity = baseSeverity + toleranceFactor;
    
    if (totalSeverity >= 5) return 'severe';
    if (totalSeverity >= 3) return 'high';
    if (totalSeverity >= 1) return 'medium';
    return 'low';
  }

  /**
   * Get offended councils
   */
  getOffendedCouncils() {
    return Array.from(this.offendedCouncils).map(id => this.councils.get(id));
  }

  /**
   * Get active councils (not offended)
   */
  getActiveCouncils() {
    return Array.from(this.councils.values()).filter(council => 
      !this.offendedCouncils.has(council.id)
    );
  }

  /**
   * Get all councils
   */
  getAllCouncils() {
    return Array.from(this.councils.values());
  }

  /**
   * Get council by ID
   */
  getCouncil(id) {
    return this.councils.get(id);
  }

  /**
   * Get current standing with councils
   */
  getCurrentStanding() {
    const total = this.councils.size;
    const offended = this.offendedCouncils.size;
    const active = total - offended;
    
    if (offended === 0) return 'Excellent';
    if (offended <= 1) return 'Good';
    if (offended <= 2) return 'Fair';
    if (offended <= 3) return 'Poor';
    return 'Critical';
  }

  /**
   * Show council notification
   */
  showCouncilNotification(council, severity) {
    if (!this.config.enableNotifications) return;
    
    // Check if we have too many active notifications
    if (this.activeNotifications.length >= this.config.maxConcurrentNotifications) {
      return;
    }
    
    const notification = {
      council,
      severity,
      timestamp: Date.now(),
      id: `notification-${council.id}-${Date.now()}`
    };
    
    this.activeNotifications.push(notification);
    
    // Remove notification after duration
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, this.config.notificationDuration);
    
    this.emit('notificationShown', notification);
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId) {
    const index = this.activeNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notification = this.activeNotifications.splice(index, 1)[0];
      this.emit('notificationRemoved', notification);
    }
  }

  /**
   * Get council statistics
   */
  getCouncilStats() {
    const stats = {
      total: this.councils.size,
      offended: this.offendedCouncils.size,
      active: this.councils.size - this.offendedCouncils.size,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        severe: 0
      }
    };
    
    this.offendedCouncils.forEach(id => {
      const council = this.councils.get(id);
      if (council && council.lastReaction) {
        stats.bySeverity[council.lastReaction.severity]++;
      }
    });
    
    return stats;
  }

  /**
   * Reset council states
   */
  reset() {
    this.offendedCouncils.clear();
    this.activeNotifications = [];
    this.councilReactions.clear();
    
    this.councils.forEach(council => {
      council.offendedCount = 0;
      council.lastReaction = null;
      council.reactionHistory = [];
    });
    
    this.emit('reset');
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.activeNotifications = [];
    this.councils.clear();
    this.offendedCouncils.clear();
    this.councilReactions.clear();
    this.removeAllListeners();
  }
}