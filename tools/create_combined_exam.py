import json
import random
from pathlib import Path
from collections import Counter

# Set seed for reproducibility
random.seed(42)

# Load JSON files
base_dir = Path('data/questionBank/DSS')
with open(base_dir / 'dss2016QuestionBank.json', 'r', encoding='utf-8') as f:
    dss2016 = json.load(f)
with open(base_dir / 'dss2022QuestionBank.json', 'r', encoding='utf-8') as f:
    dss2022 = json.load(f)
with open(base_dir / 'dssDemo1QuestionBank.json', 'r', encoding='utf-8') as f:
    dssDemo1 = json.load(f)

# Target distribution: exactly 70 questions
target_distribution = {
    'বাংলা': 20,
    'English': 20,
    'গনিত': 15,
    'সাধারণ জ্ঞান': 15
}

def filter_by_subject(data, subject):
    return [q for q in data['questions'] if q['subject'] == subject]

# Collect questions by subject from all sources
subject_pools = {subject: [] for subject in target_distribution}

for subject in target_distribution:
    subject_pools[subject].extend(filter_by_subject(dss2016, subject))
    subject_pools[subject].extend(filter_by_subject(dss2022, subject))
    subject_pools[subject].extend(filter_by_subject(dssDemo1, subject))
    random.shuffle(subject_pools[subject])

# Select questions according to target distribution
final_questions = []
for subject, count in target_distribution.items():
    pool = subject_pools[subject]
    if len(pool) >= count:
        selected = pool[:count]
    else:
        # Repeat questions if not enough
        selected = []
        while len(selected) < count:
            selected.extend(pool)
        selected = selected[:count]
    final_questions.extend(selected)

# Shuffle the final list
random.shuffle(final_questions)

# Reassign IDs
for idx, q in enumerate(final_questions, 1):
    q['id'] = idx

# Create combined exam structure
combined_exam = {
    "examInfo": {
        "examName": "Combined Model Test",
        "examType": "preliminary",
        "totalMarks": "70",
        "totalQuestions": 70
    },
    "questions": final_questions
}

# Save to file
output_path = base_dir / 'combinedModelTest.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(combined_exam, f, ensure_ascii=False, indent=2)

print(f"Combined exam created with {len(final_questions)} questions")
print(f"Saved to: {output_path}")

# Print subject distribution
subject_counts = Counter(q['subject'] for q in final_questions)
print("\nActual subject distribution:")
for subject, count in subject_counts.items():
    print(f"  {subject}: {count}")

print("\nTarget subject distribution:")
for subject, count in target_distribution.items():
    print(f"  {subject}: {count}")