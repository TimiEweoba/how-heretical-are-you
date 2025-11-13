/**
 * The Heretical Game - Question Manager
 * Handles question data, loading, and question logic
 */

import { EventEmitter } from './event-emitter.js';

/**
 * QuestionManager handles all question-related operations
 */
export class QuestionManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      dataPath: options.dataPath || '/src/data/questions.json',
      enableCaching: options.enableCaching !== false,
      cacheExpiry: options.cacheExpiry || 3600000, // 1 hour
      shuffleQuestions: options.shuffleQuestions !== false,
      maxQuestions: options.maxQuestions || null,
      ...options
    };

    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answeredQuestions = new Set();
    this.questionCache = new Map();
    this.lastLoadTime = null;
    this.isLoading = false;
    this.loadError = null;

    this.init();
  }

  /**
   * Initialize question manager
   */
  async init() {
    try {
      // Try to load from cache first
      if (this.config.enableCaching) {
        const cachedData = this.loadFromCache();
        if (cachedData) {
          this.questions = cachedData.questions;
          this.currentQuestionIndex = cachedData.currentIndex;
          this.lastLoadTime = cachedData.timestamp;
          this.emit('initialized', { fromCache: true });
          return;
        }
      }

      this.emit('initialized', { fromCache: false });
    } catch (error) {
      console.warn('Failed to initialize from cache:', error);
      this.emit('initialized', { fromCache: false });
    }
  }

  /**
   * Load questions from data source
   */
  async loadQuestions() {
    if (this.isLoading) {
      console.warn('Questions already loading');
      return;
    }

    this.isLoading = true;
    this.loadError = null;

    try {
      this.emit('loadingStarted');

      let questions;

      // Try to load from external source first
      if (this.config.dataPath) {
        questions = await this.loadFromExternalSource();
      } else {
        // Use built-in questions as fallback
        questions = this.getBuiltInQuestions();
      }

      // Validate and process questions
      this.questions = this.processQuestions(questions);
      this.currentQuestionIndex = 0;
      this.answeredQuestions.clear();

      // Cache if enabled
      if (this.config.enableCaching) {
        this.saveToCache();
      }

      this.lastLoadTime = Date.now();
      this.emit('loadingCompleted', { count: this.questions.length });

    } catch (error) {
      this.loadError = error;
      console.error('Failed to load questions:', error);
      this.emit('loadingError', error);
      
      // Fallback to built-in questions
      this.questions = this.processQuestions(this.getBuiltInQuestions());
      this.emit('loadingCompleted', { count: this.questions.length, fallback: true });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load questions from external source
   */
  async loadFromExternalSource() {
    try {
      const response = await fetch(this.config.dataPath);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle new modular format with difficulty levels
      if (data.questions && typeof data.questions === 'object') {
        // Flatten questions from all difficulty levels
        const allQuestions = [];
        const difficulties = ['easy', 'medium', 'hard', 'expert'];
        
        difficulties.forEach(difficulty => {
          if (Array.isArray(data.questions[difficulty])) {
            data.questions[difficulty].forEach(question => {
              allQuestions.push({
                ...question,
                difficulty,
                id: question.id || `${difficulty}_${allQuestions.length + 1}`
              });
            });
          }
        });
        
        return allQuestions;
      }
      
      // Handle old format (direct array)
      if (Array.isArray(data.questions)) {
        return data.questions;
      }
      
      throw new Error('Invalid questions data format');

    } catch (error) {
      console.warn('Failed to load from external source:', error);
      throw error;
    }
  }

  /**
   * Get built-in questions (fallback)
   */
  getBuiltInQuestions() {
    return [
      {
        id: 'builtin_001',
        text: 'The Earth revolves around the Sun, not the other way around.',
        type: 'binary',
        options: ['Yes', 'No'],
        correctAnswer: 'Yes',
        difficulty: 'easy',
        council: 'Scientific Community',
        heresyPoints: 1,
        timeLimit: 30,
        explanation: 'Scientific evidence supports the heliocentric model proposed by Copernicus and confirmed by Galileo.',
        historicalContext: 'This challenges the geocentric model supported by the Church.',
        tags: ['science', 'astronomy', 'copernican-revolution']
      },
      {
        id: 'builtin_002',
        text: 'The Bible should be translated into common languages so everyone can read it.',
        type: 'binary',
        options: ['Yes', 'No'],
        correctAnswer: 'Yes',
        difficulty: 'medium',
        council: 'Protestant Reformation',
        heresyPoints: 2,
        timeLimit: 30,
        explanation: 'Making scripture accessible to all believers was a key principle of the Reformation.',
        historicalContext: 'This was a key issue during the Protestant Reformation.',
        tags: ['reformation', 'translation', 'accessibility']
      },
      {
        id: 'builtin_003',
        text: 'Kings derive their authority from the consent of the governed, not divine right.',
        type: 'binary',
        options: ['Yes', 'No'],
        correctAnswer: 'Yes',
        difficulty: 'hard',
        council: 'Political Authority',
        heresyPoints: 3,
        timeLimit: 45,
        explanation: 'Political philosophy developed the concept of government by consent rather than divine appointment.',
        historicalContext: 'This challenges the divine right of kings doctrine.',
        tags: ['politics', 'authority', 'democracy']
      },
      {
        id: 'builtin_004',
        text: 'Women should be allowed to receive higher education and hold academic positions.',
        type: 'binary',
        options: ['Yes', 'No'],
        correctAnswer: 'Yes',
        difficulty: 'medium',
        council: 'Academic Institution',
        heresyPoints: 1.5,
        timeLimit: 30,
        explanation: 'Educational opportunities should be available to all qualified individuals regardless of gender.',
        historicalContext: 'This challenges traditional gender roles in education.',
        tags: ['education', 'gender', 'equality']
      },
      {
        id: 'builtin_005',
        text: 'Which method is most reliable for understanding the natural world?',
        type: 'multiple-choice',
        options: [
          { text: 'Scriptural interpretation', value: 'scripture' },
          { text: 'Scientific observation', value: 'science' },
          { text: 'Philosophical reasoning', value: 'philosophy' },
          { text: 'Religious revelation', value: 'revelation' }
        ],
        correctAnswer: 'science',
        difficulty: 'medium',
        council: 'Scientific Community',
        heresyPoints: 2,
        timeLimit: 45,
        explanation: 'Scientific method provides systematic, testable knowledge about the natural world.',
        historicalContext: 'The scientific revolution emphasized empirical observation over traditional authority.',
        tags: ['science', 'methodology', 'epistemology']
      }
    ];
  }

  /**
   * Process and validate questions
   */
  processQuestions(questions) {
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    // Filter valid questions
    const validQuestions = questions.filter(question => {
      if (!question.id || !question.text) {
        console.warn('Question missing required fields:', question);
        return false;
      }

      // Validate question type
      const validTypes = ['binary', 'multiple-choice', 'multiple'];
      if (!question.type || !validTypes.includes(question.type)) {
        console.warn('Question missing or invalid type:', question);
        return false;
      }

      // Validate options for multiple choice
      if ((question.type === 'multiple-choice' || question.type === 'multiple') && !Array.isArray(question.options)) {
        console.warn('Multiple choice question missing options:', question);
        return false;
      }

      // Validate binary questions
      if (question.type === 'binary' && !Array.isArray(question.options)) {
        console.warn('Binary question missing options array:', question);
        return false;
      }

      return true;
    });

    // Shuffle if enabled
    if (this.config.shuffleQuestions) {
      this.shuffleArray(validQuestions);
    }

    // Limit questions if specified
    if (this.config.maxQuestions && validQuestions.length > this.config.maxQuestions) {
      return validQuestions.slice(0, this.config.maxQuestions);
    }

    return validQuestions;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Get next question
   */
  getNextQuestion() {
    if (this.questions.length === 0) {
      return null;
    }

    // Find next unanswered question
    while (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      
      if (!this.answeredQuestions.has(question.id)) {
        this.emit('questionSelected', question);
        return question;
      }
      
      this.currentQuestionIndex++;
    }

    // All questions answered
    return null;
  }

  /**
   * Get current question
   */
  getCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Get question by ID
   */
  getQuestionById(id) {
    return this.questions.find(q => q.id === id);
  }

  /**
   * Process answer to current question
   */
  processAnswer(question, answer) {
    if (!question || answer === undefined) {
      throw new Error('Question and answer are required');
    }

    // Mark question as answered
    this.answeredQuestions.add(question.id);

    // Calculate council reactions
    const councilReactions = this.calculateCouncilReactions(question, answer);

    const result = {
      question,
      answer,
      councilReactions,
      timestamp: Date.now(),
      responseTime: this.calculateResponseTime()
    };

    this.emit('questionAnswered', result);
    return result;
  }

  /**
   * Calculate council reactions to answer
   */
  calculateCouncilReactions(question, answer) {
    const reactions = {};

    if (!question.council) {
      return reactions;
    }

    // Simple scoring based on whether answer matches correct answer
    const isCorrect = answer === question.correctAnswer || 
                     (typeof answer === 'boolean' && answer === (question.correctAnswer === 'Yes'));
    
    const baseScore = isCorrect ? 1 : -1;
    const heresyPoints = question.heresyPoints || 1;
    
    reactions[question.council] = {
      score: baseScore * heresyPoints,
      offended: baseScore < 0,
      severity: this.calculateSeverity(baseScore * heresyPoints),
      isCorrect
    };

    return reactions;
  }

  /**
   * Calculate severity level
   */
  calculateSeverity(score) {
    if (score >= 2) return 'pleased';
    if (score >= 0) return 'neutral';
    if (score >= -1) return 'concerned';
    if (score >= -3) return 'offended';
    return 'severely-offended';
  }

  /**
   * Calculate response time (placeholder for actual implementation)
   */
  calculateResponseTime() {
    // This would be implemented by tracking when question was shown vs answered
    return Math.floor(Math.random() * 10000) + 1000; // 1-11 seconds for now
  }

  /**
   * Get offended councils from reactions
   */
  getOffendedCouncils(reactions) {
    return Object.entries(reactions)
      .filter(([council, reaction]) => reaction.offended)
      .map(([council]) => council);
  }

  /**
   * Get all questions
   */
  getAllQuestions() {
    return this.questions;
  }

  /**
   * Load questions from cache
   */
  loadFromCache() {
    if (!this.config.enableCaching || typeof localStorage === 'undefined') {
      return null;
    }
    
    try {
      const cached = localStorage.getItem(this.config.cacheKey);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      
      // Check if cache is still valid
      const now = Date.now();
      const cacheExpiry = this.config.cacheExpiry || 3600000; // 1 hour default
      
      if (now - data.timestamp > cacheExpiry) {
        localStorage.removeItem(this.config.cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      return null;
    }
  }

  /**
   * Save questions to cache
   */
  saveToCache() {
    if (!this.config.enableCaching || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const data = {
        questions: this.questions,
        currentIndex: this.currentQuestionIndex,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.config.cacheKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }

  /**
   * Destroy the question manager
   */
  destroy() {
    this.removeAllListeners();
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.initialized = false;
  }
}