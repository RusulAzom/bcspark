#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Karok Bivokti JSON Converter - Updated with scoring + duplicate detection
"""

import json
import re
import os

INPUT_FILE = r"D:\antigravity\bcspark\data\t20\bangla\grammar\theory\input.txt"
OUTPUT_FILE = r"D:\antigravity\bcspark\data\t20\bangla\grammar\theory\karokobivokti.json"


def normalize(text):
    t = text.lower().strip()
    t = re.sub(r'[য়য]া', 'য়া', t)
    t = re.sub(r'[য়য]ে', 'য়ে', t)
    t = t.replace('\u2013', '-').replace('\u2014', '-')
    t = re.sub(r'[\u0964\u0965,?!:;"\'()]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'কারক', ' কারক', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def normalize_q(text):
    t = text.lower().strip()
    t = re.sub(r'[\u0964\u0965,?!:;"\'()\u2013\u2014-]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def score_option(option, explain):
    score = 0
    opt_norm = normalize(option)
    exp_norm = normalize(explain)

    if opt_norm in exp_norm:
        score += 10

    first_word = opt_norm.split()[0] if opt_norm.split() else ''
    if first_word and len(first_word) > 1 and first_word in exp_norm:
        score += 8

    opt_tokens = set(opt_norm.split())
    exp_tokens = set(exp_norm.split())
    overlap = len(opt_tokens & exp_tokens)
    score += overlap * 2

    key_terms = re.findall(r'([\u0980-\u09FF]+)\s*কারক', exp_norm)
    for term in key_terms:
        if term in opt_norm:
            score += 8

    biv_terms = re.findall(r'([\u0980-\u09FF]+)\s*বিভক্তি', exp_norm)
    for term in biv_terms:
        if term in opt_norm:
            score += 6

    bengali_digits = r'[\u09E6\u09E7\u09E8\u09E9\u09EA\u09EB\u09EC\u09ED\u09EE\u09EF]'
    nums_in_exp = re.findall(bengali_digits + r'+[\u09DF\u09AF\u09BE]*', exp_norm)
    nums_in_opt = re.findall(bengali_digits + r'+[\u09DF\u09AF\u09BE]*', opt_norm)
    for n in nums_in_opt:
        if n in exp_norm:
            score += 4

    return score


def find_best_answer(options, explain):
    scores = [score_option(opt, explain) for opt in options]
    return scores.index(max(scores))


def load_existing():
    if not os.path.exists(OUTPUT_FILE):
        return []
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        content = f.read().strip()
        if not content:
            return []
        return json.loads(content)


def parse_questions(text):
    pattern = re.compile(r'(?:\n|^)(\d+|[\u09E6-\u09EF]+)\.\s+', re.UNICODE)
    parts = pattern.split(text)
    questions = []

    i = 1
    while i < len(parts):
        header = parts[i].strip()
        body = parts[i + 1] if i + 1 < len(parts) else ""
        i += 2

        lines = [l.strip() for l in body.splitlines() if l.strip()]
        if len(lines) < 6:
            continue

        q_text = lines[0]
        source = lines[1]
        options = lines[2:6]
        explain_line = lines[6] if len(lines) > 6 else ""

        explain = ""
        if explain_line.lower().startswith("ব্যাখ্যা:"):
            explain = explain_line[len("ব্যাখ্যা:"):].strip()
        elif explain_line.lower().startswith("explain:"):
            explain = explain_line[len("explain:"):].strip()
        else:
            explain = explain_line

        questions.append({
            "q": q_text,
            "source": source,
            "options": options,
            "explain": explain
        })

    return questions


def main():
    existing_data = load_existing()

    # Find max id
    max_id = max((item.get("id", 0) for item in existing_data), default=0)

    # Build seen set from existing data for duplicate check
    seen_q = set()
    for item in existing_data:
        nq = normalize_q(item['q'])
        seen_q.add(nq)

    topics_id = 329

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    questions = parse_questions(text)

    if not questions:
        print("No questions found in input.txt")
        return

    new_objects = []
    skipped = 0
    for q in questions:
        # Duplicate check
        nq = normalize_q(q['q'])
        if nq in seen_q:
            skipped += 1
            continue
        seen_q.add(nq)

        ans = find_best_answer(q["options"], q["explain"])
        max_id += 1
        obj = {
            "id": max_id,
            "q": q["q"],
            "options": q["options"],
            "ans": ans,
            "source": q["source"],
            "topicsId": topics_id,
            "explain": q["explain"]
        }
        new_objects.append(obj)

    combined = existing_data + new_objects

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)

    print(f"Added {len(new_objects)} new questions. Last id: {max_id}")
    if skipped:
        print(f"Skipped {skipped} duplicates (already in database).")

    confirm = input("Clear input.txt? (y/n): ").strip().lower()
    if confirm == 'y':
        with open(INPUT_FILE, "w", encoding="utf-8") as f:
            f.write("")
        print("input.txt cleared.")


if __name__ == "__main__":
    main()