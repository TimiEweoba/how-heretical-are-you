/**
 * The Heretical Game - HTML Templates
 * Reusable template functions for generating HTML components
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  
  // Use simple string replacement if document is not available (Node.js)
  if (typeof document === 'undefined') {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Creates a parchment container component
 * @param {Object} options - Configuration options
 * @param {string} options.content - Inner HTML content
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.id] - Element ID
 * @returns {string} HTML string
 */
export function createParchment({ content, className = '', id = '' }) {
  const classes = `parchment ${className}`.trim();
  const idAttr = id ? `id="${sanitizeHTML(id)}"` : '';
  
  return `
    <div class="${classes}" ${idAttr}>
      ${content}
    </div>
  `;
}

/**
 * Creates a parchment scroll component (for verdict screens)
 * @param {Object} options - Configuration options
 * @param {string} options.content - Inner HTML content
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createParchmentScroll({ content, className = '' }) {
  const classes = `parchment-scroll scroll-reveal ${className}`.trim();
  
  return `
    <div class="${classes}">
      ${content}
    </div>
  `;
}

/**
 * Creates a wax seal component
 * @param {Object} options - Configuration options
 * @param {string} options.icon - The icon/emoji to display
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createWaxSeal({ icon, className = '' }) {
  const classes = `wax-seal ${className}`.trim();
  
  return `
    <div class="${classes}">
      ${sanitizeHTML(icon)}
    </div>
  `;
}

/**
 * Creates a button component
 * @param {Object} options - Configuration options
 * @param {string} options.text - Button text
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.onClick] - onclick handler
 * @param {string} [options.id] - Element ID
 * @param {string} [options.type] - Button type
 * @returns {string} HTML string
 */
export function createButton({ text, className = '', onClick = '', id = '', type = 'button' }) {
  const classes = `button ${className}`.trim();
  const idAttr = id ? `id="${sanitizeHTML(id)}"` : '';
  const onClickAttr = onClick ? `onclick="${sanitizeHTML(onClick)}"` : '';
  
  return `
    <button 
      type="${type}" 
      class="${classes}" 
      ${idAttr} 
      ${onClickAttr}
    >
      ${sanitizeHTML(text)}
    </button>
  `;
}

/**
 * Creates a button group component
 * @param {Object} options - Configuration options
 * @param {string} options.buttons - HTML string of buttons
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createButtonGroup({ buttons, className = '' }) {
  const classes = `button-group ${className}`.trim();
  
  return `
    <div class="${classes}">
      ${buttons}
    </div>
  `;
}

/**
 * Creates answer buttons (Agree/Disagree)
 * @param {Object} options - Configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createAnswerButtons({ className = '' }) {
  const classes = `answer-buttons ${className}`.trim();
  
  return `
    <div class="${classes}">
      <button class="answer-button agree" onclick="game.answer(true)">
        Agree
      </button>
      <button class="answer-button disagree" onclick="game.answer(false)">
        Disagree
      </button>
    </div>
  `;
}

/**
 * Creates multiple choice options
 * @param {Object} options - Configuration options
 * @param {Array} options.options - Array of option objects {text, value}
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createMultipleChoiceOptions({ options, className = '' }) {
  const classes = `options-container ${className}`.trim();
  
  const optionsHTML = options.map((option, index) => `
    <button 
      class="option-button" 
      onclick="game.answerMultipleChoice('${sanitizeHTML(option.value)}')"
    >
      ${sanitizeHTML(option.text)}
    </button>
  `).join('');
  
  return `
    <div class="${classes}">
      ${optionsHTML}
    </div>
  `;
}

/**
 * Creates a question container
 * @param {Object} options - Configuration options
 * @param {string} options.questionNumber - Question number text
 * @param {string} options.questionText - The question text
 * @param {string} options.answers - HTML string of answer buttons/options
 * @param {string} [options.timer] - Timer HTML (optional)
 * @param {string} [options.reaction] - Reaction container HTML (optional)
 * @returns {string} HTML string
 */
export function createQuestionContainer({ questionNumber, questionText, answers, timer = '', reaction = '' }) {
  return `
    <div class="question-container">
      <div class="question-number">${sanitizeHTML(questionNumber)}</div>
      <div class="decorative-border"></div>
      ${timer}
      <div class="question-text">${sanitizeHTML(questionText)}</div>
      ${answers}
      ${reaction}
    </div>
  `;
}

/**
 * Creates a timer component
 * @param {Object} options - Configuration options
 * @param {number} options.seconds - Initial seconds
 * @param {string} [options.id] - Element ID
 * @returns {string} HTML string
 */
export function createTimer({ seconds, id = 'timer' }) {
  return `
    <div id="${sanitizeHTML(id)}" class="timer">
      ⏳ ${seconds}s
    </div>
  `;
}

/**
 * Creates a reaction component
 * @param {Object} options - Configuration options
 * @param {string} [options.id] - Element ID
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createReaction({ id = 'reaction', className = '' }) {
  const classes = `reaction ${className}`.trim();
  
  return `
    <div id="${sanitizeHTML(id)}" class="${classes}"></div>
  `;
}

/**
 * Creates the council sidebar
 * @param {Object} options - Configuration options
 * @returns {string} HTML string
 */
export function createCouncilSidebar() {
  return `
    <div id="councilSidebar" class="council-sidebar">
      <div class="sidebar-header" onclick="game.toggleCouncilSidebar()">
        <div>
          <span class="sidebar-icon">⚔️</span>
          <span>Councils Offended</span>
          <span id="councilCount" class="council-count" style="display: none;">0</span>
        </div>
        <span class="sidebar-toggle-hint">Tap to toggle</span>
      </div>
      <div id="councilList" class="council-list">
        <!-- Council items will be added here dynamically -->
      </div>
    </div>

    <!-- Mobile floating notification -->
    <button id="councilFab" class="council-fab" onclick="game.toggleCouncilSidebar()" aria-label="Councils Offended">
      <span class="icon">⚔️</span>
      <span>Councils</span>
      <span id="councilFabCount" class="count">0</span>
    </button>
  `;
}

/**
 * Creates the main game container
 * @param {Object} options - Configuration options
 * @returns {string} HTML string
 */
export function createGameContainer() {
  return `
    <div class="container">
      <div class="parchment" id="gameContainer">
        <!-- Game content will be loaded here -->
      </div>
      ${createCouncilSidebar()}
    </div>
  `;
}

/**
 * Creates a decorative border
 * @returns {string} HTML string
 */
export function createDecorativeBorder() {
  return '<div class="decorative-border"></div>';
}

/**
 * Creates a loading indicator
 * @param {Object} options - Configuration options
 * @param {string} [options.text] - Loading text
 * @returns {string} HTML string
 */
export function createLoadingIndicator({ text = 'Loading' } = {}) {
  return `
    <div class="loading-indicator">
      <div class="loading-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
      <div class="loading-text">${sanitizeHTML(text)}</div>
    </div>
  `;
}

/**
 * Creates a progress bar
 * @param {Object} options - Configuration options
 * @param {number} options.percentage - Progress percentage (0-100)
 * @param {string} [options.id] - Element ID
 * @returns {string} HTML string
 */
export function createProgressBar({ percentage, id = 'progressBar' }) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  return `
    <div class="progress-bar" id="${sanitizeHTML(id)}">
      <div class="progress-bar-fill" style="width: ${clampedPercentage}%"></div>
    </div>
  `;
}

/**
 * Creates an error message component
 * @param {Object} options - Configuration options
 * @param {string} options.message - Error message
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 */
export function createErrorMessage({ message, className = '' }) {
  const classes = `error-message ${className}`.trim();
  
  return `
    <div class="${classes}">
      <div class="error-icon">⚠️</div>
      <div class="error-text">${sanitizeHTML(message)}</div>
      <button class="error-close" onclick="this.parentElement.remove()">×</button>
    </div>
  `;
}

/**
 * Creates a verdict screen component
 * @param {Object} options - Configuration options
 * @param {string} options.type - Verdict type: 'faithful', 'borderline', or 'doomed'
 * @param {string} options.title - Verdict title
 * @param {string} options.description - Verdict description
 * @param {string} options.details - Additional details
 * @param {Array} options.actions - Array of action buttons
 * @returns {string} HTML string
 */
export function createVerdictScreen({ type, title, description, details, actions = [] }) {
  const verdictClasses = `verdict-screen verdict-${type}`;
  const sealIcon = type === 'faithful' ? '✨' : type === 'borderline' ? '⚖️' : '💀';
  
  const actionsHTML = actions.map(action => createButton({
    text: action.text,
    onClick: action.onClick,
    className: action.className || ''
  })).join('');
  
  return createParchmentScroll({
    content: `
      ${createWaxSeal({ icon: sealIcon })}
      <div class="verdict-content">
        <h1 class="verdict-title">${sanitizeHTML(title)}</h1>
        <p class="verdict-description">${sanitizeHTML(description)}</p>
        <div class="verdict-details">${sanitizeHTML(details)}</div>
        <div class="verdict-actions">
          ${actionsHTML}
        </div>
      </div>
    `,
    className: verdictClasses
  });
}

/**
 * Creates a profile quiz component
 * @param {Object} options - Configuration options
 * @param {string} options.title - Quiz title
 * @param {string} options.description - Quiz description
 * @param {Array} options.questions - Array of profile questions
 * @param {Function} options.onComplete - Callback function
 * @returns {string} HTML string
 */
export function createProfileQuiz({ title, description, questions, onComplete }) {
  const questionsHTML = questions.map((question, index) => `
    <div class="profile-question" data-question="${index}">
      <h3>${sanitizeHTML(question.text)}</h3>
      <div class="profile-options">
        ${question.options.map(option => `
          <button 
            class="profile-option" 
            onclick="game.selectProfileOption(${index}, '${sanitizeHTML(option.value)}')"
          >
            ${sanitizeHTML(option.text)}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  return createParchment({
    content: `
      <div class="profile-quiz">
        <h2>${sanitizeHTML(title)}</h2>
        <p>${sanitizeHTML(description)}</p>
        <div class="profile-questions">
          ${questionsHTML}
        </div>
        <div class="profile-actions">
          <button class="button" onclick="${sanitizeHTML(onComplete)}()" disabled id="profileCompleteBtn">
            Begin Trial
          </button>
        </div>
      </div>
    `
  });
}

/**
 * Creates a council notification component
 * @param {Object} options - Configuration options
 * @param {string} options.council - Council name
 * @param {string} options.message - Notification message
 * @param {string} options.icon - Council icon
 * @param {string} [options.severity] - Severity level: 'warning', 'offended', 'severe'
 * @returns {string} HTML string
 */
export function createCouncilNotification({ council, message, icon, severity = 'warning' }) {
  const classes = `council-notification council-${severity}`;
  
  return `
    <div class="${classes}" data-council="${sanitizeHTML(council)}">
      <div class="council-icon">${sanitizeHTML(icon)}</div>
      <div class="council-content">
        <div class="council-name">${sanitizeHTML(council)}</div>
        <div class="council-message">${sanitizeHTML(message)}</div>
      </div>
      <button class="council-dismiss" onclick="this.parentElement.remove()">×</button>
    </div>
  `;
}

/**
 * Creates a difficulty selector component
 * @param {Object} options - Configuration options
 * @param {Array} options.difficulties - Array of difficulty options
 * @param {string} options.selected - Currently selected difficulty
 * @returns {string} HTML string
 */
export function createDifficultySelector({ difficulties, selected }) {
  const difficultiesHTML = difficulties.map(difficulty => `
    <button 
      class="difficulty-option ${difficulty.id === selected ? 'selected' : ''}" 
      onclick="game.selectDifficulty('${sanitizeHTML(difficulty.id)}')"
      data-difficulty="${sanitizeHTML(difficulty.id)}"
    >
      <div class="difficulty-icon">${sanitizeHTML(difficulty.icon)}</div>
      <div class="difficulty-info">
        <div class="difficulty-name">${sanitizeHTML(difficulty.name)}</div>
        <div class="difficulty-description">${sanitizeHTML(difficulty.description)}</div>
      </div>
    </button>
  `).join('');
  
  return createParchment({
    content: `
      <div class="difficulty-selector">
        <h2>Choose Your Trial</h2>
        <div class="difficulty-options">
          ${difficultiesHTML}
        </div>
        <div class="difficulty-actions">
          <button class="button button-primary" onclick="game.startGame()" disabled id="startGameBtn">
            Begin Trial
          </button>
        </div>
      </div>
    `
  });
}

/**
 * Creates a game statistics component
 * @param {Object} options - Configuration options
 * @param {Object} options.stats - Statistics object
 * @param {number} options.stats.questionsAnswered - Number of questions answered
 * @param {number} options.stats.councilsOffended - Number of councils offended
 * @param {number} options.stats.timeElapsed - Time elapsed in seconds
 * @param {string} options.stats.currentStanding - Current standing text
 * @returns {string} HTML string
 */
export function createGameStats({ stats }) {
  return `
    <div class="game-stats">
      <div class="stat-item">
        <div class="stat-label">Questions</div>
        <div class="stat-value">${stats.questionsAnswered}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Councils</div>
        <div class="stat-value">${stats.councilsOffended}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Time</div>
        <div class="stat-value">${Math.floor(stats.timeElapsed / 60)}:${(stats.timeElapsed % 60).toString().padStart(2, '0')}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Standing</div>
        <div class="stat-value">${sanitizeHTML(stats.currentStanding)}</div>
      </div>
    </div>
  `;
}

/**
 * Creates a question history component
 * @param {Object} options - Configuration options
 * @param {Array} options.history - Array of question history items
 * @returns {string} HTML string
 */
export function createQuestionHistory({ history }) {
  const historyHTML = history.map(item => `
    <div class="history-item ${item.offendedCouncils.length > 0 ? 'offensive' : ''}">
      <div class="history-question">${sanitizeHTML(item.question)}</div>
      <div class="history-answer ${item.answer.toLowerCase()}">${sanitizeHTML(item.answer)}</div>
      <div class="history-councils">
        ${item.offendedCouncils.map(council => `
          <span class="history-council">${sanitizeHTML(council)}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  return `
    <div class="question-history">
      <h3>Question History</h3>
      <div class="history-list">
        ${historyHTML}
      </div>
    </div>
  `;
}

/**
 * Creates a start screen component
 * @param {Object} options - Configuration options
 * @returns {string} HTML string
 */
export function createStartScreen() {
  return createParchmentScroll({
    content: `
      ${createWaxSeal({ icon: '⚔️' })}
      <div class="start-content">
        <h1 class="game-title">The Heretical Game</h1>
        <p class="game-subtitle">A Trial of Faith and Reason</p>
        <p class="game-description">
          You stand accused before the medieval councils. Your answers will determine your fate.
          Choose wisely, for the wrong answer may offend powerful institutions.
        </p>
        <div class="start-actions">
          ${createButton({ text: 'Begin Trial', onClick: 'game.showDifficultySelector()', className: 'button-primary' })}
          ${createButton({ text: 'How to Play', onClick: 'game.showInstructions()', className: 'button-secondary' })}
        </div>
      </div>
    `
  });
}

/**
 * Creates an instructions component
 * @param {Object} options - Configuration options
 * @returns {string} HTML string
 */
export function createInstructions() {
  return createParchment({
    content: `
      <div class="instructions">
        <h2>How to Play</h2>
        <div class="instruction-section">
          <h3>🎯 The Trial</h3>
          <p>Answer questions that challenge your beliefs and knowledge. Each answer may please or offend different medieval councils.</p>
        </div>
        <div class="instruction-section">
          <h3>⚔️ The Councils</h3>
          <p>Seven powerful councils watch your every word. Offend too many, and you may face severe consequences.</p>
        </div>
        <div class="instruction-section">
          <h3>📜 Your Fate</h3>
          <p>Your answers determine your final verdict. Will you be deemed faithful, borderline, or doomed?</p>
        </div>
        <div class="instruction-actions">
          ${createButton({ text: 'Start Trial', onClick: 'game.showDifficultySelector()', className: 'button-primary' })}
          ${createButton({ text: 'Back', onClick: 'game.showStartScreen()', className: 'button-secondary' })}
        </div>
      </div>
    `
  });
}

/**
 * Creates a council item for the sidebar
 * @param {Object} options - Configuration options
 * @param {string} options.name - Council name
 * @param {string} options.icon - Council icon
 * @param {string} options.description - Council description
 * @param {number} options.offenseLevel - Current offense level (0-3)
 * @returns {string} HTML string
 */
export function createCouncilItem({ name, icon, description, offenseLevel }) {
  const offenseClass = `offense-${Math.min(offenseLevel, 3)}`;
  
  return `
    <div class="council-item ${offenseClass}" data-council="${sanitizeHTML(name)}">
      <div class="council-header">
        <span class="council-icon">${sanitizeHTML(icon)}</span>
        <span class="council-name">${sanitizeHTML(name)}</span>
        <span class="offense-indicator">${'⚠️'.repeat(offenseLevel)}</span>
      </div>
      <div class="council-description">${sanitizeHTML(description)}</div>
    </div>
  `;
}

/**
 * Creates a toast notification component
 * @param {Object} options - Configuration options
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type: 'success', 'warning', 'error', 'info'
 * @param {number} [options.duration] - Auto-dismiss duration in milliseconds
 * @returns {string} HTML string
 */
export function createToast({ message, type = 'info', duration = 3000 }) {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  return `
    <div class="toast toast-${type}" data-duration="${duration}">
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${sanitizeHTML(message)}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    </div>
  `;
}

/**
 * Creates a modal dialog component
 * @param {Object} options - Configuration options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content
 * @param {Array} options.buttons - Array of button configurations
 * @param {string} [options.id] - Modal ID
 * @returns {string} HTML string
 */
export function createModal({ title, content, buttons = [], id = 'modal' }) {
  const buttonsHTML = buttons.map(button => createButton({
    text: button.text,
    onClick: button.onClick,
    className: button.className || ''
  })).join('');
  
  return `
    <div class="modal-overlay" id="${sanitizeHTML(id)}-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${sanitizeHTML(title)}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${buttonsHTML}
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a confirmation dialog component
 * @param {Object} options - Configuration options
 * @param {string} options.message - Confirmation message
 * @param {string} options.onConfirm - Confirm callback function
 * @param {string} options.onCancel - Cancel callback function
 * @returns {string} HTML string
 */
export function createConfirmDialog({ message, onConfirm, onCancel }) {
  return createModal({
    title: 'Confirm Action',
    content: `<p>${sanitizeHTML(message)}</p>`,
    buttons: [
      { text: 'Cancel', onClick: onCancel, className: 'button-secondary' },
      { text: 'Confirm', onClick: onConfirm, className: 'button-primary' }
    ]
  });
}

/**
 * Creates a retry dialog for failed operations
 * @param {Object} options - Configuration options
 * @param {string} options.message - Error message
 * @param {string} options.onRetry - Retry callback function
 * @param {string} options.onCancel - Cancel callback function
 * @returns {string} HTML string
 */
export function createRetryDialog({ message, onRetry, onCancel }) {
  return createModal({
    title: 'Operation Failed',
    content: `
      <div class="retry-content">
        <div class="retry-icon">⚠️</div>
        <p>${sanitizeHTML(message)}</p>
      </div>
    `,
    buttons: [
      { text: 'Cancel', onClick: onCancel, className: 'button-secondary' },
      { text: 'Retry', onClick: onRetry, className: 'button-primary' }
    ]
  });
}