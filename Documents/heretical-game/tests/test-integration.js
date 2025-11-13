/**
 * The Heretical Game - Integration Tests
 * Comprehensive tests for complete game flow
 */

import { GameEngine } from '../src/js/modules/game-engine.js';
import { StateManager } from '../src/js/modules/state-manager.js';
import { QuestionManager } from '../src/js/modules/question-manager.js';
import { CouncilManager } from '../src/js/modules/council-manager.js';
import { VerdictCalculator } from '../src/js/modules/verdict-calculator.js';

/**
 * Integration test runner
 */
class IntegrationTestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async runAll() {
    console.log('🎯 Starting integration tests...');
    
    for (const test of this.tests) {
      const result = await this.runTest(test);
      this.results.push(result);
      
      console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
      if (!result.passed) {
        console.error('   Error:', result.error);
      }
    }

    this.printSummary();
    return this.results;
  }

  async runTest(test) {
    try {
      await test.testFunction();
      return { name: test.name, passed: true };
    } catch (error) {
      return { name: test.name, passed: false, error: error.message };
    }
  }

  printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`\n📊 Integration Test Summary: ${passed}/${total} tests passed`);
  }
}

/**
 * Create integration tests
 */
function createIntegrationTests() {
  const runner = new IntegrationTestRunner();

  // Game initialization and lifecycle
  runner.addTest('Complete game initialization', async () => {
    const gameEngine = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false,
      autoSaveInterval: 60000
    });

    await new Promise((resolve) => {
      gameEngine.on('initialized', resolve);
    });

    if (!gameEngine.isInitialized) {
      throw new Error('Game engine failed to initialize');
    }

    // Check that all subsystems are initialized
    if (!gameEngine.stateManager || !gameEngine.domManager || 
        !gameEngine.questionManager || !gameEngine.councilManager) {
      throw new Error('Not all subsystems initialized');
    }

    gameEngine.destroy();
  });

  runner.addTest('Game state persistence', async () => {
    const gameEngine1 = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false,
      storageKey: 'test-game-state'
    });

    await new Promise((resolve) => {
      gameEngine1.on('initialized', resolve);
    });

    // Set some game state
    gameEngine1.stateManager.set('test.key', 'test-value');
    gameEngine1.stateManager.set('game.phase', 'question');
    gameEngine1.stateManager.set('player.heresyPoints', 5);

    // Destroy first instance
    gameEngine1.destroy();

    // Create new instance and check state was restored
    const gameEngine2 = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false,
      storageKey: 'test-game-state'
    });

    await new Promise((resolve) => {
      gameEngine2.on('initialized', resolve);
    });

    const restoredValue = gameEngine2.stateManager.get('test.key');
    const restoredPhase = gameEngine2.stateManager.get('game.phase');
    const restoredHeresyPoints = gameEngine2.stateManager.get('player.heresyPoints');

    if (restoredValue !== 'test-value') {
      throw new Error('Test key not restored correctly');
    }
    if (restoredPhase !== 'question') {
      throw new Error('Game phase not restored correctly');
    }
    if (restoredHeresyPoints !== 5) {
      throw new Error('Heresy points not restored correctly');
    }

    gameEngine2.destroy();
  });

  runner.addTest('Question loading and management', async () => {
    const gameEngine = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false
    });

    await new Promise((resolve) => {
      gameEngine.on('initialized', resolve);
    });

    const questionManager = gameEngine.questionManager;

    // Check that questions are loaded
    const questions = questionManager.getAllQuestions();
    if (!questions || questions.length === 0) {
      throw new Error('No questions loaded');
    }

    // Test getting a random question
    const randomQuestion = questionManager.getRandomQuestion();
    if (!randomQuestion || !randomQuestion.text) {
      throw new Error('Random question not valid');
    }

    gameEngine.destroy();
  });

  runner.addTest('Council reaction system', async () => {
    const gameEngine = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false
    });

    await new Promise((resolve) => {
      gameEngine.on('initialized', resolve);
    });

    const councilManager = gameEngine.councilManager;
    const questionManager = gameEngine.questionManager;

    // Get a sample question
    const question = questionManager.getRandomQuestion();
    if (!question) {
      throw new Error('No question available for testing');
    }

    // Test council reactions
    const reactions = councilManager.getCouncilReactions(question, 'Yes');
    if (!reactions || typeof reactions !== 'object') {
      throw new Error('Council reactions not returned correctly');
    }

    gameEngine.destroy();
  });

  runner.addTest('Complete question answering flow', async () => {
    const gameEngine = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false
    });

    await new Promise((resolve) => {
      gameEngine.on('initialized', resolve);
    });

    const questionManager = gameEngine.questionManager;
    const stateManager = gameEngine.stateManager;

    // Get a question
    const question = questionManager.getRandomQuestion();
    if (!question) {
      throw new Error('No question available');
    }

    // Simulate answering the question
    const answer = 'Yes';
    const isCorrect = questionManager.checkAnswer(question, answer);
    
    // Update game state
    stateManager.set('currentQuestion', question);
    stateManager.set('playerAnswer', answer);
    stateManager.set('answerCorrect', isCorrect);

    // Check that state was updated correctly
    const currentQuestion = stateManager.get('currentQuestion');
    const playerAnswer = stateManager.get('playerAnswer');
    const answerCorrect = stateManager.get('answerCorrect');

    if (currentQuestion !== question) {
      throw new Error('Current question not set correctly');
    }
    if (playerAnswer !== answer) {
      throw new Error('Player answer not set correctly');
    }
    if (answerCorrect !== isCorrect) {
      throw new Error('Answer correctness not set correctly');
    }

    gameEngine.destroy();
  });

  return runner;
}

/**
 * Run integration tests
 */
async function runIntegrationTests() {
  console.log('🚀 Starting The Heretical Game Integration Tests...\n');
  
  const runner = createIntegrationTests();
  const results = await runner.runAll();
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\n🎯 Integration Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All integration tests passed! The game flow is working correctly.');
  } else {
    console.log('⚠️  Some integration tests failed. Please review the implementation.');
  }
  
  return results;
}

// Export for use in other test files
export { IntegrationTestRunner, createIntegrationTests, runIntegrationTests };

// Run tests if this file is executed directly
if (typeof window === 'undefined' || window.location.pathname.includes('test-integration.js')) {
  runIntegrationTests().catch(console.error);
}