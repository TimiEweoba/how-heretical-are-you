# Profile Quiz System - Feature Documentation

## 🎯 Overview
The Profile Quiz System adds personalized gameplay by assessing players before the main heretical trial. It intelligently routes players to appropriate difficulty levels and customizes questions based on their theological background.

## 📋 Profile Quiz Questions

### 1. Scripture Knowledge Assessment
**Question**: "How often dost thou search the Sacred Scriptures?"
- **Rarely or never** (0 points)
- **Sometimes at worship** (1 point)  
- **Often in personal study** (2 points)
- **Daily with commentaries** (3 points)

### 2. Church History Knowledge
**Question**: "Hast thou knowledge of the ancient Councils and their fiery debates?"
- **I know not of such matters** (0 points)
- **I have heard whispers of Nicaea** (1 point)
- **I know of great heresies like Arianism** (2 points)
- **I can debate Nestorianism at dinner** (3 points)

### 3. Theological Stream Identification
**Question**: "Which fold of Christendom dost thou most resemble?"
- **Roman Catholic Church** (tag: catholic)
- **Protestant Reformation** (tag: protestant)
- **Eastern Orthodox Church** (tag: orthodox)
- **Pentecostal & Charismatic** (tag: charismatic)
- **None - curious seeker** (tag: none)

### 4. Difficulty Preference
**Question**: "How severe shall thy doctrinal trial be?"
- **Gentle - spare me the torment** (difficulty: easy)
- **Moderate - test but show mercy** (difficulty: medium)
- **Severe - unleash the gauntlet!** (difficulty: hard)

## ⚙️ Routing Logic

### Knowledge Score Calculation
- **Total Score** = Q1 score + Q2 score (0-6 range)
- **0-2 points**: Routes to Easy Mode (15 questions)
- **3-4 points**: Routes to Medium Mode (10 questions)  
- **5-6 points**: Routes to Hard Mode (8 questions)

### Preference Override
- **Player's explicit choice** (Q4) overrides knowledge score
- Allows beginners to choose hard mode if desired
- Allows experts to choose easy mode for casual play

### Stream-Based Question Filtering

#### Catholic Stream
- **Councils**: Trent, Vatican I, Lateran IV, Florence
- **Topics**: Papal authority, transubstantiation, Marian doctrine
- **Mix**: 70% Catholic-relevant + 30% general questions

#### Protestant Stream  
- **Councils**: Worms, Trent (opposition), Reformation
- **Topics**: Sola scriptura, justification by faith, Luther
- **Mix**: 70% Protestant-relevant + 30% general questions

#### Orthodox Stream
- **Councils**: Seven Ecumenical Councils, Eastern theology
- **Topics**: Icons, Filioque, Chalcedon, Constantinople
- **Mix**: 70% Orthodox-relevant + 30% general questions

#### Charismatic Stream
- **Councils**: Pentecostal Practice, Contemporary Orthodoxy
- **Topics**: Tongues, prophecy, modern practices
- **Mix**: 70% Charismatic-relevant + 30% general questions

#### None/Seeker Stream
- **No filtering**: Full random selection from all questions
- **Broad exposure**: Equal chance for all theological topics

## 🎨 User Experience Flow

### 1. Welcome Screen
```
"By decree of the Holy Council, thou art summoned to answer questions 
of doctrine most grave. But first, we must know thy spiritual disposition..."

[Begin the Inquisition]
```

### 2. Profile Assessment
- 4 sequential questions with thematic medieval language
- Visual feedback with scroll icons and parchment styling
- Mobile-optimized button layouts

### 3. Profile Results Screen
```
"Thy Profile is Known"

Personalized message based on stream:
- Catholic: "Ah, a son/daughter of Rome! Let us see if thy allegiance..."
- Protestant: "A child of the Reformation! Thy sola scriptura shall be tested..."
- Orthodox: "From the Eastern Church! Let us examine thy adherence..."
- Charismatic: "A Pentecostal spirit! Thy gifts shall face scrutiny..."
- Seeker: "A curious seeker! Let us discover thy sympathies..."

[Face Thy Judgment]
```

### 4. Main Game
- Questions filtered by theological stream (70/30 mix)
- Difficulty set by knowledge + preference
- Enhanced timer functionality
- Mobile-optimized interface

### 5. Final Verdict
- Includes theological stream in results
- Personalized council verdicts
- Stream-aware flavor text

## 🔧 Technical Implementation

### Data Structure
```json
{
  "profileQuiz": [
    {
      "id": 1,
      "question": "How often dost thou search the Sacred Scriptures?",
      "options": [
        { "text": "Rarely or never...", "score": 0 },
        { "text": "Sometimes at worship...", "score": 1 }
      ]
    }
  ]
}
```

### JavaScript Functions
- `startProfileQuiz()`: Initializes profile assessment
- `showProfileQuestion()`: Displays current question
- `answerProfileQuestion()`: Processes answer and advances
- `processProfileResults()`: Calculates routing
- `filterQuestionsByStream()`: Customizes question pool
- `showPersonalizedIntro()`: Shows tailored intro

### Mobile Optimizations
- Responsive button sizing
- Touch-friendly interactions
- Condensed text for mobile screens
- Optimized animations

## 📊 Benefits

### For Players
- **Personalized Experience**: Questions match their background
- **Appropriate Difficulty**: No more too-easy or too-hard trials
- **Engaging Narrative**: Feels like a real medieval inquisition
- **Educational Value**: Learn about different Christian traditions

### For Engagement
- **Replay Value**: Different streams = different experiences
- **Accessibility**: Beginners aren't overwhelmed
- **Depth**: Experts get challenging content
- **Immersion**: Thematic language enhances atmosphere

## 🚀 Deployment Ready

The profile quiz system is fully integrated with:
- ✅ Mobile responsiveness
- ✅ Timer functionality  
- ✅ Question filtering
- ✅ Fallback systems
- ✅ Error handling
- ✅ Vercel compatibility

Ready for deployment with enhanced user experience!
