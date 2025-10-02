# Offended Councils Sidebar Feature

## Overview
A dynamic sidebar that tracks and displays councils offended during gameplay, creating ongoing dramatic tension throughout the inquisition.

## Key Features

### 1. **Slides In Dynamically**
- Hidden by default (off-screen to the right)
- **Slides in** when the first council is offended
- Remains visible throughout the game session
- Smooth animation using CSS transitions

### 2. **Running Tally**
- Each council appears as a separate item in the sidebar
- Shows council name in **gold text**
- Displays number of offenses in **red text**
- Updates in real-time as player continues to offend

### 3. **Visual Design**
- Dark medieval theme (brown/leather color scheme)
- ⚠️ Warning icon for each council
- ⚔️ Sword icon in header
- Scrollable if many councils are offended
- Medieval serif font (Cinzel)

### 4. **Behavior**
- **First offense**: Sidebar slides into view
- **Subsequent offenses** to same council: Count increments
- **New council offended**: New item added with animation
- **Game end**: Sidebar remains visible during verdict
- **New game**: Sidebar clears and hides

## Visual Examples

### Sidebar Appearance
```
┌─────────────────────────┐
│     ⚔️                  │
│  Councils Offended      │
├─────────────────────────┤
│ ⚠️ Nicaea               │
│    2 offenses           │
├─────────────────────────┤
│ ⚠️ Chalcedon            │
│    1 offense            │
├─────────────────────────┤
│ ⚠️ Trent                │
│    3 offenses           │
└─────────────────────────┘
```

## Technical Implementation

### HTML Structure
```html
<div id="councilSidebar" class="council-sidebar">
    <div class="sidebar-header">
        <span class="sidebar-icon">⚔️</span>
        <h3>Councils Offended</h3>
    </div>
    <div id="councilList" class="council-list">
        <!-- Council items added dynamically -->
    </div>
</div>
```

### CSS Key Classes
- `.council-sidebar` - Main container (fixed position, right side)
- `.council-sidebar.visible` - Slides into view
- `.council-item` - Individual council entry
- `.council-item-name` - Council name (gold)
- `.council-item-count` - Offense count (red)

### JavaScript Functions

#### `showCouncilSidebar()`
Shows the sidebar by adding `.visible` class

#### `hideCouncilSidebar()`
Hides the sidebar by removing `.visible` class

#### `addCouncilToSidebar(council, points)`
- Adds new council or updates existing one
- Parameters:
  - `council` - Council name
  - `points` - Number of heresy points accumulated
- Shows sidebar if first council
- Animates new council entry

#### `clearCouncilSidebar()`
Clears all councils and hides sidebar (called at game start)

### Integration Points

1. **Answer Functions** (`answerMultipleChoice`, `answer`, `handleTimeout`)
   - Call `addCouncilToSidebar()` when heresy points added
   - Updates occur in real-time

2. **Start Game** (`startGame`)
   - Calls `clearCouncilSidebar()` to reset for new game

3. **Automatic Updates**
   - Council count increments automatically
   - No manual refresh needed

## User Experience Flow

1. **Game starts** - Sidebar is hidden
2. **First wrong answer** - Sidebar slides in with first council
3. **More wrong answers**:
   - Same council → Count increments
   - Different council → New item appears
4. **Throughout game** - Sidebar persists as running reminder
5. **Game ends** - Sidebar stays visible during verdict
6. **New game** - Sidebar clears and hides

## Styling Details

### Colors
- Background: Dark brown gradient (`#3E2723` to `#5D4037`)
- Border: Saddle brown (`#8B4513`)
- Council names: Gold (`#FFD700`)
- Offense counts: Light red (`#FF6B6B`)
- Text: Parchment color (`#F4E8D0`)

### Animations
- **Slide in**: 0.5s ease-in-out
- **Council item**: Slide from right with fade

### Responsive Design
- Desktop: 320px width
- Mobile: 250px width
- Scrollable if many councils (max-height: 80vh)

## Performance Notes
- Minimal DOM manipulation (updates existing elements when possible)
- CSS animations use GPU acceleration
- No polling or timers (event-driven updates)
- Lightweight (no dependencies)

## Future Enhancements (Optional)
- [ ] Sound effect when council added
- [ ] Pulse/glow animation when count increments
- [ ] Different colors per severity level
- [ ] Click to see council's full condemnation message
- [ ] Toggle button to hide/show sidebar manually
- [ ] Export offended councils list at game end

## Testing Checklist
- [x] Sidebar hidden at game start
- [x] Sidebar appears on first offense
- [x] Council count increments correctly
- [x] Multiple councils tracked simultaneously
- [x] Sidebar clears on new game
- [x] Responsive on mobile devices
- [x] Smooth animations
- [x] Scrollable with many councils

---

**Status**: ✅ Fully Implemented and Functional

Test it now by playing the game and making some "heretical" choices! The sidebar will slide in to track your offenses in real-time.
