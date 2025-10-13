import json

with open('public/questions.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Easy: {len(data['easy'])} questions")
print(f"Medium: {len(data['medium'])} questions")
print(f"Hard: {len(data['hard'])} questions")
