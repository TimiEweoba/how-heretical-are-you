/**
 * The Heretical Game - Core Game Engine
 * Central module that coordinates all game functionality
 */

import { EventEmitter } from './event-emitter.js';
import { StateManager } from './state-manager.js';
import { DOMManager } from './dom-manager.js';
import { QuestionManager } from './question-manager.js';
import { CouncilManager } from './council-manager.js';
import { VerdictCalculator } from './verdict-calculator.js';
import { ErrorHandler } from './error-handler.js';
import { PerformanceMonitor } from './performance-monitor.js';

/**
 * Main game engine class that orchestrates all game functionality
 */
export class GameEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // Configuration
    this.config = {
      debug: options.debug || false,
      enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
      enableErrorHandling: options.enableErrorHandling !== false,
      autoSaveInterval: options.autoSaveInterval || 30000, // 30 seconds
      maxQuestionHistory: options.maxQuestionHistory || 50,
      ...options
    };

    // Core managers
    this.state = null;
    this.dom = null;
    this.questions = null;
    this.councils = null;
    this.verdict = null;
    this.errorHandler = null;
    this.performance = null;

    // Game state
    this.isInitialized = false;
    this.isGameActive = false;
    this.currentPhase = 'start';
    this.startTime = null;
    this.autoSaveTimer = null;

    // Performance tracking
    this.metrics = {
      questionsAnswered: 0,
      councilsOffended: 0,
      totalTime: 0,
      averageResponseTime: 0,
      errorsEncountered: 0
    };

    this.init();
  }

  /**
   * Initialize the game engine and all subsystems
   */
  async init() {
    try {
      this.log('Initializing game engine...');
      
      // Initialize error handling first
      if (this.config.enableErrorHandling) {
        this.errorHandler = new ErrorHandler({
          onError: this.handleError.bind(this),
          enableGlobalHandlers: true
        });
      }

      // Initialize performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        this.performance = new PerformanceMonitor();
      }

      // Initialize core managers
      this.state = new StateManager({
        storageKey: 'heretical-game-state',
        maxHistory: this.config.maxQuestionHistory
      });

      this.dom = new DOMManager({
        containerId: 'gameContainer',
        enableAnimations: true,
        enableMobileOptimizations: true
      });

      this.questions = new QuestionManager({
        dataPath: '/src/data/questions.json',
        enableCaching: true,
        cacheExpiry: 3600000 // 1 hour
      });

      this.councils = new CouncilManager({
        dataPath: '/src/data/councils.json',
        enableNotifications: true,
        maxConcurrentNotifications: 3
      });

      this.verdict = new VerdictCalculator({
        thresholds: {
          faithful: { min: -2, max: 2 },
          borderline: { min: -5, max: 5 },
          doomed: { min: -Infinity, max: -5 }
        }
      });

      // Wait for async initializations
      await Promise.all([
        this.questions.loadQuestions(),
        this.councils.loadCouncils()
      ]);

      // Setup event listeners
      this.setupEventListeners();

      // Setup auto-save
      this.setupAutoSave();

      this.isInitialized = true;
      this.emit('initialized');
      this.log('Game engine initialized successfully');

    } catch (error) {
      this.handleError('Failed to initialize game engine', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for game events
   */
  setupEventListeners() {
    // Game state events
    this.state.on('stateChanged', (newState) => {
      this.emit('stateChanged', newState);
    });

    // DOM events
    this.dom.on('elementClicked', (elementId) => {
      this.emit('elementClicked', elementId);
    });

    // Question events
    this.questions.on('questionAnswered', (data) => {
      this.handleQuestionAnswered(data);
    });

    // Council events
    this.councils.on('councilOffended', (council) => {
      this.handleCouncilOffended(council);
    });

    // Error events
    if (this.errorHandler) {
      this.errorHandler.on('error', (error) => {
        this.emit('error', error);
      });
    }
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      if (this.isGameActive && this.state.hasChanges()) {
        this.saveGame();
      }
    }, this.config.autoSaveInterval);
  }

  /**
   * Start a new game
   */
  async startGame(difficulty = 'normal') {
    try {
      this.performance?.startTimer('gameStart');
      
      this.log(`Starting new game with difficulty: ${difficulty}`);
      
      // Reset game state
      this.state.reset();
      this.state.set('difficulty', difficulty);
      this.state.set('startTime', Date.now());
      this.state.set('phase', 'playing');
      
      // Reset metrics
      this.metrics = {
        questionsAnswered: 0,
        councilsOffended: 0,
        totalTime: 0,
        averageResponseTime: 0,
        errorsEncountered: 0
      };

      // Initialize game components
      this.isGameActive = true;
      this.currentPhase = 'playing';
      this.startTime = Date.now();

      // Load first question
      const firstQuestion = this.questions.getNextQuestion();
      if (!firstQuestion) {
        throw new Error('No questions available');
      }

      // Render initial game state
      this.dom.renderGameScreen({
        question: firstQuestion,
        stats: this.getGameStats(),
        councils: this.councils.getActiveCouncils()
      });

      this.emit('gameStarted', { difficulty, question: firstQuestion });
      this.performance?.endTimer('gameStart');

    } catch (error) {
      this.handleError('Failed to start game', error);
      throw error;
    }
  }

  /**
   * Handle question answered event
   */
  async handleQuestionAnswered(data) {
    try {
      this.performance?.startTimer('questionAnswered');
      
      const { question, answer, responseTime } = data;
      
      // Update metrics
      this.metrics.questionsAnswered++;
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime * (this.metrics.questionsAnswered - 1) + responseTime) / 
        this.metrics.questionsAnswered;

      // Process council reactions
      const offendedCouncils = this.councils.processAnswer(question, answer);
      
      // Update game state
      this.state.addQuestionAnswered({
        questionId: question.id,
        answer,
        responseTime,
        offendedCouncils: offendedCouncils.map(c => c.name),
        timestamp: Date.now()
      });

      // Check if game should continue
      const shouldContinue = this.checkGameContinuation();
      
      if (shouldContinue) {
        // Load next question
        const nextQuestion = this.questions.getNextQuestion();
        if (nextQuestion) {
          this.dom.updateQuestion(nextQuestion);
        } else {
          // No more questions, calculate verdict
          this.calculateVerdict();
        }
      } else {
        // Game should end
        this.calculateVerdict();
      }

      this.emit('questionProcessed', {
        question,
        answer,
        offendedCouncils,
        shouldContinue
      });

      this.performance?.endTimer('questionAnswered');

    } catch (error) {
      this.handleError('Failed to process question answer', error);
    }
  }

  /**
   * Handle council offended event
   */
  handleCouncilOffended(council) {
    this.metrics.councilsOffended++;
    
    // Show notification
    this.dom.showCouncilNotification({
      council: council.name,
      message: council.offendedMessage,
      severity: council.severity
    });

    // Check if too many councils are offended
    const offendedCount = this.councils.getOffendedCouncils().length;
    if (offendedCount >= 5) {
      this.calculateVerdict();
    }

    this.emit('councilOffended', council);
  }

  /**
   * Check if game should continue
   */
  checkGameContinuation() {
    const offendedCount = this.councils.getOffendedCouncils().length;
    const questionsAnswered = this.state.get('questionsAnswered')?.length || 0;
    const maxQuestions = this.questions.getQuestionCount();

    // Stop if too many councils offended or all questions answered
    return offendedCount < 5 && questionsAnswered < maxQuestions;
  }

  /**
   * Calculate final verdict
   */
  async calculateVerdict() {
    try {
      this.performance?.startTimer('verdictCalculation');
      
      const gameData = {
        questionsAnswered: this.state.get('questionsAnswered') || [],
        councilsOffended: this.councils.getOffendedCouncils(),
        totalTime: Date.now() - this.startTime,
        difficulty: this.state.get('difficulty'),
        metrics: this.metrics
      };

      const verdict = this.verdict.calculate(gameData);
      
      this.state.set('verdict', verdict);
      this.state.set('phase', 'verdict');
      this.isGameActive = false;

      // Render verdict screen
      this.dom.renderVerdictScreen({
        verdict,
        stats: gameData,
        recommendations: this.getRecommendations(verdict)
      });

      // Save final state
      await this.saveGame();

      this.emit('verdictCalculated', verdict);
      this.performance?.endTimer('verdictCalculation');

    } catch (error) {
      this.handleError('Failed to calculate verdict', error);
    }
  }

  /**
   * Get current game statistics
   */
  getGameStats() {
    return {
      questionsAnswered: this.metrics.questionsAnswered,
      councilsOffended: this.metrics.councilsOffended,
      timeElapsed: Math.floor((Date.now() - this.startTime) / 1000),
      currentStanding: this.councils.getCurrentStanding(),
      averageResponseTime: Math.round(this.metrics.averageResponseTime)
    };
  }

  /**
   * Get recommendations based on verdict
   */
  getRecommendations(verdict) {
    const recommendations = [];
    
    if (verdict.type === 'doomed') {
      recommendations.push('Consider being more diplomatic in your responses');
      recommendations.push('Try to understand different perspectives');
    } else if (verdict.type === 'borderline') {
      recommendations.push('Your answers show mixed signals');
      recommendations.push('Consider the consequences of your statements');
    } else {
      recommendations.push('You navigated the trial skillfully');
      recommendations.push('Your balanced approach served you well');
    }

    return recommendations;
  }

  /**
   * Save current game state
   */
  async saveGame() {
    try {
      this.performance?.startTimer('gameSave');
      
      const saveData = {
        state: this.state.getAll(),
        metrics: this.metrics,
        timestamp: Date.now()
      };

      await this.state.save(saveData);
      this.emit('gameSaved', saveData);
      
      this.performance?.endTimer('gameSave');
      this.log('Game saved successfully');

    } catch (error) {
      this.handleError('Failed to save game', error);
    }
  }

  /**
   * Load saved game
   */
  async loadGame() {
    try {
      const saveData = await this.state.load();
      if (saveData) {
        this.state.setAll(saveData.state);
        this.metrics = saveData.metrics;
        this.emit('gameLoaded', saveData);
        return true;
      }
      return false;
    } catch (error) {
      this.handleError('Failed to load game', error);
      return false;
    }
  }

  /**
   * Handle errors
   */
  handleError(message, error) {
    this.metrics.errorsEncountered++;
    
    const errorData = {
      message,
      error: error?.message || error,
      timestamp: Date.now(),
      phase: this.currentPhase,
      state: this.state?.getAll() || {}
    };

    this.log(`Error: ${message}`, 'error');
    this.emit('error', errorData);

    // Show user-friendly error message
    if (this.dom && this.isInitialized) {
      this.dom.showError({
        message: 'An error occurred. Please refresh the page and try again.',
        details: this.config.debug ? error?.message : null
      });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.log('Destroying game engine...');
    
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    // Clean up managers
    this.state?.destroy();
    this.dom?.destroy();
    this.questions?.destroy();
    this.councils?.destroy();
    this.verdict?.destroy();
    this.errorHandler?.destroy();
    this.performance?.destroy();

    this.isInitialized = false;
    this.isGameActive = false;
    this.removeAllListeners();

    this.log('Game engine destroyed');
  }

  /**
   * Log messages (with debug support)
   */
  log(message, level = 'info') {
    if (this.config.debug || level === 'error') {
      const timestamp = new Date().toISOString();
      const logMessage = `[HereticalGame ${timestamp}] ${message}`;
      
      if (level === 'error') {
        console.error(logMessage);
      } else {
        console.log(logMessage);
      }
    }
  }
}

// Export singleton instance
export const gameEngine = new GameEngine({
  debug: true,
  enablePerformanceMonitoring: true,
  enableErrorHandling: true
});