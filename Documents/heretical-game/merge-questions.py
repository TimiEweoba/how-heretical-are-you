import json

# Read the existing questions.json
with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Current counts: Easy={len(data['easy'])}, Medium={len(data['medium'])}, Hard={len(data['hard'])}")

# Additional Easy Questions (31-50)
additional_easy = [
    {"id": 31, "text": "Did the early church practice believer's baptism or infant baptism?", "options": ["Believer's only", "Both were practiced"], "answer": "Both were practiced", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 32, "text": "Did Jesus claim to be equal with God?", "options": ["Yes", "No"], "answer": "Yes", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 30},
    {"id": 33, "text": "Are Christians required to tithe 10% of their income?", "options": ["Yes", "No"], "answer": "No", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 34, "text": "Did Paul write the book of Hebrews?", "options": ["Yes", "No"], "answer": "No", "council": "General Scripture", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 35, "text": "Is the Trinity explicitly mentioned in the Bible?", "options": ["Yes", "No"], "answer": "No", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 30},
    {"id": 36, "text": "Did Jesus have biological brothers and sisters?", "options": ["Yes", "No"], "answer": "Yes", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 37, "text": "Is the Rapture explicitly taught in the Bible?", "options": ["Yes", "No"], "answer": "No", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 38, "text": "Did Constantine invent Christianity?", "options": ["Yes", "No"], "answer": "No", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 30},
    {"id": 39, "text": "Are all sins equal in God's eyes?", "options": ["Yes", "No"], "answer": "No", "council": "General Scripture", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 40, "text": "Is hell a place of eternal conscious torment?", "options": ["Yes", "No"], "answer": "Yes", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 30},
    {"id": 41, "text": "Did the apostles write the Gospels?", "options": ["Yes", "No"], "answer": "Yes", "council": "General Scripture", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 42, "text": "Is Sunday the Christian Sabbath?", "options": ["Yes", "No"], "answer": "No", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 43, "text": "Did Jesus abolish the Old Testament law?", "options": ["Yes", "No"], "answer": "No", "council": "General Scripture", "heresyPoints": 1, "timeLimit": 30},
    {"id": 44, "text": "Are guardian angels real?", "options": ["Yes", "No"], "answer": "Yes", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 45, "text": "Did Jesus descend into hell after His death?", "options": ["Yes", "No"], "answer": "Yes", "council": "General Tradition", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 46, "text": "Is the age of the earth 6,000 years?", "options": ["Yes", "No"], "answer": "No", "council": "Contemporary Orthodoxy", "heresyPoints": 0.5, "timeLimit": 30},
    {"id": 47, "text": "Did Mary Magdalene marry Jesus?", "options": ["Yes", "No"], "answer": "No", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 30},
    {"id": 48, "text": "Did Jesus know everything during His earthly ministry?", "options": ["Yes", "No"], "answer": "No", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 30},
    {"id": 49, "text": "Is the Bible inerrant?", "options": ["Yes", "No"], "answer": "Yes", "council": "Contemporary Orthodoxy", "heresyPoints": 1, "timeLimit": 30},
    {"id": 50, "text": "Did the early church have a Pope?", "options": ["Yes", "No"], "answer": "No", "council": "Eastern Orthodoxy", "heresyPoints": 0.5, "timeLimit": 30}
]

# Additional Medium Questions (31-50)
additional_medium = [
    {"id": 31, "text": "What is 'Sola Scriptura'?", "options": ["Scripture alone", "Scripture and Tradition", "Church authority", "Revelation"], "answer": "Scripture alone", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 32, "text": "Who was Athanasius's primary opponent?", "options": ["Arius", "Nestorius", "Pelagius", "Eutyches"], "answer": "Arius", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 33, "text": "What does 'ex cathedra' mean?", "options": ["From the chair", "From the heart", "From Scripture", "From tradition"], "answer": "From the chair", "council": "Vatican I", "heresyPoints": 1, "timeLimit": 25},
    {"id": 34, "text": "What is 'Sola Fide'?", "options": ["Faith alone", "Grace alone", "Scripture alone", "Christ alone"], "answer": "Faith alone", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 35, "text": "Who wrote 'Institutes of Christian Religion'?", "options": ["Luther", "Calvin", "Zwingli", "Knox"], "answer": "Calvin", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 36, "text": "What is 'Sola Gratia'?", "options": ["Grace alone", "Faith alone", "Scripture alone", "Christ alone"], "answer": "Grace alone", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 37, "text": "What does 'Solus Christus' mean?", "options": ["Christ alone", "Faith alone", "Grace alone", "Scripture alone"], "answer": "Christ alone", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 38, "text": "Who wrote the 95 Theses?", "options": ["Calvin", "Luther", "Zwingli", "Knox"], "answer": "Luther", "council": "Worms", "heresyPoints": 1, "timeLimit": 25},
    {"id": 39, "text": "What is 'Soli Deo Gloria'?", "options": ["Glory to God alone", "Faith alone", "Grace alone", "Scripture alone"], "answer": "Glory to God alone", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 40, "text": "What year was the Great Schism?", "options": ["325 AD", "451 AD", "1054 AD", "1517 AD"], "answer": "1054 AD", "council": "Eastern Orthodoxy", "heresyPoints": 1, "timeLimit": 25},
    {"id": 41, "text": "Who was the patriarch during the Great Schism?", "options": ["Michael Cerularius", "Photius", "John Chrysostom", "Basil"], "answer": "Michael Cerularius", "council": "Eastern Orthodoxy", "heresyPoints": 1, "timeLimit": 25},
    {"id": 42, "text": "Which reformer died in battle?", "options": ["Luther", "Calvin", "Zwingli", "Knox"], "answer": "Zwingli", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 43, "text": "Who wrote 'The Bondage of the Will'?", "options": ["Luther", "Calvin", "Erasmus", "Zwingli"], "answer": "Luther", "council": "Worms", "heresyPoints": 1, "timeLimit": 25},
    {"id": 44, "text": "What is 'Consubstantiation'?", "options": ["Lutheran Eucharist view", "Catholic view", "Calvinist view", "Zwinglian view"], "answer": "Lutheran Eucharist view", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 45, "text": "Who wrote 'The Praise of Folly'?", "options": ["Erasmus", "Luther", "More", "Calvin"], "answer": "Erasmus", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 46, "text": "What is 'Memorialism' in communion?", "options": ["Symbolic only", "Real presence", "Spiritual presence", "Transubstantiation"], "answer": "Symbolic only", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 47, "text": "Who was called 'Hammer of Heretics'?", "options": ["Athanasius", "Augustine", "Aquinas", "Anselm"], "answer": "Athanasius", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 48, "text": "Who wrote 'Utopia'?", "options": ["Thomas More", "Erasmus", "Luther", "Calvin"], "answer": "Thomas More", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 49, "text": "Who was 'Morning Star of Reformation'?", "options": ["Wycliffe", "Huss", "Luther", "Calvin"], "answer": "Wycliffe", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 50, "text": "Who translated Bible into English (1380s)?", "options": ["Wycliffe", "Tyndale", "Coverdale", "King James"], "answer": "Wycliffe", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25}
]

# Additional Hard Questions (31-50)
additional_hard = [
    {"id": 31, "text": "What is 'Hypostatic Union'?", "options": ["Union of Christ's two natures", "Trinity doctrine", "Church unity", "Mystical union"], "answer": "Union of Christ's two natures", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 32, "text": "Who coined the term 'Homoousios'?", "options": ["Athanasius", "Council of Nicaea", "Tertullian", "Origen"], "answer": "Council of Nicaea", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 20},
    {"id": 33, "text": "What is 'Communicatio Idiomatum'?", "options": ["Exchange of properties", "Communication of grace", "Church communion", "Apostolic succession"], "answer": "Exchange of properties", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 34, "text": "What is 'Perichoresis'?", "options": ["Mutual indwelling of Trinity", "Dance around altar", "Circular reasoning", "Church procession"], "answer": "Mutual indwelling of Trinity", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 20},
    {"id": 35, "text": "Who wrote 'Against Heresies'?", "options": ["Irenaeus", "Tertullian", "Origen", "Cyprian"], "answer": "Irenaeus", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 36, "text": "What is 'Traducianism'?", "options": ["Soul inherited from parents", "Soul created by God", "Pre-existence of souls", "Soul emerges from body"], "answer": "Soul inherited from parents", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 37, "text": "What is 'Creationism' in soul origin?", "options": ["God creates each soul", "Soul from parents", "Pre-existing souls", "Soul evolves"], "answer": "God creates each soul", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 38, "text": "Who wrote 'Cur Deus Homo'?", "options": ["Anselm", "Aquinas", "Augustine", "Athanasius"], "answer": "Anselm", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 39, "text": "What is 'Supralapsarianism'?", "options": ["Election before Fall", "Election after Fall", "Universal salvation", "Conditional election"], "answer": "Election before Fall", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 40, "text": "What is 'Infralapsarianism'?", "options": ["Election after Fall", "Election before Fall", "Universal salvation", "Conditional election"], "answer": "Election after Fall", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 41, "text": "What is 'Amyraldism'?", "options": ["Hypothetical universalism", "Limited atonement", "Universal salvation", "No atonement"], "answer": "Hypothetical universalism", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 42, "text": "What is 'Kenosis'?", "options": ["Christ's self-emptying", "Christ's exaltation", "Christ's incarnation", "Christ's resurrection"], "answer": "Christ's self-emptying", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 43, "text": "What is 'Theotokos'?", "options": ["God-bearer", "Christ-bearer", "Holy-bearer", "Spirit-bearer"], "answer": "God-bearer", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 44, "text": "What is 'Christotokos'?", "options": ["Christ-bearer", "God-bearer", "Holy-bearer", "Spirit-bearer"], "answer": "Christ-bearer", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 45, "text": "What is 'Anhypostasia'?", "options": ["No independent human person", "Two persons in Christ", "One nature in Christ", "No divine person"], "answer": "No independent human person", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 46, "text": "What is 'Enhypostasia'?", "options": ["Human nature in divine person", "Divine nature in human", "Two separate persons", "One mixed nature"], "answer": "Human nature in divine person", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 47, "text": "What is 'Theopaschitism'?", "options": ["God suffered", "God cannot suffer", "Only humanity suffered", "Neither suffered"], "answer": "God suffered", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 20},
    {"id": 48, "text": "What is 'Impassibility'?", "options": ["God cannot suffer", "God can suffer", "Christ cannot suffer", "Only Spirit suffers"], "answer": "God cannot suffer", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 49, "text": "What is 'Immutability'?", "options": ["God unchanging", "God changes", "Christ unchanging", "Spirit unchanging"], "answer": "God unchanging", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 50, "text": "What is 'Simplicity' of God?", "options": ["God has no parts", "God is easy to understand", "God is one person", "God is singular"], "answer": "God has no parts", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20}
]

# Add the questions
data['easy'].extend(additional_easy)
data['medium'].extend(additional_medium)
data['hard'].extend(additional_hard)

# Save the updated file
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Questions added successfully!")
print(f"New counts: Easy={len(data['easy'])}, Medium={len(data['medium'])}, Hard={len(data['hard'])}")
print(f"\nAdded: {len(additional_easy)} Easy, {len(additional_medium)} Medium, {len(additional_hard)} Hard")
