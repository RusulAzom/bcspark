#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Literature JSON Converter Script"""

import json
import re
import os

BASE_DIR = r"D:\antigravity\bcspark\data\t20\bangla\grammar\writing"
INPUT_FILE = os.path.join(BASE_DIR, "input.txt")
OUTPUT_FILE = os.path.join(BASE_DIR, "literature.json")


def find_max_id(existing_data):
    if not existing_data:
        return 0
    return max(item.get("id", 0) for item in existing_data)


def extract_explanation(line):
    match = re.search(r'ব্যাখ্যা:\s*(.+)', line, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def find_answer_index(explain, options):
    explain_lower = explain.lower()
    for i, opt in enumerate(options):
        opt_clean = opt.strip().lower()
        if opt_clean in explain_lower:
            return i
        opt_no_article = re.sub(r'^(the|a|an)\s+', '', opt_clean)
        if opt_no_article in explain_lower:
            return i
        bengali_to_ascii = str.maketrans('০১২৩৪৫৬৭৮৯', '0123456789')
        explain_ascii = explain.translate(bengali_to_ascii)
        opt_ascii = opt.translate(bengali_to_ascii)
        numbers_in_explain = re.findall(r'\b\d{3,4}\b', explain_ascii)
        numbers_in_opt = re.findall(r'\b\d{3,4}\b', opt_ascii)
        for num_exp in numbers_in_explain:
            for num_opt in numbers_in_opt:
                if num_exp == num_opt:
                    return i
    return 0


def parse_questions(content):
    question_blocks = re.split(r'(?=^[১২৩৪৫৬৭৮৯০]+\.\s*)', content.strip(), flags=re.MULTILINE)
    questions = []
    for block in question_blocks:
        block = block.strip()
        if not block:
            continue
        lines = block.split('\n')
        if len(lines) < 6:
            continue
        q_line = re.sub(r'^[১২৩৪৫৬৭৮৯০]+\.\s*', '', lines[0]).strip()
        source = ""
        source_idx = -1
        for i, line in enumerate(lines[1:], 1):
            stripped = line.strip()
            if ':' in stripped or 'বিসিএস' in stripped or 'বিশ্ববিদ্যালয়' in stripped or 'পরিচালক' in stripped or 'অধিদপ্তর' in stripped or 'মন্ত্রণালয়' in stripped or 'ব্যাংক' in stripped or 'অফিসার' in stripped or 'পরিদর্শক' in stripped or 'প্রকৌশলী' in stripped or 'অডিটর' in stripped or 'কর্মকর্তা' in stripped or 'পরিসংখ্যান' in stripped or 'শিক্ষক' in stripped or 'তত্ত্বাবধায়ক' in stripped or 'নিরীক্ষক' in stripped or 'রেজিস্ট্রার' in stripped:
                source = stripped
                source_idx = i
                break
        if source_idx == -1:
            source = lines[1].strip()
            source_idx = 1
        options = []
        for line in lines[source_idx + 1:]:
            stripped = line.strip()
            if not stripped:
                continue
            if 'ব্যাখ্যা:' in stripped:
                break
            if re.match(r'^[১২৩৪৫৬৭৮৯০]+\.\s*', stripped):
                break
            options.append(stripped)
            if len(options) == 4:
                break
        explain = ""
        for line in lines:
            if 'ব্যাখ্যা:' in line:
                explain = extract_explanation(line)
                break
        ans = find_answer_index(explain, options)
        if q_line and len(options) == 4:
            questions.append({
                "q": q_line,
                "options": options,
                "ans": ans,
                "source": source,
                "topicsId": 401,
                "explain": explain
            })
    return questions


def main():
    existing = []
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:
                    existing = json.loads(content)
        except (json.JSONDecodeError, FileNotFoundError):
            existing = []
    max_id = find_max_id(existing)
    if not os.path.exists(INPUT_FILE):
        print(f"Input file not found: {INPUT_FILE}")
        return
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.strip():
        print("Input file is empty. Nothing to process.")
        return
    new_questions = parse_questions(content)
    if not new_questions:
        print("No questions could be parsed from input.")
        return
    for i, q in enumerate(new_questions):
        q["id"] = max_id + i + 1
        existing.append(q)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    with open(INPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("")
    print(f"Successfully added {len(new_questions)} questions to {OUTPUT_FILE}")
    print(f"Total questions in database: {len(existing)}")


if __name__ == "__main__":
    main()