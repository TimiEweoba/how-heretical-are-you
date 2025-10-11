# Question Pool Expansion Guide

## ✅ What's Already Implemented

1. **Fisher-Yates shuffle** - Questions randomized each session
2. **localStorage tracking** - Used questions tracked across sessions  
3. **No repeats within session** - Questions popped from shuffled array
4. **Pool exhaustion handling** - Dramatic reset message when all questions used
5. **Session-based management** - Questions marked as used after selection

## 📊 Current Pool Status

- **Easy**: 30 questions (need 70+ more to reach 100+)
- **Medium**: 30 questions (need 120+ more to reach 150+)
- **Hard**: 30 questions (need 170+ more to reach 200+)

## 🎯 How to Expand

### Option 1: Use AI to Generate
Ask an AI to generate questions in this format:
```json
{
  "id": 31,
  "text": "Question text here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "Correct answer",
  "council": "Nicaea",
  "heresyPoints": 1,
  "timeLimit": 30
}
```

### Option 2: Manual Addition
1. Open `public/questions.json`
2. Add questions to the appropriate difficulty array
3. Ensure each has a unique `id` within its difficulty level
4. Follow the existing format exactly

### Option 3: Gradual Growth
Start with current 30/30/30 pool. The localStorage system prevents repeats, so even with smaller pools:
- Players won't see repeats in same session (10 questions)
- Players won't see same questions across multiple sessions
- When pool exhausted, dramatic reset message appears

## 🔑 Key Implementation Details

**In `heretical-game.html`:**
- `getFreshQuestions()` - Filters out used questions
- `markQuestionAsUsed()` - Tracks in localStorage
- `resetUsedQuestions()` - Clears when pool exhausted
- `showPoolResetMessage()` - Displays dramatic message

**localStorage key:**
- `usedQuestions` (stores array of `${difficulty}_${id}` for global tracking across difficulties)

## 📝 Sample Questions to Add

See `additional-questions.json` for 75 easy questions ready to merge.

For Medium/Hard, follow similar theological depth patterns from existing questions.
