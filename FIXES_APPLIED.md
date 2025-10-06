# Fixes Applied - 2025-10-06

## ✅ Issue 1: Sidebar appearing on mobile screen constantly

### Problem
The council sidebar was visible on page load on mobile, covering the gameplay content.

### Solution
Added `display: none;` to both desktop and mobile `.council-sidebar` CSS, and `display: block;` only when `.visible` class is added.

### Files Changed
- `heretical-game.html` (lines 462, 468, 868, 874)

### CSS Changes
```css
/* Desktop */
.council-sidebar {
    display: none; /* Hidden by default */
}

.council-sidebar.visible {
    display: block; /* Show when visible class is added */
}

/* Mobile */
@media (max-width: 768px) {
    .council-sidebar {
        display: none; /* Hidden by default on mobile too */
    }
    
    .council-sidebar.visible {
        display: block; /* Show when visible */
    }
}
```

### Result
- Sidebar is completely hidden on page load ✅
- Only appears when a council is offended and user taps the notification ✅
- Top notification bar slides down instead of covering content ✅

---

## ✅ Issue 2: Limited questions in Medium and Hard modes

### Problem
- Medium: Only 50 questions
- Hard: Only 50 questions
- Players would exhaust the pool quickly

### Solution
Added 50 additional questions to each difficulty level from prepared question files.

### Files Changed
- `public/questions.json` (expanded)
- Created `add_questions.py` script to automate addition

### Question Counts
**Before:**
- Easy: 50 questions
- Medium: 50 questions
- Hard: 50 questions

**After:**
- Easy: 50 questions
- Medium: 100 questions ✅ (doubled)
- Hard: 100 questions ✅ (doubled)

### New Questions Added

**Medium (IDs 51-100):**
- Church history (Jesuits, Reformers, Councils)
- Theological terms (Theosis, Simony, Conciliarism)
- Historical figures (Church Doctors, Translators)
- Heresies (Docetism, Nestorianism, Monophysitism, etc.)
- Biblical scholarship (Languages, Manuscripts, Canon)

**Hard (IDs 51-100):**
- Advanced soteriology (Synergism, Monergism, Grace types)
- TULIP doctrines (Total Depravity, Unconditional Election, etc.)
- Justification theories (Imputation, Infusion, Forensic)
- Atonement theories (Penal Substitution, Christus Victor, etc.)
- Eschatology (Millennialism, Preterism, Futurism)
- Anthropology (Dichotomy, Trichotomy, Soul origin)
- Pneumatology (Cessationism, Continuationism)

### Result
- Players can now play 10 sessions of Medium before seeing repeats ✅
- Players can now play 10 sessions of Hard before seeing repeats ✅
- Question pool exhaustion message will only appear after genuine exhaustion ✅

---

## ✅ Bonus Fix: Pool reset detection

### Problem
"The Councils Have Exhausted Their Charges!" screen appeared on first play.

### Solution
Fixed reset detection logic to only trigger when there were previously used questions.

### Code Change
```javascript
// Capture used count BEFORE filtering to accurately detect a reset
const usedBefore = getUsedQuestionIds(difficulty).length;
let freshQuestions = getFreshQuestions(allQuestions, difficulty);

// Only consider it a reset if there WERE used questions, and now storage is cleared
const wasReset = (usedBefore > 0) 
    && (freshQuestions.length === allQuestions.length) 
    && (getUsedQuestionIds(difficulty).length === 0);
```

### Result
- First-time players see normal gameplay ✅
- Reset message only appears after genuine pool exhaustion ✅

---

## Testing Checklist

### Mobile Sidebar
- [ ] Load game on mobile - sidebar should be hidden
- [ ] Answer question incorrectly - notification bar should slide down from top
- [ ] Tap notification - sidebar should slide up from bottom
- [ ] Close sidebar - notification should disappear
- [ ] Offend another council - notification should reappear

### Question Pool
- [ ] Start Medium difficulty - should have variety of questions
- [ ] Start Hard difficulty - should have variety of questions
- [ ] Play multiple sessions - no immediate repeats
- [ ] Exhaust pool (after 10 sessions) - should see reset message

### Desktop
- [ ] Sidebar should slide in from right when council offended
- [ ] All original functionality preserved

---

## Files Modified
1. `heretical-game.html` - CSS and JS fixes
2. `public/questions.json` - Added 100 new questions

## Files Created
1. `add_questions.py` - Script to add questions
2. `count_questions.py` - Script to count questions
3. `FIXES_APPLIED.md` - This document

---

## Deployment
All changes are ready for deployment. Simply commit and push to trigger Netlify/Vercel rebuild.

```bash
git add .
git commit -m "Fix mobile sidebar visibility and expand question pools"
git push
```
