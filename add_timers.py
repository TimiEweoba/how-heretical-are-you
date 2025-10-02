#!/usr/bin/env python3
"""
Script to add timeLimit to all questions that don't have it.
- Easy: 30 seconds
- Medium: 25 seconds
- Hard: 20 seconds
"""

import json

# Load questions
with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Timer settings per difficulty
timer_settings = {
    'easy': 30,
    'medium': 25,
    'hard': 20
}

# Add timers to questions
for difficulty, time_limit in timer_settings.items():
    if difficulty in data:
        for question in data[difficulty]:
            # Only add if it doesn't already have a timeLimit
            if 'timeLimit' not in question:
                question['timeLimit'] = time_limit
                print(f"Added {time_limit}s timer to {difficulty} question {question.get('id', '?')}")

# Save updated questions
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✅ All timers added successfully!")
print(f"- Easy questions: {len(data['easy'])} questions with 30s timers")
print(f"- Medium questions: {len(data['medium'])} questions with 25s timers")
print(f"- Hard questions: {len(data['hard'])} questions with 20s timers")
