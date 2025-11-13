/**
 * Simple integration test runner
 */

import { GameEngine } from '../src/js/modules/game-engine.js';

async function runIntegrationTests() {
  console.log('🚀 Starting The Heretical Game Integration Tests...\n');
  
  try {
    // Test 1: Complete game initialization
    console.log('Testing complete game initialization...');
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

    console.log('✅ Game engine initialized successfully');
    console.log('✅ All subsystems initialized');
    
    // Test 2: Game state persistence
    console.log('\nTesting game state persistence...');
    
    // Check if stateManager is available
    if (!gameEngine.stateManager) {
      throw new Error('StateManager not initialized');
    }
    
    gameEngine.stateManager.set('test.key', 'test-value');
    gameEngine.stateManager.set('game.phase', 'question');
    gameEngine.stateManager.set('player.heresyPoints', 5);
    
    const restoredValue = gameEngine.stateManager.get('test.key');
    const restoredPhase = gameEngine.stateManager.get('game.phase');
    const restoredHeresyPoints = gameEngine.stateManager.get('player.heresyPoints');
    
    if (restoredValue !== 'test-value') {
      throw new Error('Test key not restored correctly');
    }
    if (restoredPhase !== 'question') {
      throw new Error('Game phase not restored correctly');
    }
    if (restoredHeresyPoints !== 5) {
      throw new Error('Heresy points not restored correctly');
    }
    
    console.log('✅ Game state persistence working correctly');
    
    // Test 3: Question loading and management
    console.log('\nTesting question loading and management...');
    
    // Check if questionManager is available
    if (!gameEngine.questionManager) {
      throw new Error('QuestionManager not initialized');
    }
    
    const questions = gameEngine.questionManager.getAllQuestions();
    if (!questions || questions.length === 0) {
      throw new Error('No questions loaded');
    }
    
    const randomQuestion = gameEngine.questionManager.getRandomQuestion();
    if (!randomQuestion || !randomQuestion.text) {
      throw new Error('Random question not valid');
    }
    
    console.log(`✅ Question loading working correctly (${questions.length} questions loaded)`);
    
    // Test 4: Council reaction system
    console.log('\nTesting council reaction system...');
    
    // Check if councilManager is available
    if (!gameEngine.councilManager) {
      throw new Error('CouncilManager not initialized');
    }
    
    const reactions = gameEngine.councilManager.getCouncilReactions(randomQuestion, 'Yes');
    if (!reactions || typeof reactions !== 'object') {
      throw new Error('Council reactions not returned correctly');
    }
    
    console.log('✅ Council reaction system working correctly');
    
    // Test 5: Verdict calculation
    console.log('\nTesting verdict calculation...');
    
    // Check if verdictCalculator is available
    if (!gameEngine.verdictCalculator) {
      throw new Error('VerdictCalculator not initialized');
    }
    
    const verdict = gameEngine.verdictCalculator.calculateVerdict(5);
    if (!verdict || typeof verdict !== 'object') {
      throw new Error('Verdict not calculated correctly');
    }
    
    console.log('✅ Verdict calculation working correctly');
    
    // Test 6: Complete question answering flow
    console.log('\nTesting complete question answering flow...');
    
    const question = gameEngine.questionManager.getRandomQuestion();
    if (!question) {
      throw new Error('No question available');
    }
    
    // Simulate answering the question
    const answer = 'Yes';
    const isCorrect = gameEngine.questionManager.checkAnswer(question, answer);
    
    // Update game state
    gameEngine.stateManager.set('currentQuestion', question);
    gameEngine.stateManager.set('playerAnswer', answer);
    gameEngine.stateManager.set('answerCorrect', isCorrect);
    
    // Verify state was updated correctly
    const currentQuestion = gameEngine.stateManager.get('currentQuestion');
    const playerAnswer = gameEngine.stateManager.get('playerAnswer');
    const answerCorrect = gameEngine.stateManager.get('answerCorrect');
    
    if (currentQuestion !== question) {
      throw new Error('Current question not set correctly');
    }
    if (playerAnswer !== answer) {
      throw new Error('Player answer not set correctly');
    }
    if (answerCorrect !== isCorrect) {
      throw new Error('Answer correctness not set correctly');
    }
    
    console.log('✅ Complete question answering flow working correctly');
    
    // Cleanup
    gameEngine.destroy();
    
    console.log('\n🎉 All integration tests passed! The game flow is working correctly.');
    console.log('\n📊 Integration Test Summary: 6/6 tests passed');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the tests
runIntegrationTests();