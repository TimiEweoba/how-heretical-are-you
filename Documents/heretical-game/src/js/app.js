/**
 * The Heretical Game - Main Application
 * Entry point for the modular game application
 */

import { GameEngine } from './modules/game-engine.js';
import * as templates from './templates/html-templates.js';

/**
 * Main application class that initializes and manages the game
 */
class HereticalGame {
  constructor() {
    this.gameEngine = null;
    this.isInitialized = false;
    this.config = {
      debug: true,
      enablePerformanceMonitoring: true,
      enableErrorHandling: true,
      autoStart: true
    };
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🎮 Initializing The Heretical Game...');

      // Create main container
      this.createMainContainer();

      // Initialize game engine
      this.gameEngine = new GameEngine(this.config);

      // Setup event listeners
      this.setupEventListeners();

      // Wait for game engine to initialize
      await new Promise((resolve) => {
        this.gameEngine.on('initialized', resolve);
      });

      this.isInitialized = true;
      console.log('✅ The Heretical Game initialized successfully');

      // Show start screen
      this.showStartScreen();

    } catch (error) {
      console.error('❌ Failed to initialize The Heretical Game:', error);
      this.showInitializationError(error);
    }
  }

  /**
   * Create main application container
   */
  createMainContainer() {
    // Remove any existing container
    const existingContainer = document.getElementById('heretical-game-app');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create main application container
    const appContainer = document.createElement('div');
    appContainer.id = 'heretical-game-app';
    appContainer.className = 'heretical-game-app';
    
    // Add to body
    document.body.appendChild(appContainer);

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';
    gameContainer.className = 'game-container';
    
    appContainer.appendChild(gameContainer);
  }

  /**
   * Setup application event listeners
   */
  setupEventListeners() {
    if (!this.gameEngine) return;

    // Game engine events
    this.gameEngine.on('initialized', () => {
      console.log('🎯 Game engine initialized');
    });

    this.gameEngine.on('gameStarted', (data) => {
      console.log('🎲 Game started:', data);
    });

    this.gameEngine.on('questionProcessed', (data) => {
      console.log('❓ Question processed:', data);
    });

    this.gameEngine.on('councilOffended', (council) => {
      console.log('⚔️ Council offended:', council.name);
    });

    this.gameEngine.on('verdictCalculated', (verdict) => {
      console.log('📜 Verdict calculated:', verdict.type);
    });

    this.gameEngine.on('error', (error) => {
      console.error('💥 Game error:', error);
    });

    // Window events
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Handle visibility change for pause/resume
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Show start screen
   */
  showStartScreen() {
    const container = document.getElementById('gameContainer');
    if (!container) return;

    const startScreenHTML = templates.createStartScreen();
    container.innerHTML = startScreenHTML;

    // Add event listeners for start screen buttons
    this.attachStartScreenListeners();
  }

  /**
   * Attach event listeners to start screen
   */
  attachStartScreenListeners() {
    // Note: In a real implementation, these would be handled by the DOMManager
    // For now, we'll use simple event delegation
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const buttonText = button.textContent.trim();
      
      switch (buttonText) {
        case 'Begin Trial':
          this.startGame();
          break;
        case 'How to Play':
          this.showInstructions();
          break;
      }
    });
  }

  /**
   * Start the game
   */
  startGame() {
    if (!this.gameEngine) {
      console.error('Game engine not initialized');
      return;
    }

    this.gameEngine.startGame('normal');
  }

  /**
   * Show instructions
   */
  showInstructions() {
    const container = document.getElementById('gameContainer');
    if (!container) return;

    const instructionsHTML = templates.createInstructions();
    container.innerHTML = instructionsHTML;

    // Add event listeners for instruction buttons
    this.attachInstructionListeners();
  }

  /**
   * Attach event listeners to instruction screen
   */
  attachInstructionListeners() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const buttonText = button.textContent.trim();
      
      switch (buttonText) {
        case 'Start Trial':
          this.startGame();
          break;
        case 'Back':
          this.showStartScreen();
          break;
      }
    });
  }

  /**
   * Handle visibility change (pause/resume)
   */
  handleVisibilityChange() {
    if (!this.gameEngine) return;

    if (document.hidden) {
      // Page is hidden - pause game
      console.log('🔄 Page hidden - pausing game');
    } else {
      // Page is visible - resume game
      console.log('🔄 Page visible - resuming game');
    }
  }

  /**
   * Show initialization error
   */
  showInitializationError(error) {
    const container = document.getElementById('gameContainer');
    if (!container) {
      document.body.innerHTML = `
        <div class="error-container">
          <h1>Failed to Load Game</h1>
          <p>The Heretical Game could not be initialized.</p>
          <p>Error: ${error.message}</p>
          <button onclick="location.reload()">Try Again</button>
        </div>
      `;
      return;
    }

    const errorHTML = templates.createErrorMessage({
      message: 'Failed to initialize the game. Please refresh the page and try again.',
      className: 'initialization-error'
    });

    container.innerHTML = errorHTML;
  }

  /**
   * Clean up resources
   */
  cleanup() {
    console.log('🧹 Cleaning up The Heretical Game...');

    if (this.gameEngine) {
      this.gameEngine.destroy();
      this.gameEngine = null;
    }

    // Remove event listeners
    window.removeEventListener('beforeunload', this.cleanup);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    console.log('✅ Cleanup completed');
  }

  /**
   * Get application version
   */
  getVersion() {
    return '2.0.0';
  }

  /**
   * Get application info
   */
  getInfo() {
    return {
      version: this.getVersion(),
      initialized: this.isInitialized,
      gameEngine: this.gameEngine ? 'loaded' : 'not loaded',
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  }
}

/**
 * Initialize the application when DOM is ready
 */
function initializeApp() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
    return;
  }

  // Create global game instance
  window.HereticalGame = new HereticalGame();
  
  // Initialize the game
  window.HereticalGame.init();
}

// Auto-initialize if enabled
if (typeof window !== 'undefined') {
  initializeApp();
}

// Export for module systems
export { HereticalGame };