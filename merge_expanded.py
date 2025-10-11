import json

# Load main questions
with open('public/questions.json', 'r', encoding='utf-8') as f:
    main = json.load(f)

# Load expanded questions
with open('public/questions-expanded.json', 'r', encoding='utf-8') as f:
    expanded = json.load(f)

# Function to merge lists uniquely by id
def merge_lists(main_list, exp_list):
    combined = {q['id']: q for q in main_list}
    for q in exp_list:
        if q['id'] not in combined:
            combined[q['id']] = q
        else:
            # If duplicate id, perhaps skip or merge, but for now skip
            pass
    return list(combined.values())

# Merge each difficulty
main['easy'] = merge_lists(main.get('easy', []), expanded.get('easy', []))
main['medium'] = merge_lists(main.get('medium', []), expanded.get('medium', []))
main['hard'] = merge_lists(main.get('hard', []), expanded.get('hard', []))

# Merge profileQuiz if present
if 'profileQuiz' in expanded:
    main['profileQuiz'] = merge_lists(main.get('profileQuiz', []), expanded['profileQuiz'])

# Add councils if not present
if 'councils' in expanded and 'councils' not in main:
    main['councils'] = expanded['councils']

# Save back
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(main, f, indent=2, ensure_ascii=False)

print('Merged successfully!')