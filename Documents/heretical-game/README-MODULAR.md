# The Heretical Game - Modular Architecture

A comprehensive refactoring of "The Heretical Game" into a modern, modular JavaScript architecture with ES6 modules, advanced error handling, performance monitoring, and comprehensive testing.

## 🎯 Overview

This refactoring transforms the original monolithic game into a well-structured, maintainable application with:

- **Modular Architecture**: ES6 modules with clear separation of concerns
- **Advanced Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Performance Monitoring**: Real-time performance tracking and optimization
- **Security**: XSS protection through HTML sanitization
- **Testing**: Unit and integration tests for all modules
- **Responsive Design**: Mobile-optimized with accessibility features

## 📁 File Structure

```
heretical-game/
├── src/
│   ├── css/                    # Component-based CSS architecture
│   │   ├── main.css           # Core variables and utilities
│   │   ├── components.css     # Reusable UI components
│   │   ├── buttons.css        # Button variations and states
│   │   ├── verdict.css        # Verdict screen animations
│   │   ├── sidebar.css        # Council sidebar and mobile FAB
│   │   ├── typography.css     # Font hierarchy and medieval styling
│   │   └── error-handling.css # Error notifications and debugging
│   ├── js/
│   │   ├── modules/           # Core game modules (ES6)
│   │   │   ├── game-engine.js      # Central orchestration
│   │   │   ├── state-manager.js    # State persistence and management
│   │   │   ├── dom-manager.js      # DOM manipulation and UI updates
│   │   │   ├── question-manager.js   # Question loading and logic
│   │   │   ├── council-manager.js    # Council reactions and notifications
│   │   │   ├── verdict-calculator.js # Final verdict calculation
│   │   │   ├── error-handler.js      # Comprehensive error handling
│   │   │   ├── performance-monitor.js # Performance tracking
│   │   │   ├── event-emitter.js      # Event system
│   │   │   └── module-loader.js      # Advanced module loading
│   │   ├── templates/         # HTML template system
│   │   │   └── html-templates.js # XSS-safe template functions
│   │   └── app.js            # Main application entry point
│   └── data/                 # External data files
│       ├── councils.json     # Council definitions
│       └── questions-modular.json # Question database
├── tests/                    # Test suite
│   └── test-modules.js       # Module tests
├── index-modular.html       # Main application HTML
├── test-modules.html        # Test runner HTML
└── README.md               # This file
```

## 🏗️ Architecture

### Core Modules

#### GameEngine (`game-engine.js`)
- **Purpose**: Central orchestration of all game functionality
- **Responsibilities**: 
  - Initialize and coordinate all subsystems
  - Manage game lifecycle (start, play, end)
  - Handle game state transitions
  - Coordinate between managers
- **Key Features**:
  - Event-driven architecture
  - Performance monitoring integration
  - Auto-save functionality
  - Comprehensive error handling

#### StateManager (`state-manager.js`)
- **Purpose**: Manage game state and persistence
- **Responsibilities**:
  - State storage and retrieval
  - LocalStorage persistence with encryption/compression
  - State validation and migration
  - History tracking
- **Key Features**:
  - Dot-notation state access
  - Automatic change detection
  - Configurable compression and encryption
  - State import/export

#### DOMManager (`dom-manager.js`)
- **Purpose**: Handle all DOM operations and UI updates
- **Responsibilities**:
  - DOM manipulation and updates
  - Event handling and delegation
  - Mobile optimizations
  - Animation management
- **Key Features**:
  - Document fragment optimization
  - Touch event support
  - Responsive design handling
  - Accessibility features

#### QuestionManager (`question-manager.js`)
- **Purpose**: Manage question data and logic
- **Responsibilities**:
  - Question loading and caching
  - Question selection and progression
  - Answer validation
  - Question difficulty management
- **Key Features**:
  - External data loading
  - Question shuffling
  - Caching with expiry
  - Fallback to built-in questions

#### CouncilManager (`council-manager.js`)
- **Purpose**: Manage council reactions and notifications
- **Responsibilities**:
  - Council data management
  - Reaction calculation
  - Notification display
  - Council state tracking
- **Key Features**:
  - Configurable notification system
  - Council tolerance levels
  - Severity-based reactions
  - Mobile-optimized notifications

#### VerdictCalculator (`verdict-calculator.js`)
- **Purpose**: Calculate final game verdicts
- **Responsibilities**:
  - Analyze player responses
  - Calculate heresy points
  - Determine verdict category
  - Generate recommendations
- **Key Features**:
  - Configurable thresholds
  - Multiple verdict categories
  - Detailed analysis
  - Personalized recommendations

### Error Handling (`error-handler.js`)
- **Global Error Handling**: Catches all JavaScript errors
- **User Notifications**: Shows user-friendly error messages
- **Error Categorization**: Classifies errors by severity
- **Error Statistics**: Tracks error frequency and patterns
- **Recovery Mechanisms**: Attempts automatic recovery where possible

### Performance Monitoring (`performance-monitor.js`)
- **Real-time Metrics**: FPS, memory usage, response times
- **Performance Warnings**: Alerts for performance issues
- **Long Task Detection**: Identifies blocking operations
- **Network Monitoring**: Tracks resource loading performance
- **Custom Metrics**: Extensible metric collection

### Template System (`html-templates.js`)
- **XSS Protection**: Comprehensive HTML sanitization
- **Reusable Components**: Modular template functions
- **Type Safety**: Input validation and sanitization
- **Accessibility**: ARIA attributes and semantic HTML
- **Responsive Design**: Mobile-first template structure

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- Local web server (for CORS compliance)
- Node.js (for development and testing)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone [repository-url]
   cd heretical-game
   ```

2. **Start a local web server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open the application**
   Navigate to `http://localhost:8000/index-modular.html`

### Testing

Run the comprehensive test suite:

1. **Open the test runner**
   Navigate to `http://localhost:8000/test-modules.html`

2. **Run tests**
   Click "Run All Tests" to execute the complete test suite

3. **View results**
   Check test results and performance metrics

## 🔧 Configuration

### Game Configuration
```javascript
const gameConfig = {
  debug: true,                           // Enable debug logging
  enablePerformanceMonitoring: true,     // Enable performance tracking
  enableErrorHandling: true,             // Enable error handling
  autoSaveInterval: 30000,               // Auto-save frequency (ms)
  maxQuestionHistory: 50,                // Maximum question history
  enableCaching: true,                   // Enable module caching
  enablePreloading: true                 // Enable module preloading
};
```

### Performance Thresholds
```javascript
const performanceConfig = {
  fpsThreshold: 30,                      // Minimum acceptable FPS
  memoryThreshold: 100 * 1024 * 1024,  // Memory usage threshold (bytes)
  responseTimeThreshold: 1000,          // Maximum response time (ms)
  metricsInterval: 1000,                // Metrics collection interval (ms)
  maxMetricsHistory: 1000               // Maximum metrics history
};
```

### Error Handling Configuration
```javascript
const errorConfig = {
  enableGlobalHandlers: true,            // Enable global error handlers
  enableConsoleLogging: true,           // Enable console error logging
  enableUserNotifications: true,       // Show user error notifications
  maxErrors: 100,                       // Maximum error history
  errorExpirationTime: 3600000        // Error expiration time (ms)
};
```

## 🎮 Features

### Core Game Features
- **Multiple Difficulty Levels**: Easy, Medium, Hard, Expert
- **Council System**: Seven historical councils with unique reactions
- **Verdict System**: Three possible verdicts (Faithful, Borderline, Doomed)
- **Question Categories**: Doctrine, Scripture, Tradition, History, Ethics, Practice
- **Timer System**: Configurable time limits per question
- **Progress Tracking**: Detailed game statistics and history

### Advanced Features
- **Auto-save**: Automatic game state persistence
- **Performance Monitoring**: Real-time performance metrics
- **Error Recovery**: Graceful error handling and recovery
- **Mobile Optimization**: Touch-friendly interface
- **Accessibility**: Screen reader support and keyboard navigation
- **Responsive Design**: Adapts to all screen sizes

### Security Features
- **XSS Protection**: Comprehensive HTML sanitization
- **Input Validation**: All user inputs are validated
- **Secure Storage**: Encrypted localStorage with compression
- **Error Sanitization**: User errors don't expose internal details

## 📊 Performance Optimizations

### Code Splitting
- Modules loaded on-demand
- Critical modules preloaded
- Lazy loading for non-critical components

### DOM Optimization
- Document fragments for bulk updates
- Event delegation for efficient event handling
- Virtual scrolling for large lists
- Minimal DOM manipulation

### Memory Management
- Automatic cleanup of unused objects
- WeakMap usage for non-blocking references
- Periodic garbage collection hints
- Memory leak detection

### Network Optimization
- Module caching with expiry
- Service Worker for offline functionality
- Resource preloading
- Compression for large data files

## 🧪 Testing

### Unit Tests
- Individual module testing
- Function-level validation
- Edge case coverage
- Mock data and dependencies

### Integration Tests
- Module interaction testing
- End-to-end game flow
- Error scenario testing
- Performance benchmarking

### Test Categories
- **Module Tests**: Core functionality validation
- **Template Tests**: XSS protection and HTML generation
- **Error Tests**: Error handling and recovery
- **Performance Tests**: Performance monitoring validation
- **Integration Tests**: Complete game flow testing

## 🚀 Deployment

### Static Hosting
The application can be deployed to any static hosting service:

- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Repository-based hosting
- **AWS S3**: Cloud storage hosting

### Build Process
No build process required - the application runs directly from source files.

### Environment Configuration
Configure environment-specific settings in `app.js`:

```javascript
const environmentConfig = {
  development: {
    debug: true,
    enablePerformanceMonitoring: true,
    enableErrorHandling: true
  },
  production: {
    debug: false,
    enablePerformanceMonitoring: false,
    enableErrorHandling: true
  }
};
```

## 🔧 Development

### Adding New Modules

1. **Create module file** in `src/js/modules/`
2. **Export module functions/classes**
3. **Add to module loader** if needed
4. **Write tests** in `tests/`
5. **Update documentation**

### Adding New Questions

1. **Edit question files** in `src/data/`
2. **Follow JSON schema** for consistency
3. **Test question loading**
4. **Verify council reactions**

### Styling Changes

1. **Edit CSS files** in `src/css/`
2. **Use CSS variables** for consistency
3. **Test responsive design**
4. **Verify accessibility**

## 📈 Performance Metrics

### Key Performance Indicators
- **FPS**: Target 60 FPS, minimum 30 FPS
- **Memory Usage**: Monitor for leaks and spikes
- **Load Time**: Sub-second initial load
- **Response Time**: < 100ms for user interactions
- **Bundle Size**: Minimal for fast loading

### Monitoring Tools
- Built-in performance monitor
- Browser DevTools integration
- Custom performance metrics
- Real-time performance alerts

## 🔒 Security Considerations

### XSS Protection
- All HTML content sanitized
- Template system with built-in protection
- Input validation on all user data
- Safe DOM manipulation practices

### Data Security
- Encrypted localStorage
- No sensitive data in URLs
- Secure error handling
- Privacy-conscious analytics

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

## 🤝 Contributing

### Development Guidelines
- Follow ES6 module patterns
- Write comprehensive tests
- Document all public APIs
- Maintain backward compatibility

### Code Style
- Use consistent indentation (2 spaces)
- Descriptive variable and function names
- Comprehensive error handling
- Performance-conscious code

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Update documentation
5. Submit pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original game concept and questions
- Medieval typography inspiration
- CSS animation techniques
- Modern JavaScript best practices

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases for examples
- Examine source code for implementation details

---

**The Heretical Game - Modular Edition** - A modern, secure, and performant implementation of the classic theological quiz game.