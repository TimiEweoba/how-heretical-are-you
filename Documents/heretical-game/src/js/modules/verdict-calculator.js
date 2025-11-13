/**
 * The Heretical Game - Verdict Calculator
 * Calculates final verdict based on game performance and council reactions
 */

import { EventEmitter } from './event-emitter.js';

/**
 * VerdictCalculator determines the player's final fate based on their answers
 */
export class VerdictCalculator extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      thresholds: options.thresholds || {
        faithful: { min: -2, max: 2 },
        borderline: { min: -5, max: 5 },
        doomed: { min: -Infinity, max: -5 }
      },
      enableDetailedAnalysis: options.enableDetailedAnalysis !== false,
      enableRecommendations: options.enableRecommendations !== false,
      ...options
    };

    this.verdictTemplates = {
      faithful: {
        title: 'Faithful Servant',
        description: 'You have successfully navigated the treacherous waters of medieval politics and theology.',
        details: 'Your answers demonstrate wisdom and diplomatic skill. You have managed to avoid offending the major powers while maintaining your integrity.',
        color: '#FFD700',
        icon: '✨'
      },
      borderline: {
        title: 'Borderline Case',
        description: 'You walk a fine line between heresy and orthodoxy.',
        details: 'Your answers show mixed signals. While you haven\'t committed outright heresy, your views are concerning to the established authorities.',
        color: '#FFA500',
        icon: '⚖️'
      },
      doomed: {
        title: 'Doomed Heretic',
        description: 'Your views are too radical for this time and place.',
        details: 'You have offended too many powerful institutions. Your fate is sealed, and you will likely face severe consequences for your heretical views.',
        color: '#8B0000',
        icon: '💀'
      }
    };
  }

  /**
   * Calculate final verdict based on game data
   */
  calculate(gameData) {
    const {
      questionsAnswered,
      councilsOffended,
      totalTime,
      difficulty,
      metrics
    } = gameData;

    // Calculate various scores
    const councilScore = this.calculateCouncilScore(councilsOffended);
    const responseScore = this.calculateResponseScore(metrics);
    const consistencyScore = this.calculateConsistencyScore(questionsAnswered);
    const timeScore = this.calculateTimeScore(totalTime, questionsAnswered.length);
    
    // Calculate final score
    const finalScore = this.calculateFinalScore({
      councilScore,
      responseScore,
      consistencyScore,
      timeScore,
      difficulty
    });

    // Determine verdict type
    const verdictType = this.determineVerdictType(finalScore);
    
    // Generate detailed analysis
    const analysis = this.config.enableDetailedAnalysis 
      ? this.generateAnalysis(gameData, finalScore)
      : null;

    // Generate recommendations
    const recommendations = this.config.enableRecommendations
      ? this.generateRecommendations(verdictType, analysis)
      : [];

    const verdict = {
      type: verdictType,
      score: finalScore,
      title: this.verdictTemplates[verdictType].title,
      description: this.verdictTemplates[verdictType].description,
      details: this.verdictTemplates[verdictType].details,
      color: this.verdictTemplates[verdictType].color,
      icon: this.verdictTemplates[verdictType].icon,
      analysis,
      recommendations,
      timestamp: Date.now(),
      gameStats: {
        questionsAnswered: questionsAnswered.length,
        councilsOffended: councilsOffended.length,
        totalTime,
        difficulty,
        averageResponseTime: metrics.averageResponseTime
      }
    };

    this.emit('verdictCalculated', verdict);
    return verdict;
  }

  /**
   * Calculate council score based on offended councils
   */
  calculateCouncilScore(councilsOffended) {
    const baseScore = 0;
    const penaltyPerCouncil = -2;
    const severityMultipliers = {
      low: 1,
      medium: 1.5,
      high: 2,
      severe: 3
    };

    let totalScore = baseScore;
    
    councilsOffended.forEach(council => {
      const severity = council.lastReaction?.severity || 'medium';
      const multiplier = severityMultipliers[severity] || 1;
      totalScore += penaltyPerCouncil * multiplier;
    });

    return Math.max(-10, totalScore); // Cap at -10
  }

  /**
   * Calculate response score based on response times
   */
  calculateResponseScore(metrics) {
    const { averageResponseTime } = metrics;
    
    // Faster responses are slightly better (shows confidence)
    if (averageResponseTime < 3000) return 1;
    if (averageResponseTime < 8000) return 0;
    if (averageResponseTime < 15000) return -1;
    return -2; // Very slow responses
  }

  /**
   * Calculate consistency score based on answer patterns
   */
  calculateConsistencyScore(questionsAnswered) {
    if (questionsAnswered.length < 3) return 0;

    let consistentAnswers = 0;
    let totalAnswers = questionsAnswered.length;

    // Check for consistency in theological vs scientific questions
    let theologicalStance = 0;
    let scientificStance = 0;
    let politicalStance = 0;

    questionsAnswered.forEach(answer => {
      const { question, answer: userAnswer } = answer;
      
      // Analyze theological consistency
      if (question.councils?.['Catholic Church'] || question.councils?.['Protestant Reformation']) {
        theologicalStance += userAnswer === true ? 1 : -1;
      }
      
      // Analyze scientific consistency
      if (question.councils?.['Scientific Community']) {
        scientificStance += userAnswer === true ? 1 : -1;
      }
      
      // Analyze political consistency
      if (question.councils?.['Political Authority']) {
        politicalStance += userAnswer === true ? 1 : -1;
      }
    });

    // Reward consistency (same stance across similar questions)
    const theologicalConsistency = Math.abs(theologicalStance) / Math.max(1, Math.abs(theologicalStance));
    const scientificConsistency = Math.abs(scientificStance) / Math.max(1, Math.abs(scientificStance));
    const politicalConsistency = Math.abs(politicalStance) / Math.max(1, Math.abs(politicalStance));

    const averageConsistency = (theologicalConsistency + scientificConsistency + politicalConsistency) / 3;
    
    return Math.round(averageConsistency * 2); // Scale to -2 to +2
  }

  /**
   * Calculate time score based on total game time
   */
  calculateTimeScore(totalTime, questionsAnswered) {
    const averageTimePerQuestion = totalTime / questionsAnswered;
    
    // Reasonable time per question is 10-30 seconds
    if (averageTimePerQuestion < 10000) return -1; // Too fast
    if (averageTimePerQuestion < 30000) return 1;  // Good pace
    if (averageTimePerQuestion < 60000) return 0;  // A bit slow
    return -1; // Too slow
  }

  /**
   * Calculate final score combining all factors
   */
  calculateFinalScore(scores) {
    const {
      councilScore,
      responseScore,
      consistencyScore,
      timeScore,
      difficulty
    } = scores;

    // Difficulty multipliers
    const difficultyMultipliers = {
      easy: 1.2,
      normal: 1.0,
      hard: 0.8
    };

    const multiplier = difficultyMultipliers[difficulty] || 1.0;

    // Weighted combination
    const finalScore = (
      councilScore * 0.6 +      // 60% weight on council relations
      consistencyScore * 0.2 +  // 20% weight on consistency
      responseScore * 0.1 +     // 10% weight on response time
      timeScore * 0.1           // 10% weight on overall time
    ) * multiplier;

    return Math.round(finalScore * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Determine verdict type based on final score
   */
  determineVerdictType(score) {
    const { faithful, borderline, doomed } = this.config.thresholds;
    
    if (score >= faithful.min && score <= faithful.max) {
      return 'faithful';
    } else if (score >= borderline.min && score <= borderline.max) {
      return 'borderline';
    } else {
      return 'doomed';
    }
  }

  /**
   * Generate detailed analysis
   */
  generateAnalysis(gameData, finalScore) {
    const { questionsAnswered, councilsOffended, metrics } = gameData;
    
    return {
      overview: this.generateOverview(gameData, finalScore),
      councilAnalysis: this.generateCouncilAnalysis(councilsOffended),
      answerPattern: this.generateAnswerPattern(questionsAnswered),
      performance: this.generatePerformanceAnalysis(metrics),
      strengths: this.identifyStrengths(gameData),
      weaknesses: this.identifyWeaknesses(gameData)
    };
  }

  /**
   * Generate overview analysis
   */
  generateOverview(gameData, finalScore) {
    const { questionsAnswered, councilsOffended, totalTime } = gameData;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    
    return `You answered ${questionsAnswered.length} questions in ${minutes}:${seconds.toString().padStart(2, '0')}, 
            offending ${councilsOffended.length} councils. Your final score of ${finalScore} indicates ${this.getVerdictDescription(finalScore)}.`;
  }

  /**
   * Generate council analysis
   */
  generateCouncilAnalysis(councilsOffended) {
    if (councilsOffended.length === 0) {
      return 'You managed to avoid offending any councils, showing excellent diplomatic skill.';
    }
    
    const analysis = councilsOffended.map(council => {
      const severity = council.lastReaction?.severity || 'medium';
      return `${council.name} (${severity})`;
    }).join(', ');
    
    return `You offended ${councilsOffended.length} councils: ${analysis}.`;
  }

  /**
   * Generate answer pattern analysis
   */
  generateAnswerPattern(questionsAnswered) {
    const agreeCount = questionsAnswered.filter(a => a.answer === true).length;
    const disagreeCount = questionsAnswered.filter(a => a.answer === false).length;
    const total = questionsAnswered.length;
    
    const agreePercentage = Math.round((agreeCount / total) * 100);
    
    if (agreePercentage > 70) {
      return 'You tended to agree with most statements, showing a conformist approach.';
    } else if (agreePercentage < 30) {
      return 'You frequently disagreed with statements, showing a contrarian or skeptical approach.';
    } else {
      return 'You showed a balanced approach, neither too agreeable nor too contrary.';
    }
  }

  /**
   * Generate performance analysis
   */
  generatePerformanceAnalysis(metrics) {
    const { averageResponseTime } = metrics;
    
    if (averageResponseTime < 3000) {
      return 'You answered very quickly, showing confidence in your views.';
    } else if (averageResponseTime < 10000) {
      return 'You took reasonable time to consider your answers.';
    } else {
      return 'You took considerable time with your answers, showing careful consideration.';
    }
  }

  /**
   * Identify strengths
   */
  identifyStrengths(gameData) {
    const strengths = [];
    
    if (gameData.councilsOffended.length === 0) {
      strengths.push('Excellent diplomatic skills');
    }
    
    if (gameData.metrics.averageResponseTime < 5000) {
      strengths.push('Quick decision making');
    }
    
    if (gameData.questionsAnswered.length > 5) {
      strengths.push('Good question completion rate');
    }
    
    return strengths;
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(gameData) {
    const weaknesses = [];
    
    if (gameData.councilsOffended.length >= 3) {
      weaknesses.push('Poor council relations');
    }
    
    if (gameData.metrics.averageResponseTime > 15000) {
      weaknesses.push('Slow decision making');
    }
    
    if (gameData.questionsAnswered.length < 3) {
      weaknesses.push('Low question completion rate');
    }
    
    return weaknesses;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(verdictType, analysis) {
    const recommendations = [];
    
    if (verdictType === 'doomed') {
      recommendations.push('Consider being more diplomatic in your responses');
      recommendations.push('Try to understand different perspectives before answering');
      recommendations.push('Be more cautious about challenging established authorities');
    } else if (verdictType === 'borderline') {
      recommendations.push('Your answers show mixed signals - try to be more consistent');
      recommendations.push('Consider the consequences of your statements more carefully');
      recommendations.push('Balance your views with practical considerations');
    } else {
      recommendations.push('You navigated the trial skillfully');
      recommendations.push('Your balanced approach served you well');
      recommendations.push('Continue to consider multiple perspectives');
    }
    
    return recommendations;
  }

  /**
   * Get verdict description
   */
  getVerdictDescription(score) {
    if (score >= 2) return 'strong alignment with established authorities';
    if (score >= 0) return 'moderate alignment with established authorities';
    if (score >= -2) return 'some tension with established authorities';
    return 'significant conflict with established authorities';
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.removeAllListeners();
  }
}