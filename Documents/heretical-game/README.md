# 🕹️ The Heretical Game
**A web-based theological thought experiment disguised as a game.**

Test your orthodoxy. Annoy the councils. Survive the verdicts.  
Will you walk away as *faithful*, *borderline*, or *excommunicated*?

---

## 🎯 Overview
The **Heretical Game** is a satirical, philosophy-meets-theology browser game where players face a series of doctrinal dilemmas inspired by Christian history — from the **Council of Nicaea** to **Contemporary Orthodoxy**.

Each choice offends (or pleases) one of these ancient councils, leading to **branching verdicts** and hilarious (or horrifying) endings.

It’s a battle of wits between your intuition and centuries of dogma.  
Think *Who Wants to Be a Millionaire*, but if the judges were bishops with grudges.

---

## ⚙️ Gameplay Loop
1. **Select your difficulty:** Easy, Medium, or Hard.  
2. **Face theological questions** drawn from a wide randomized pool.  
   - No two playthroughs feel the same.  
   - Repeat questions are avoided across sessions.  
3. **Answer carefully.** Each choice affects multiple councils’ approval.  
4. **Reach the final verdict:**
   - Offend Nicaea → “Anathema! You are banished with Arius.”  
   - Offend Trent → “Declared heretic. Your writings are burned.”  
   - Offend Contemporary Orthodoxy → “You’re trending on X for all the wrong reasons.”  

Replayability is baked in — every session ends differently.

---

## 👥 Pseudo-Multiplayer (Old-School Save Codes)
- After completing a run, your results are exported as a **JSON snippet**.  
- You can **share that file** or **generate a link** (`?profile=BASE64DATA`) to let others view your outcome.  
- No backend, no login, no fuss — just pure browser magic.  

---

## ❤️ Show Love
If the councils haven’t condemned you yet, support the creator:  
👉 [**Show Love on Selar**](https://selar.com/showlove/timieweoba)

---

## 🔗 Share Your Verdict
Spread the gospel of heresy:

| Platform | Share |
|-----------|--------|
| 🟢 WhatsApp | Share your result with your friends |
| 🔵 Facebook | Post your ending verdict |
| ⚫ X (Twitter) | Boast your theological downfall |

(*Spectator mode has been removed — the councils don’t like freeloaders.*)

---

## 🧠 Tech Stack

### Frontend
- **HTML5** – Structure & content  
- **CSS3** – Styling, animations, responsiveness  
- **Vanilla JavaScript (ES6+)** – Game logic, interactivity, and state  

### Data & Storage
- **JSON** – Question database (`/public/questions.json`)  
- **LocalStorage** – Profile persistence across sessions  
- **No database** – 100% client-side, zero backend dependencies  

### Development & Deployment
- **Python HTTP Server** (`serve.py`) for local testing  
- **Vercel** / **Netlify** for deployment  
- **Static hosting only** – loads instantly, works offline  

### Architecture
- **Single Page Application (SPA)**  
- **Functional Programming**: pure JS functions for logic  
- **Event-driven UI**: DOM manipulation for question flow  
- **Progressive Enhancement**: graceful fallback for older browsers  

---

## 🧩 File Structure
heretical-game/
├── heretical-game.html # Main application file
├── public/
│ └── questions.json # Question database
├── serve.py # Local dev server
├── add_timers.py # Utility script
├── vercel.json # Vercel config
├── netlify.toml # Netlify config
├── .gitignore # Version control exclusions
└── README.md # This file

---

## ⚡ Performance
- **Lightweight:** ~2000 lines of code (HTML/CSS/JS)
- **Offline Ready:** Fully functional after initial load
- **Fast Load:** No libraries, no frameworks
- **Responsive:** Works on all modern browsers and mobile devices

---

## 🧪 Experimental (Future Plans)
- **AI-Generated Questions**: dynamically create new theological dilemmas and council reactions in real-time.  
- **Dynamic Council Reactions**: personalized verdicts and “live” commentary using AI wrappers.  
- **Global Leaderboards** (optional): if heresy ever needs ranking.

---

## ✝️ Author
**Timi Eweoba** — Writer, engineer, and cultural documentarian.  
Working to bring reason, humor, and humanity into tech and storytelling.

> “Truth, fact, and a little blasphemy — all in good faith.”

---

## 📜 License
MIT License — free to remix, modify, or fork.  
Just don’t call yourself orthodox when you do.
