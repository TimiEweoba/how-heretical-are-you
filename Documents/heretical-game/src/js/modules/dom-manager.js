/**
 * The Heretical Game - DOM Manager
 * Handles all DOM operations, UI updates, and user interactions
 */

import { EventEmitter } from './event-emitter.js';
import * as templates from '../templates/html-templates.js';

/**
 * DOMManager handles all DOM manipulation and UI updates
 */
export class DOMManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      containerId: options.containerId || 'gameContainer',
      enableAnimations: options.enableAnimations !== false,
      enableMobileOptimizations: options.enableMobileOptimizations !== false,
      enableTouchEvents: options.enableTouchEvents !== false,
      animationDuration: options.animationDuration || 300,
      ...options
    };

    this.container = null;
    this.elements = new Map();
    this.eventListeners = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    this.touchStartPos = null;
    this.lastClickTime = 0;

    this.init();
  }

  /**
   * Initialize DOM manager
   */
  init() {
    this.findElements();
    this.setupEventListeners();
    this.setupMobileOptimizations();
    
    this.emit('initialized');
  }

  /**
   * Find and cache important DOM elements
   */
  findElements() {
    // Handle Node.js environment where document is not available
    if (typeof document === 'undefined') {
      // Create a mock container for testing
      this.container = {
        id: this.config.containerId,
        className: 'game-container',
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        appendChild: () => {},
        innerHTML: '',
        style: {}
      };
      
      // Cache mock elements
      this.elements.set('container', this.container);
      this.elements.set('body', this.container);
      this.elements.set('html', this.container);
      return;
    }
    
    this.container = document.getElementById(this.config.containerId);
    
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement('div');
      this.container.id = this.config.containerId;
      this.container.className = 'game-container';
      document.body.appendChild(this.container);
    }

    // Cache common elements
    this.elements.set('container', this.container);
    this.elements.set('body', document.body);
    this.elements.set('html', document.documentElement);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Skip event listeners in Node.js environment
    if (typeof document === 'undefined') {
      return;
    }
    
    // Global click handler for event delegation
    document.addEventListener('click', this.handleClick.bind(this), true);
    
    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Touch events for mobile
    if (this.config.enableTouchEvents) {
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
    
    // Window events (only if window is available)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }
    
    // Prevent context menu on game elements
    this.container.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.game-container')) {
        e.preventDefault();
      }
    });
  }

  /**
   * Setup mobile optimizations
   */
  setupMobileOptimizations() {
    if (!this.config.enableMobileOptimizations) return;
    
    // Skip mobile optimizations in Node.js environment
    if (typeof document === 'undefined') {
      return;
    }
    
    // Add mobile class to body (only if window is available)
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      document.body.classList.toggle('mobile', isMobile);
    }
    
    // Setup viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    const target = event.target;
    const elementId = target.id;
    
    // Prevent double clicks
    const now = Date.now();
    if (now - this.lastClickTime < 100) {
      event.preventDefault();
      return;
    }
    this.lastClickTime = now;
    
    // Handle game-specific clicks
    if (target.closest('.answer-button')) {
      this.handleAnswerClick(target, event);
    } else if (target.closest('.option-button')) {
      this.handleOptionClick(target, event);
    } else if (target.closest('.council-dismiss')) {
      this.handleCouncilDismiss(target, event);
    } else if (target.closest('.error-close')) {
      this.handleErrorClose(target, event);
    }
    
    // Emit generic click event
    if (elementId) {
      this.emit('elementClicked', elementId);
    }
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event) {
    // Handle answer shortcuts
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      const agreeButton = document.querySelector('.answer-button.agree');
      if (agreeButton && !agreeButton.disabled) {
        event.preventDefault();
        agreeButton.click();
      }
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      const disagreeButton = document.querySelector('.answer-button.disagree');
      if (disagreeButton && !disagreeButton.disabled) {
        event.preventDefault();
        disagreeButton.click();
      }
    }
    
    // Handle number keys for multiple choice
    if (event.key >= '1' && event.key <= '9') {
      const optionIndex = parseInt(event.key) - 1;
      const options = document.querySelectorAll('.option-button');
      if (options[optionIndex] && !options[optionIndex].disabled) {
        event.preventDefault();
        options[optionIndex].click();
      }
    }
    
    // Handle spacebar for continue buttons
    if (event.key === ' ' || event.key === 'Enter') {
      const continueButton = document.querySelector('.button:not(:disabled)');
      if (continueButton && continueButton.textContent.toLowerCase().includes('continue')) {
        event.preventDefault();
        continueButton.click();
      }
    }
  }

  /**
   * Handle touch events
   */
  handleTouchStart(event) {
    if (event.touches.length === 1) {
      this.touchStartPos = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
  }

  handleTouchEnd(event) {
    if (!this.touchStartPos || event.changedTouches.length !== 1) return;
    
    const touchEndPos = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
    
    const deltaX = touchEndPos.x - this.touchStartPos.x;
    const deltaY = touchEndPos.y - this.touchStartPos.y;
    
    // Handle swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - agree
        const agreeButton = document.querySelector('.answer-button.agree');
        if (agreeButton && !agreeButton.disabled) {
          agreeButton.click();
        }
      } else {
        // Swipe left - disagree
        const disagreeButton = document.querySelector('.answer-button.disagree');
        if (disagreeButton && !disagreeButton.disabled) {
          disagreeButton.click();
        }
      }
    }
    
    this.touchStartPos = null;
  }

  /**
   * Handle resize events
   */
  handleResize() {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      document.body.classList.toggle('mobile', isMobile);
      
      this.emit('resized', { width: window.innerWidth, height: window.innerHeight });
    }
  }

  /**
   * Handle before unload
   */
  handleBeforeUnload(event) {
    // Check if game is active and has unsaved changes
    if (this.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
    }
  }

  /**
   * Handle answer button clicks
   */
  handleAnswerClick(button, event) {
    const answer = button.classList.contains('agree');
    
    // Disable buttons to prevent double clicks
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(btn => btn.disabled = true);
    
    // Add visual feedback
    button.classList.add('selected');
    
    this.emit('answerSelected', { answer, button });
  }

  /**
   * Handle option button clicks (multiple choice)
   */
  handleOptionClick(button, event) {
    const optionValue = button.dataset.value || button.textContent;
    
    // Disable all options
    const options = document.querySelectorAll('.option-button');
    options.forEach(opt => opt.disabled = true);
    
    // Add visual feedback
    button.classList.add('selected');
    
    this.emit('optionSelected', { value: optionValue, button });
  }

  /**
   * Handle council notification dismiss
   */
  handleCouncilDismiss(button, event) {
    const notification = button.closest('.council-notification');
    if (notification) {
      this.animateOut(notification);
      this.emit('councilNotificationDismissed', notification.dataset.council);
    }
  }

  /**
   * Handle error message close
   */
  handleErrorClose(button, event) {
    const errorMessage = button.closest('.error-message');
    if (errorMessage) {
      this.animateOut(errorMessage);
      this.emit('errorMessageClosed');
    }
  }

  /**
   * Render start screen
   */
  renderStartScreen() {
    this.setContent(templates.createStartScreen());
    this.animateIn(this.container);
  }

  /**
   * Render instructions screen
   */
  renderInstructions() {
    this.setContent(templates.createInstructions());
    this.animateIn(this.container);
  }

  /**
   * Render difficulty selector
   */
  renderDifficultySelector(difficulties, selected) {
    const content = templates.createDifficultySelector({ difficulties, selected });
    this.setContent(content);
    this.animateIn(this.container);
  }

  /**
   * Render game screen
   */
  renderGameScreen({ question, stats, councils }) {
    const answers = templates.createAnswerButtons();
    const timer = templates.createTimer({ seconds: 30 });
    const reaction = templates.createReaction();
    
    const questionContainer = templates.createQuestionContainer({
      questionNumber: `Question ${stats.questionsAnswered + 1}`,
      questionText: question.text,
      answers,
      timer,
      reaction
    });

    const gameStats = templates.createGameStats({ stats });
    
    const content = `
      <div class="game-screen">
        ${gameStats}
        ${questionContainer}
      </div>
    `;

    this.setContent(content);
    this.animateIn(this.container);
  }

  /**
   * Update current question
   */
  updateQuestion(question) {
    const questionElement = this.container.querySelector('.question-text');
    const questionNumber = this.container.querySelector('.question-number');
    const answerButtons = this.container.querySelectorAll('.answer-button');
    
    if (questionElement) {
      questionElement.textContent = question.text;
    }
    
    if (questionNumber) {
      const currentQuestion = parseInt(questionNumber.textContent.match(/\d+/)?.[0] || '0');
      questionNumber.textContent = `Question ${currentQuestion + 1}`;
    }
    
    // Re-enable answer buttons
    answerButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('selected');
    });
    
    // Reset timer
    const timerElement = this.container.querySelector('.timer');
    if (timerElement) {
      timerElement.textContent = '⏳ 30s';
    }
    
    // Clear reaction
    const reactionElement = this.container.querySelector('.reaction');
    if (reactionElement) {
      reactionElement.textContent = '';
    }
  }

  /**
   * Render verdict screen
   */
  renderVerdictScreen({ verdict, stats, recommendations }) {
    const actions = [
      {
        text: 'Play Again',
        onClick: 'game.startGame()',
        className: 'button-primary'
      },
      {
        text: 'View History',
        onClick: 'game.showHistory()',
        className: 'button-secondary'
      }
    ];

    const content = templates.createVerdictScreen({
      type: verdict.type,
      title: verdict.title,
      description: verdict.description,
      details: verdict.details,
      actions
    });

    this.setContent(content);
    this.animateIn(this.container);
  }

  /**
   * Show council notification
   */
  showCouncilNotification({ council, message, severity }) {
    const notification = templates.createCouncilNotification({
      council,
      message,
      icon: this.getCouncilIcon(council),
      severity
    });

    // Add to notification container or create one
    let notificationContainer = this.container.querySelector('.notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      this.container.appendChild(notificationContainer);
    }

    notificationContainer.insertAdjacentHTML('beforeend', notification);
    const notificationElement = notificationContainer.lastElementChild;
    
    // Animate in
    this.animateIn(notificationElement);
    
    // Auto-dismiss after delay
    setTimeout(() => {
      if (notificationElement.parentNode) {
        this.animateOut(notificationElement);
      }
    }, 5000);
  }

  /**
   * Show error message
   */
  showError({ message, details }) {
    const errorElement = templates.createErrorMessage({ message });
    
    // Add to container
    this.container.insertAdjacentHTML('afterbegin', errorElement);
    const errorElementNode = this.container.firstElementChild;
    
    // Animate in
    this.animateIn(errorElementNode);
    
    // Auto-remove after delay
    setTimeout(() => {
      if (errorElementNode.parentNode) {
        this.animateOut(errorElementNode);
      }
    }, 8000);
  }

  /**
   * Update game statistics
   */
  updateStats(stats) {
    const statsElement = this.container.querySelector('.game-stats');
    if (statsElement) {
      const newStats = templates.createGameStats({ stats });
      statsElement.outerHTML = newStats;
    }
  }

  /**
   * Show reaction
   */
  showReaction(type, message) {
    const reactionElement = this.container.querySelector('.reaction');
    if (reactionElement) {
      reactionElement.textContent = message;
      reactionElement.className = `reaction reaction-${type}`;
      
      // Animate reaction
      this.animateIn(reactionElement);
      
      // Clear after delay
      setTimeout(() => {
        reactionElement.textContent = '';
        reactionElement.className = 'reaction';
      }, 2000);
    }
  }

  /**
   * Get council icon
   */
  getCouncilIcon(councilName) {
    const icons = {
      'Catholic Church': '⛪',
      'Protestant Reformation': '✝️',
      'Scientific Community': '🔬',
      'Political Authority': '👑',
      'Academic Institution': '🎓',
      'Religious Order': '🕊️',
      'Philosophical School': '🤔'
    };
    
    return icons[councilName] || '⚔️';
  }

  /**
   * Set container content
   */
  setContent(html) {
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  /**
   * Animate element in
   */
  animateIn(element) {
    if (!this.config.enableAnimations) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  /**
   * Animate element out
   */
  animateOut(element) {
    if (!this.config.enableAnimations) {
      element.remove();
      return;
    }
    
    element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      if (element.parentNode) {
        element.remove();
      }
    }, this.config.animationDuration);
  }

  /**
   * Show loading indicator
   */
  showLoading(message = 'Loading') {
    const loading = templates.createLoadingIndicator({ text: message });
    this.setContent(loading);
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loading = this.container.querySelector('.loading-indicator');
    if (loading) {
      this.animateOut(loading);
    }
  }

  /**
   * Check if element is visible
   */
  isElementVisible(selector) {
    const element = this.container.querySelector(selector);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    if (typeof window === 'undefined') {
      return true; // Assume visible in Node.js environment
    }
    
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  /**
   * Scroll to element
   */
  scrollToElement(selector, options = {}) {
    const element = this.container.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        ...options
      });
    }
  }

  /**
   * Focus element
   */
  focusElement(selector) {
    const element = this.container.querySelector(selector);
    if (element) {
      element.focus();
    }
  }

  /**
   * Disable all interactive elements
   */
  disableInteractions() {
    const interactiveElements = this.container.querySelectorAll(
      'button, input, select, textarea, a'
    );
    
    interactiveElements.forEach(element => {
      element.disabled = true;
    });
  }

  /**
   * Enable all interactive elements
   */
  enableInteractions() {
    const interactiveElements = this.container.querySelectorAll(
      'button, input, select, textarea, a'
    );
    
    interactiveElements.forEach(element => {
      element.disabled = false;
    });
  }

  /**
   * Get element position
   */
  getElementPosition(selector) {
    const element = this.container.querySelector(selector);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + (typeof window !== 'undefined' ? window.scrollY : 0),
      left: rect.left + (typeof window !== 'undefined' ? window.scrollX : 0),
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Remove event listeners (only if document is available)
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleClick, true);
      document.removeEventListener('keydown', this.handleKeyDown);
      
      if (this.config.enableTouchEvents) {
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchend', this.handleTouchEnd);
      }
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    
    // Clear references
    this.container = null;
    this.elements.clear();
    this.eventListeners.clear();
    
    this.removeAllListeners();
  }

  /**
   * Get current viewport info
   */
  getViewportInfo() {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      isDesktop: window.innerWidth > 1024
    };
  }

  /**
   * Check if device supports touch
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}