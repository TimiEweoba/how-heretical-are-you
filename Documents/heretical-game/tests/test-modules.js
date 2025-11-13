/**
 * The Heretical Game - Module Tests
 * Comprehensive tests for the modular architecture
 */

// Import all modules
import { GameEngine } from '../src/js/modules/game-engine.js';
import { StateManager } from '../src/js/modules/state-manager.js';
import { DOMManager } from '../src/js/modules/dom-manager.js';
import { QuestionManager } from '../src/js/modules/question-manager.js';
import { CouncilManager } from '../src/js/modules/council-manager.js';
import { VerdictCalculator } from '../src/js/modules/verdict-calculator.js';
import { ErrorHandler } from '../src/js/modules/error-handler.js';
import { PerformanceMonitor } from '../src/js/modules/performance-monitor.js';
import { EventEmitter } from '../src/js/modules/event-emitter.js';
import * as templates from '../src/js/templates/html-templates.js';

/**
 * Test runner for the modular architecture
 */
class ModuleTestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
    this.currentTest = null;
  }

  /**
   * Add a test
   */
  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🧪 Starting module tests...');
    
    for (const test of this.tests) {
      this.currentTest = test;
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

  /**
   * Run individual test
   */
  async runTest(test) {
    try {
      await test.testFunction();
      return { name: test.name, passed: true };
    } catch (error) {
      return { name: test.name, passed: false, error: error.message };
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`\n📊 Test Summary: ${passed}/${total} tests passed`);
    
    if (passed < total) {
      console.log('\n❌ Failed tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }
  }
}

/**
 * Create and run all tests
 */
function createTests() {
  const runner = new ModuleTestRunner();

  // EventEmitter tests
  runner.addTest('EventEmitter - Basic functionality', () => {
    const emitter = new EventEmitter();
    let called = false;
    
    emitter.on('test', () => {
      called = true;
    });
    
    emitter.emit('test');
    
    if (!called) {
      throw new Error('Event listener not called');
    }
  });

  runner.addTest('EventEmitter - Multiple listeners', () => {
    const emitter = new EventEmitter();
    let count = 0;
    
    emitter.on('test', () => count++);
    emitter.on('test', () => count++);
    
    emitter.emit('test');
    
    if (count !== 2) {
      throw new Error(`Expected 2 calls, got ${count}`);
    }
  });

  // Template tests
  runner.addTest('Templates - Sanitize HTML', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = templates.sanitizeHTML(malicious);
    
    if (sanitized.includes('<script>')) {
      throw new Error('HTML sanitization failed');
    }
  });

  runner.addTest('Templates - Create button', () => {
    const buttonHTML = templates.createButton({
      text: 'Test Button',
      onClick: 'testFunction()'
    });
    
    if (!buttonHTML.includes('Test Button')) {
      throw new Error('Button text not found');
    }
    
    if (!buttonHTML.includes('testFunction()')) {
      throw new Error('Button onclick not found');
    }
  });

  runner.addTest('Templates - Create parchment container', () => {
    const parchmentHTML = templates.createParchment({
      content: '<p>Test content</p>',
      className: 'test-class'
    });
    
    if (!parchmentHTML.includes('Test content')) {
      throw new Error('Parchment content not found');
    }
    
    if (!parchmentHTML.includes('test-class')) {
      throw new Error('Parchment class not found');
    }
  });

  // ErrorHandler tests
  runner.addTest('ErrorHandler - Basic functionality', () => {
    const errorHandler = new ErrorHandler({
      enableGlobalHandlers: false,
      enableConsoleLogging: false,
      enableUserNotifications: false
    });
    
    let errorEmitted = false;
    errorHandler.on('error', () => {
      errorEmitted = true;
    });
    
    errorHandler.handleError('Test error');
    
    if (!errorEmitted) {
      throw new Error('Error event not emitted');
    }
    
    errorHandler.destroy();
  });

  runner.addTest('ErrorHandler - Error normalization', () => {
    const errorHandler = new ErrorHandler({
      enableGlobalHandlers: false,
      enableConsoleLogging: false,
      enableUserNotifications: false
    });
    
    const normalized = errorHandler.normalizeError('String error');
    
    if (normalized.message !== 'String error') {
      throw new Error('String error not normalized correctly');
    }
    
    errorHandler.destroy();
  });

  // PerformanceMonitor tests
  runner.addTest('PerformanceMonitor - Basic functionality', () => {
    const perfMonitor = new PerformanceMonitor({
      enableMetrics: false,
      enableMemoryTracking: false,
      enableFPSMonitoring: false,
      enableNetworkTracking: false
    });
    
    if (!perfMonitor.isMonitoring) {
      throw new Error('Performance monitor not started');
    }
    
    perfMonitor.destroy();
  });

  runner.addTest('PerformanceMonitor - Timer functionality', () => {
    const perfMonitor = new PerformanceMonitor({
      enableMetrics: false,
      enableMemoryTracking: false,
      enableFPSMonitoring: false,
      enableNetworkTracking: false
    });
    
    perfMonitor.startTimer('test-timer');
    
    // Simulate some work
    for (let i = 0; i < 1000000; i++) {
      Math.random();
    }
    
    const result = perfMonitor.endTimer('test-timer');
    
    if (!result || result.duration <= 0) {
      throw new Error('Timer not working correctly');
    }
    
    perfMonitor.destroy();
  });

  // StateManager tests
  runner.addTest('StateManager - Basic state operations', () => {
    const stateManager = new StateManager({
      storageKey: 'test-state',
      enableCompression: false
    });
    
    stateManager.set('test.key', 'test-value');
    const value = stateManager.get('test.key');
    
    if (value !== 'test-value') {
      throw new Error(`Expected 'test-value', got '${value}'`);
    }
    
    stateManager.destroy();
  });

  runner.addTest('StateManager - State validation', () => {
    const stateManager = new StateManager({
      storageKey: 'test-state',
      enableCompression: false
    });
    
    const validated = stateManager.validateState({
      version: '1.0.0',
      phase: 'test',
      difficulty: 'normal',
      questionsAnswered: []
    });
    
    if (!validated || validated.phase !== 'test') {
      throw new Error('State validation failed');
    }
    
    stateManager.destroy();
  });

  // Integration tests
  runner.addTest('Integration - GameEngine initialization', async () => {
    const gameEngine = new GameEngine({
      debug: false,
      enablePerformanceMonitoring: false,
      enableErrorHandling: false,
      autoSaveInterval: 60000 // 1 minute
    });
    
    // Wait for initialization
    await new Promise((resolve) => {
      gameEngine.on('initialized', resolve);
    });
    
    if (!gameEngine.isInitialized) {
      throw new Error('Game engine not initialized');
    }
    
    gameEngine.destroy();
  });

  runner.addTest('Integration - Template XSS protection', () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(\'xss\')">',
      '<svg onload="alert(\'xss\')">',
      '"><script>alert("xss")</script>'
    ];
    
    for (const input of maliciousInputs) {
      const sanitized = templates.sanitizeHTML(input);
      
      // Check that dangerous content was removed
      if (sanitized.includes('<script>') || 
          sanitized.includes('javascript:') ||
          sanitized.includes('onerror=') ||
          sanitized.includes('onload=')) {
        throw new Error(`XSS protection failed for: ${input}`);
      }
    }
  });

  return runner;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting The Heretical Game Module Tests...\n');
  
  const runner = createTests();
  const results = await runner.runAll();
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\n🎯 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! The modular architecture is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }
  
  return results;
}

// Export for use in other test files
export { ModuleTestRunner, createTests, runTests };

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test-modules.html')) {
  runTests().catch(console.error);
}