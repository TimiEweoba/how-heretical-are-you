import json
import random

# List of sophisticated phrasings to replace "What is"
phrasings = [
    "Elucidate the concept of",
    "Define the theological term",
    "Explain the significance of",
    "Describe the doctrine known as",
    "Articulate the meaning of",
    "Expound upon the notion of",
    "Clarify the essence of",
    "Delineate the principles underlying"
]

# Load the JSON file
with open('public/questions-expanded.json', 'r') as f:
    data = json.load(f)

# Function to refine phrasing
def refine_phrasing(text):
    if text.startswith("What is "):
        # Remove "What is " and handle the rest
        rest = text[8:].strip()
        # Choose a random sophisticated phrasing
        phrasing = random.choice(phrasings)
        # Handle if it ends with '?' or not, but assume it does
        if rest.endswith('?'):
            rest = rest[:-1]
        # Special handling for questions like "What is the term for..."
        if rest.startswith("the "):
            if "term for" in rest or "study of" in rest or "name of" in rest:
                # For "What is the term for X?", change to "Identify the term denoting X"
                return f"Identify the term denoting {rest[4:]}."
            else:
                return f"{phrasing} {rest}."
        elif rest.startswith("'"):
            return f"{phrasing} {rest}."
        else:
            return f"{phrasing} {rest}."
    return text

# Refine questions for each difficulty
for difficulty in ['easy', 'medium', 'hard']:
    if difficulty in data:
        for question in data[difficulty]:
            if 'text' in question:
                question['text'] = refine_phrasing(question['text'])

# Save the modified JSON back to the file
with open('public/questions-expanded.json', 'w') as f:
    json.dump(data, f, indent=2)