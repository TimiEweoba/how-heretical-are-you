# How Heretical Are You? - A Trial of Doctrine

An interactive theological quiz game that tests your knowledge of orthodox Christian doctrine through the lens of various church councils throughout history.

## Features

### 🎯 Three Difficulty Levels
- **Easy Trial**: Basic doctrines about the Trinity, Christ's nature, and fundamental beliefs
- **Moderate Trial**: Theological nuances including papal authority, transubstantiation, and iconography
- **Severe Trial**: Esoteric theological concepts like essence-energies distinction and predestination

### ⚖️ Dynamic Verdict System
- Your heresies are tracked by the specific councils you've offended
- Each wrong answer is tied to a historical church council
- Receive condemnations from the actual councils whose doctrines you've violated
- Verdicts range from "Orthodox Champion" to "Arch-Heretic"

### 📜 Historical Councils Featured
- Council of Nicaea (325 AD) - Trinity and Christ's divinity
- Council of Chalcedon (451 AD) - Christ's two natures
- Council of Constantinople (various) - Holy Spirit, Christ's will
- Council of Trent (1545-1563) - Counter-Reformation doctrines
- And many more!

## How to Play

### Method 1: Direct File Opening
Simply open `heretical-game.html` in your web browser. 

**Note**: Some browsers may block loading the questions from the JSON file due to CORS policies. If the questions don't load, use Method 2.

### Method 2: Local Server (Recommended)
1. Make sure you have Python installed
2. Run the server script:
   ```bash
   python serve.py
   ```
3. The game will automatically open in your browser at `http://localhost:8000/heretical-game.html`

### Method 3: Manual Python Server
1. Open a terminal in the game directory
2. Run one of these commands:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
3. Open your browser to `http://localhost:8000/heretical-game.html`

## File Structure

```
heretical-game/
├── heretical-game.html    # Main game file
├── public/
│   └── questions.json     # Question database with councils
├── serve.py              # Python server for local testing
└── README.md            # This file
```

## Gameplay

1. Select your difficulty level (Easy, Moderate, or Severe)
2. Answer each theological statement with "Agree" or "Disagree"
3. Try to match orthodox doctrine as defined by historical church councils
4. Receive your verdict based on how many heresies you've committed
5. See which specific councils condemn your theological errors!

## Customization

You can easily add more questions by editing `public/questions.json`. Each question needs:
- `text`: The theological statement
- `orthodox`: Whether agreeing with it is orthodox (true) or heretical (false)
- `council`: The ID of the council that ruled on this doctrine

## Historical Note

This game uses a simplified, Western/Catholic perspective on "orthodoxy" for gameplay purposes. Real theological history is far more complex, with different Christian traditions having varying views on these doctrines.

## License

Free to use and modify for educational and entertainment purposes.

## Enjoy Your Trial!

May your orthodoxy shine bright... or may you discover just how heretical you truly are! ⚔️📿