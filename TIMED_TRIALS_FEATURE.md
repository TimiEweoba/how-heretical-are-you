# Timed Trials & Council Reactions Feature

## Overview
This feature adds dramatic urgency and immersion to the Heretical Game by introducing:
- **Countdown timers** for questions (optional per question)
- **Live council reactions** to answers (correct, incorrect, or timeout)
- **Orthodox points** tracking alongside heresy points
- **Immersive feedback** with medieval-themed animations

---

## JSON Schema

### New Optional Fields Per Question

```json
{
  "id": 1,
  "text": "What is the term for the belief that Jesus is of the same substance as the Father?",
  "options": ["Arianism", "Homoousios", "Nestorianism", "Monophysitism"],
  "answer": "Homoousios",
  "council": "Nicaea",
  "heresyPoints": 1,
  "timeLimit": 30,
  "verdictMapping": {
    "correct": {
      "orthodoxPoints": 1,
      "heresyPoints": 0,
      "note": "Affirms the Nicene definition of Christ's divinity.",
      "reactionMessage": "The Council of Nicaea nods solemnly — orthodoxy preserved."
    },
    "incorrect": {
      "orthodoxPoints": 0,
      "heresyPoints": 2,
      "note": "Dangerously close to Arian heresy.",
      "reactionMessage": "The Council of Nicaea scowls — whispers of Arianism echo in the chamber!"
    },
    "timeout": {
      "orthodoxPoints": 0,
      "heresyPoints": 1,
      "note": "Hesitation on the core doctrine of Trinity is suspicious.",
      "reactionMessage": "The bishops murmur: 'Why so silent on the Son's nature? Suspicion grows…'"
    }
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timeLimit` | number | No | Seconds allowed to answer. If omitted, no timer shown |
| `verdictMapping` | object | No | Custom reactions for correct/incorrect/timeout outcomes |
| `verdictMapping.correct` | object | No | Response when answer is correct |
| `verdictMapping.incorrect` | object | No | Response when answer is wrong |
| `verdictMapping.timeout` | object | No | Response when timer expires |
| `orthodoxPoints` | number | No | Points awarded for orthodox behavior |
| `heresyPoints` | number | No | Points added to heresy score |
| `reactionMessage` | string | No | Council's live feedback to player |
| `note` | string | No | Internal documentation (not shown to player) |

---

## Implementation Details

### JavaScript Logic

#### 1. Timer System
```javascript
function startQuestionTimer(seconds) {
    let timeLeft = seconds;
    const timerElement = document.getElementById('timer');
    
    function updateTimer() {
        if (timeLeft <= 0) {
            handleTimeout();
            return;
        }
        
        timerElement.innerText = `⏳ ${timeLeft}s`;
        if (timeLeft <= 5) {
            timerElement.style.color = '#8B0000'; // Red warning
        }
        
        timeLeft--;
        questionTimer = setTimeout(updateTimer, 1000);
    }
    
    updateTimer();
}
```

#### 2. Timeout Handling
```javascript
function handleTimeout() {
    clearQuestionTimer();
    const question = currentQuestions[currentQuestion];
    
    // Use custom timeout verdict if available
    let reactionMessage = "The bishops murmur: 'Why so silent? Suspicion grows…'";
    let heresyPointsToAdd = 1;
    
    if (question.verdictMapping?.timeout) {
        reactionMessage = question.verdictMapping.timeout.reactionMessage;
        heresyPointsToAdd = question.verdictMapping.timeout.heresyPoints || 1;
    }
    
    // Update scores and show reaction
    globalScore += heresyPointsToAdd;
    showReaction(reactionMessage);
    
    // Move to next question after 3 seconds
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 3000);
}
```

#### 3. Council Reaction Display
```javascript
function showReaction(message) {
    const reactionBox = document.getElementById('reaction');
    if (!reactionBox) return;
    
    reactionBox.innerText = message;
    reactionBox.classList.add('show');
    
    setTimeout(() => {
        reactionBox.classList.remove('show');
    }, 2500);
}
```

### CSS Styling

#### Timer Element
```css
.timer {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    color: #8B4513;
    text-align: center;
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(139, 69, 19, 0.1);
    border: 2px solid #8B4513;
    border-radius: 5px;
    font-weight: 600;
    transition: all 0.3s ease;
}
```

#### Reaction Scroll
```css
.reaction {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    margin-top: 20px;
    padding: 15px 20px;
    font-style: italic;
    color: #5D4037;
    background: rgba(245, 222, 179, 0.8);
    border: 2px solid #8B4513;
    border-radius: 5px;
    text-align: center;
    font-size: 1em;
    font-family: 'Cinzel', serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.reaction.show {
    opacity: 1;
    animation: fadeInScale 0.5s ease-in-out;
}

@keyframes fadeInScale {
    from { 
        opacity: 0; 
        transform: scale(0.9); 
    }
    to { 
        opacity: 1; 
        transform: scale(1); 
    }
}
```

---

## Gameplay Experience

### Before: Simple Q&A
- Player reads question
- Selects answer
- Immediately moves to next question
- Generic "correct/incorrect" feedback

### After: Immersive Inquisition
- ⏳ **Clock is ticking** — visible countdown creates urgency
- 🎭 **Councils react** — personalized feedback from historical councils
- ⚡ **Consequences for silence** — timeout is treated as suspicion
- 🏛️ **Dramatic pacing** — 3-second pause to read council reactions

### Example Flow

1. **Question loads** with 30-second timer at the top
2. **Timer counts down**, turning red at 5 seconds
3. **Player answers** (or timer expires)
4. **Council reaction appears** in parchment scroll:
   - ✅ Correct: "The Council of Nicaea nods solemnly — orthodoxy preserved."
   - ❌ Incorrect: "The Council of Nicaea scowls — whispers of Arianism echo!"
   - ⏱️ Timeout: "The bishops murmur: 'Why so silent? Suspicion grows…'"
5. **3-second pause** to read the reaction
6. **Next question loads**

---

## How to Use

### Adding Timed Questions

1. **Add `timeLimit` field** (in seconds):
   ```json
   "timeLimit": 30
   ```

2. **Add `verdictMapping` for custom reactions** (optional):
   ```json
   "verdictMapping": {
     "correct": {
       "orthodoxPoints": 1,
       "heresyPoints": 0,
       "reactionMessage": "Well done! The council approves."
     },
     "incorrect": {
       "orthodoxPoints": 0,
       "heresyPoints": 2,
       "reactionMessage": "The council gasps at your error!"
     },
     "timeout": {
       "orthodoxPoints": 0,
       "heresyPoints": 1,
       "reactionMessage": "Your silence is noted... suspiciously."
     }
   }
   ```

### Backward Compatibility

- **Old questions without timers** continue to work normally
- **No timer = no timeout** — question displays indefinitely
- **No verdictMapping** — falls back to generic reactions:
  - Correct: "The council nods in approval."
  - Incorrect: "The council frowns at your error."

---

## Current Implementation Status

### ✅ Completed
- Timer countdown system with visual feedback
- Timeout detection and handling
- Council reaction display with animations
- CSS styling for medieval theme
- `verdictMapping` schema support
- Orthodox points tracking

### 📝 Example Questions Added
- **Medium Mode**: 2 questions with timers (questions 1-2)
- **Hard Mode**: 3 questions with timers (questions 1-3)

### 🎯 Suggested Enhancements
- Add timer to all Hard Mode questions (currently ~10% have timers)
- Add timer to challenging Medium Mode questions
- Create "Lightning Round" mode with 10-second timers for all questions
- Add running sidebar showing "angered councils" throughout game
- Add sound effects for timer warnings (optional)

---

## Testing

1. **Start server**: `python serve.py`
2. **Open game**: `http://localhost:8000/heretical-game.html`
3. **Select Medium or Hard Mode**
4. **Observe**: First 2-3 questions will have timers
5. **Try all outcomes**:
   - Answer correctly (see approval)
   - Answer incorrectly (see condemnation)
   - Let timer expire (see timeout reaction)

---

## Performance Notes

- Timer uses `setTimeout` (lightweight, no performance impact)
- Reactions fade in/out with CSS animations (GPU-accelerated)
- No additional HTTP requests or dependencies
- All logic runs client-side

---

## Summary

This feature transforms the game from a simple quiz into an **immersive medieval inquisition** where:
- Every question feels urgent with the clock ticking
- Councils react dynamically to your answers
- Silence is suspicious, not just wrong answers
- Historical flavor text brings the councils to life

The implementation is **clean, modular, and backward-compatible**, allowing you to gradually add timers and reactions to questions without breaking existing content.
