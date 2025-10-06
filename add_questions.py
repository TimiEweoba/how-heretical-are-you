import json

# Read existing questions
with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Medium questions to add (IDs 51-100)
medium_questions = [
    {"id": 51, "text": "Who was burned for translating Bible?", "options": ["Tyndale", "Wycliffe", "Huss", "Cranmer"], "answer": "Tyndale", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 52, "text": "Who wrote 'Book of Common Prayer'?", "options": ["Cranmer", "Luther", "Calvin", "Knox"], "answer": "Cranmer", "council": "Reformation", "heresyPoints": 1, "timeLimit": 25},
    {"id": 53, "text": "Who founded the Jesuits?", "options": ["Ignatius Loyola", "Francis Xavier", "Augustine", "Benedict"], "answer": "Ignatius Loyola", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 54, "text": "Who wrote 'Spiritual Exercises'?", "options": ["Ignatius Loyola", "Teresa of Avila", "John of Cross", "Francis de Sales"], "answer": "Ignatius Loyola", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 55, "text": "What is 'Theosis' in Orthodoxy?", "options": ["Deification", "Justification", "Sanctification", "Glorification"], "answer": "Deification", "council": "Eastern Orthodoxy", "heresyPoints": 1, "timeLimit": 25},
    {"id": 56, "text": "What is 'Immaculate Conception'?", "options": ["Mary born sinless", "Virgin birth", "Jesus sinless", "Mary's assumption"], "answer": "Mary born sinless", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 57, "text": "What is 'Simony'?", "options": ["Buying church offices", "Selling indulgences", "Heresy", "Schism"], "answer": "Buying church offices", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 58, "text": "What is 'Conciliarism'?", "options": ["Councils above Pope", "Pope above councils", "Scripture alone", "Tradition alone"], "answer": "Councils above Pope", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 59, "text": "What is 'Ultramontanism'?", "options": ["Support papal authority", "Opposition to Pope", "Nationalism", "Conciliarism"], "answer": "Support papal authority", "council": "Vatican I", "heresyPoints": 1, "timeLimit": 25},
    {"id": 60, "text": "What is 'Gallicanism'?", "options": ["French church independence", "Papal supremacy", "Conciliarism", "Nationalism"], "answer": "French church independence", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 61, "text": "Who was 'Doctor of Grace'?", "options": ["Augustine", "Aquinas", "Anselm", "Athanasius"], "answer": "Augustine", "council": "Carthage", "heresyPoints": 1, "timeLimit": 25},
    {"id": 62, "text": "Who was 'Angelic Doctor'?", "options": ["Aquinas", "Augustine", "Anselm", "Athanasius"], "answer": "Aquinas", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 63, "text": "Who was 'Seraphic Doctor'?", "options": ["Bonaventure", "Aquinas", "Duns Scotus", "Ockham"], "answer": "Bonaventure", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 64, "text": "Who was 'Subtle Doctor'?", "options": ["Duns Scotus", "Aquinas", "Bonaventure", "Ockham"], "answer": "Duns Scotus", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 65, "text": "What is 'Filioque' controversy about?", "options": ["Holy Spirit procession", "Pope's authority", "Icon veneration", "Nature of Christ"], "answer": "Holy Spirit procession", "council": "Eastern Orthodoxy", "heresyPoints": 1, "timeLimit": 25},
    {"id": 66, "text": "What council addressed Iconoclasm?", "options": ["Nicaea II", "Nicaea I", "Chalcedon", "Trent"], "answer": "Nicaea II", "council": "Nicaea II", "heresyPoints": 1, "timeLimit": 25},
    {"id": 67, "text": "What is 'Indulgences'?", "options": ["Remission of punishment", "Forgiveness of sins", "Salvation", "Justification"], "answer": "Remission of punishment", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 68, "text": "What is 'Purgatory'?", "options": ["State of purification", "Hell", "Heaven", "Limbo"], "answer": "State of purification", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 69, "text": "What is 'Limbo'?", "options": ["Place for unbaptized", "Purgatory", "Hell", "Heaven"], "answer": "Place for unbaptized", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 70, "text": "What is 'Nepotism'?", "options": ["Favoritism to relatives", "Selling offices", "Heresy", "Schism"], "answer": "Favoritism to relatives", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 71, "text": "What council condemned Pelagianism?", "options": ["Carthage", "Nicaea", "Chalcedon", "Trent"], "answer": "Carthage", "council": "Carthage", "heresyPoints": 1, "timeLimit": 25},
    {"id": 72, "text": "What council defined Mary as Theotokos?", "options": ["Ephesus", "Nicaea", "Chalcedon", "Trent"], "answer": "Ephesus", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 73, "text": "Which pope launched First Crusade?", "options": ["Urban II", "Gregory VII", "Innocent III", "Leo IX"], "answer": "Urban II", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 74, "text": "What is study of sin called?", "options": ["Hamartiology", "Anthropology", "Soteriology", "Eschatology"], "answer": "Hamartiology", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 75, "text": "What is study of Holy Spirit called?", "options": ["Pneumatology", "Christology", "Soteriology", "Angelology"], "answer": "Pneumatology", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 76, "text": "What is study of angels called?", "options": ["Angelology", "Pneumatology", "Anthropology", "Demonology"], "answer": "Angelology", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 77, "text": "What is study of demons called?", "options": ["Demonology", "Angelology", "Pneumatology", "Hamartiology"], "answer": "Demonology", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 78, "text": "What is study of humanity called?", "options": ["Anthropology", "Soteriology", "Hamartiology", "Ecclesiology"], "answer": "Anthropology", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 79, "text": "What language was NT written in?", "options": ["Greek", "Latin", "Hebrew", "Aramaic"], "answer": "Greek", "council": "General Scripture", "heresyPoints": 0.5, "timeLimit": 25},
    {"id": 80, "text": "Who translated Bible into Latin Vulgate?", "options": ["Jerome", "Augustine", "Origen", "Tertullian"], "answer": "Jerome", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 81, "text": "What heresy denied Christ's humanity?", "options": ["Docetism", "Arianism", "Nestorianism", "Pelagianism"], "answer": "Docetism", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 82, "text": "What heresy divided Christ into two persons?", "options": ["Nestorianism", "Arianism", "Monophysitism", "Docetism"], "answer": "Nestorianism", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 83, "text": "What heresy taught Christ had one nature?", "options": ["Monophysitism", "Arianism", "Nestorianism", "Docetism"], "answer": "Monophysitism", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 84, "text": "What heresy denied original sin?", "options": ["Pelagianism", "Arianism", "Nestorianism", "Docetism"], "answer": "Pelagianism", "council": "Carthage", "heresyPoints": 1, "timeLimit": 25},
    {"id": 85, "text": "What heresy taught Christ was created?", "options": ["Arianism", "Nestorianism", "Monophysitism", "Docetism"], "answer": "Arianism", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 86, "text": "What heresy denied Holy Spirit's divinity?", "options": ["Pneumatomachi", "Arianism", "Nestorianism", "Pelagianism"], "answer": "Pneumatomachi", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 87, "text": "What heresy taught Christ had one will?", "options": ["Monothelitism", "Arianism", "Nestorianism", "Monophysitism"], "answer": "Monothelitism", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 88, "text": "What heresy rejected sacraments by sinful priests?", "options": ["Donatism", "Arianism", "Pelagianism", "Nestorianism"], "answer": "Donatism", "council": "Carthage", "heresyPoints": 1, "timeLimit": 25},
    {"id": 89, "text": "What heresy rejected material world?", "options": ["Gnosticism", "Arianism", "Pelagianism", "Nestorianism"], "answer": "Gnosticism", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 90, "text": "What heresy taught reincarnation?", "options": ["Gnosticism", "Arianism", "Pelagianism", "Nestorianism"], "answer": "Gnosticism", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 91, "text": "Who wrote 'On First Principles'?", "options": ["Origen", "Tertullian", "Cyprian", "Irenaeus"], "answer": "Origen", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 92, "text": "Who wrote 'Apology'?", "options": ["Tertullian", "Origen", "Cyprian", "Irenaeus"], "answer": "Tertullian", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 93, "text": "Who wrote 'On the Unity of Church'?", "options": ["Cyprian", "Tertullian", "Origen", "Irenaeus"], "answer": "Cyprian", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 25},
    {"id": 94, "text": "What council was in 325 AD?", "options": ["Nicaea", "Constantinople", "Ephesus", "Chalcedon"], "answer": "Nicaea", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 95, "text": "What council was in 381 AD?", "options": ["Constantinople I", "Nicaea", "Ephesus", "Chalcedon"], "answer": "Constantinople I", "council": "Nicaea", "heresyPoints": 1, "timeLimit": 25},
    {"id": 96, "text": "What council was in 431 AD?", "options": ["Ephesus", "Nicaea", "Constantinople", "Chalcedon"], "answer": "Ephesus", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 97, "text": "What council was in 451 AD?", "options": ["Chalcedon", "Nicaea", "Constantinople", "Ephesus"], "answer": "Chalcedon", "council": "Chalcedon", "heresyPoints": 1, "timeLimit": 25},
    {"id": 98, "text": "What council was in 787 AD?", "options": ["Nicaea II", "Nicaea I", "Constantinople", "Chalcedon"], "answer": "Nicaea II", "council": "Nicaea II", "heresyPoints": 1, "timeLimit": 25},
    {"id": 99, "text": "What council was in 1545-1563?", "options": ["Trent", "Nicaea", "Chalcedon", "Vatican I"], "answer": "Trent", "council": "Trent", "heresyPoints": 1, "timeLimit": 25},
    {"id": 100, "text": "What council was in 1869-1870?", "options": ["Vatican I", "Trent", "Nicaea", "Chalcedon"], "answer": "Vatican I", "council": "Vatican I", "heresyPoints": 1, "timeLimit": 25}
]

# Hard questions to add (IDs 51-100)
hard_questions = [
    {"id": 51, "text": "What is 'Aseity'?", "options": ["Self-existence", "Self-knowledge", "Self-love", "Self-sufficiency"], "answer": "Self-existence", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 52, "text": "What is 'Beatific Vision'?", "options": ["Direct vision of God", "Vision of Christ", "Vision of angels", "Vision of heaven"], "answer": "Direct vision of God", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 53, "text": "What is 'Synergism'?", "options": ["Cooperation with grace", "Grace alone", "Works alone", "Neither grace nor works"], "answer": "Cooperation with grace", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 54, "text": "What is 'Monergism'?", "options": ["God alone works", "Human cooperation", "Works alone", "Neither works"], "answer": "God alone works", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 55, "text": "What is 'Prevenient Grace'?", "options": ["Grace before conversion", "Grace after conversion", "Saving grace", "Sustaining grace"], "answer": "Grace before conversion", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 56, "text": "What is 'Irresistible Grace'?", "options": ["Cannot be refused", "Can be refused", "Partial grace", "Conditional grace"], "answer": "Cannot be refused", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 57, "text": "What is 'Perseverance of Saints'?", "options": ["Cannot lose salvation", "Can lose salvation", "Conditional salvation", "No salvation"], "answer": "Cannot lose salvation", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 58, "text": "What is 'Unconditional Election'?", "options": ["Election not based on foreseen faith", "Election based on faith", "Universal election", "No election"], "answer": "Election not based on foreseen faith", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 59, "text": "What is 'Limited Atonement'?", "options": ["Christ died for elect only", "Christ died for all", "Christ died for none", "Conditional atonement"], "answer": "Christ died for elect only", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 60, "text": "What is 'Total Depravity'?", "options": ["Sin affects all of person", "Complete inability", "Partial corruption", "No corruption"], "answer": "Sin affects all of person", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 61, "text": "What is 'Imputation'?", "options": ["Crediting righteousness", "Infusing righteousness", "Creating righteousness", "Removing sin"], "answer": "Crediting righteousness", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 62, "text": "What is 'Infusion'?", "options": ["Pouring in righteousness", "Crediting righteousness", "Creating righteousness", "Removing sin"], "answer": "Pouring in righteousness", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 63, "text": "What is 'Forensic Justification'?", "options": ["Legal declaration", "Moral transformation", "Both declaration and transformation", "Neither"], "answer": "Legal declaration", "council": "Trent", "heresyPoints": 1, "timeLimit": 20},
    {"id": 64, "text": "What is 'Sanctification'?", "options": ["Process of holiness", "Instant holiness", "Declaration of holiness", "No holiness"], "answer": "Process of holiness", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 65, "text": "What is 'Glorification'?", "options": ["Final perfection", "Current perfection", "Partial perfection", "No perfection"], "answer": "Final perfection", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 66, "text": "What is 'Regeneration'?", "options": ["New birth", "Baptism", "Conversion", "Sanctification"], "answer": "New birth", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 67, "text": "What is 'Effectual Calling'?", "options": ["Irresistible call", "Resistible call", "Universal call", "No call"], "answer": "Irresistible call", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 68, "text": "What is 'General Calling'?", "options": ["Universal gospel call", "Effectual call", "Irresistible call", "No call"], "answer": "Universal gospel call", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 69, "text": "What is 'Propitiation'?", "options": ["Wrath-satisfying sacrifice", "Example of love", "Moral influence", "Ransom to Satan"], "answer": "Wrath-satisfying sacrifice", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 70, "text": "What is 'Expiation'?", "options": ["Sin-covering sacrifice", "Wrath-satisfying", "Example of love", "Moral influence"], "answer": "Sin-covering sacrifice", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 71, "text": "What is 'Penal Substitution'?", "options": ["Christ punished in our place", "Christ as example", "Christ as victor", "Christ as ransom"], "answer": "Christ punished in our place", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 72, "text": "What is 'Christus Victor'?", "options": ["Christ defeats evil powers", "Christ punished for us", "Christ as example", "Christ as ransom"], "answer": "Christ defeats evil powers", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 73, "text": "What is 'Moral Influence Theory'?", "options": ["Christ as example of love", "Christ punished for us", "Christ defeats evil", "Christ as ransom"], "answer": "Christ as example of love", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 74, "text": "What is 'Satisfaction Theory'?", "options": ["Christ satisfies God's honor", "Christ punished for us", "Christ as example", "Christ as ransom"], "answer": "Christ satisfies God's honor", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 75, "text": "What is 'Ransom Theory'?", "options": ["Christ as ransom to Satan", "Christ punished for us", "Christ as example", "Christ satisfies honor"], "answer": "Christ as ransom to Satan", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 76, "text": "What is 'Recapitulation Theory'?", "options": ["Christ reverses Adam's failure", "Christ punished for us", "Christ as example", "Christ as ransom"], "answer": "Christ reverses Adam's failure", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 77, "text": "What is 'Governmental Theory'?", "options": ["Christ upholds moral order", "Christ punished for us", "Christ as example", "Christ as ransom"], "answer": "Christ upholds moral order", "council": "Scholastic Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 78, "text": "What is 'Dichotomy' of human nature?", "options": ["Body and soul", "Body, soul, spirit", "Body only", "Soul only"], "answer": "Body and soul", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 79, "text": "What is 'Trichotomy' of human nature?", "options": ["Body, soul, spirit", "Body and soul", "Body only", "Soul only"], "answer": "Body, soul, spirit", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 80, "text": "What is 'Annihilationism'?", "options": ["Wicked cease to exist", "Eternal torment", "Universal salvation", "Purgatory for all"], "answer": "Wicked cease to exist", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 81, "text": "What is 'Conditional Immortality'?", "options": ["Only saved live forever", "All live forever", "None live forever", "Conditional on works"], "answer": "Only saved live forever", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 82, "text": "What is 'Universalism'?", "options": ["All eventually saved", "Only elect saved", "None saved", "Conditional salvation"], "answer": "All eventually saved", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 83, "text": "What is 'Postmillennialism'?", "options": ["Christ returns after millennium", "Christ returns before", "No millennium", "Spiritual millennium"], "answer": "Christ returns after millennium", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 84, "text": "What is 'Premillennialism'?", "options": ["Christ returns before millennium", "Christ returns after", "No millennium", "Spiritual millennium"], "answer": "Christ returns before millennium", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 85, "text": "What is 'Amillennialism'?", "options": ["Spiritual millennium now", "Literal future millennium", "No millennium", "Past millennium"], "answer": "Spiritual millennium now", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 86, "text": "What is 'Preterism'?", "options": ["Prophecies fulfilled in past", "Prophecies future", "Prophecies symbolic", "No prophecies"], "answer": "Prophecies fulfilled in past", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 87, "text": "What is 'Futurism'?", "options": ["Prophecies yet future", "Prophecies fulfilled", "Prophecies symbolic", "No prophecies"], "answer": "Prophecies yet future", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 88, "text": "What is 'Historicism'?", "options": ["Prophecies throughout history", "Prophecies future", "Prophecies past", "No prophecies"], "answer": "Prophecies throughout history", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 89, "text": "What is 'Idealism' in prophecy?", "options": ["Prophecies symbolic/timeless", "Prophecies literal", "Prophecies historical", "No prophecies"], "answer": "Prophecies symbolic/timeless", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 90, "text": "What is 'Dispensationalism'?", "options": ["God works in distinct eras", "God works uniformly", "No divine plan", "Covenant theology"], "answer": "God works in distinct eras", "council": "Contemporary Orthodoxy", "heresyPoints": 1, "timeLimit": 20},
    {"id": 91, "text": "What is 'Covenant Theology'?", "options": ["God works through covenants", "God works in dispensations", "No divine plan", "Works-based"], "answer": "God works through covenants", "council": "Reformation", "heresyPoints": 1, "timeLimit": 20},
    {"id": 92, "text": "What is 'New Covenant Theology'?", "options": ["Only new covenant applies", "All covenants apply", "No covenants", "Old covenant only"], "answer": "Only new covenant applies", "council": "Contemporary Orthodoxy", "heresyPoints": 1, "timeLimit": 20},
    {"id": 93, "text": "What is 'Cessationism'?", "options": ["Miraculous gifts ceased", "Gifts continue", "No gifts ever", "All have gifts"], "answer": "Miraculous gifts ceased", "council": "Pentecostal Practice", "heresyPoints": 1, "timeLimit": 20},
    {"id": 94, "text": "What is 'Continuationism'?", "options": ["Gifts continue today", "Gifts ceased", "No gifts ever", "Gifts for apostles only"], "answer": "Gifts continue today", "council": "Pentecostal Practice", "heresyPoints": 1, "timeLimit": 20},
    {"id": 95, "text": "What is 'Baptismal Regeneration'?", "options": ["Baptism causes rebirth", "Baptism symbolizes rebirth", "No baptism needed", "Baptism optional"], "answer": "Baptism causes rebirth", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 96, "text": "What is 'Believer's Baptism'?", "options": ["Only believers baptized", "Infants baptized", "All baptized", "No baptism"], "answer": "Only believers baptized", "council": "Reformation", "heresyPoints": 1, "timeLimit": 20},
    {"id": 97, "text": "What is 'Paedobaptism'?", "options": ["Infant baptism", "Believer's baptism", "No baptism", "Rebaptism"], "answer": "Infant baptism", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20},
    {"id": 98, "text": "What is 'Traducianism'?", "options": ["Soul from parents", "God creates each soul", "Pre-existing souls", "Soul emerges from body"], "answer": "Soul from parents", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 99, "text": "What is 'Creationism' in soul origin?", "options": ["God creates each soul", "Soul from parents", "Pre-existing souls", "Soul emerges from body"], "answer": "God creates each soul", "council": "Carthage", "heresyPoints": 1, "timeLimit": 20},
    {"id": 100, "text": "What is 'Pre-existence' of souls?", "options": ["Souls exist before birth", "God creates at conception", "Soul from parents", "Soul emerges later"], "answer": "Souls exist before birth", "council": "General Tradition", "heresyPoints": 1, "timeLimit": 20}
]

# Add questions
data['medium'].extend(medium_questions)
data['hard'].extend(hard_questions)

# Save
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✅ Added {len(medium_questions)} medium questions (now {len(data['medium'])} total)")
print(f"✅ Added {len(hard_questions)} hard questions (now {len(data['hard'])} total)")
