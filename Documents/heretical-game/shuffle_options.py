import json
import random

# Load the JSON file
with open('public/questions-expanded.json', 'r') as f:
    data = json.load(f)

# Shuffle options for each question in easy, medium, hard
for difficulty in ['easy', 'medium', 'hard']:
    if difficulty in data:
        for question in data[difficulty]:
            if 'options' in question and isinstance(question['options'], list):
                random.shuffle(question['options'])

# Save the modified JSON back to the file
with open('public/questions-expanded.json', 'w') as f:
    json.dump(data, f, indent=2)