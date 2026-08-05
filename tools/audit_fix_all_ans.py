#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Full audit and fix of all wrong ans + remove duplicate questions in karokobivokti.json
"""

import json
import re
import os

FILE = r"D:\antigravity\bcspark\data\t20\bangla\grammar\theory\karokobivokti.json"


def normalize(text):
    """Normalize text for comparison"""
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
    """Normalize question text for duplicate detection"""
    t = text.lower().strip()
    t = re.sub(r'[\u0964\u0965,?!:;"\'()\u2013\u2014-]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def score_option(option, explain):
    """Score how well an option matches the explanation (0-31)"""
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
    """Find the best matching option index (0-3)"""
    scores = [score_option(opt, explain) for opt in options]
    best_idx = scores.index(max(scores))
    return best_idx, scores


def main():
    # Load data
    with open(FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = len(data)
    print(f"Total items loaded: {total}")
    print()

    # ─── PART A: Fix wrong ans ───
    fixes = []
    for item in data:
        q = item['q']
        options = item['options']
        explain = item['explain']
        current_ans = item['ans']
        item_id = item['id']

        best_idx, scores = find_best_answer(options, explain)

        if best_idx != current_ans:
            fixes.append({
                'id': item_id,
                'q': q,
                'old': current_ans,
                'new': best_idx,
                'old_text': options[current_ans],
                'new_text': options[best_idx],
                'scores': scores
            })
            item['ans'] = best_idx

    print(f"Total ans fixed: {len(fixes)}")
    if fixes:
        print("\nList of ans fixed:")
        for f in fixes:
            print(f"  id={f['id']}: {f['old']} -> {f['new']} | q={f['q'][:60]}...")
            print(f"    Old: {f['old_text']}")
            print(f"    New: {f['new_text']}")
            print(f"    Scores: {f['scores']}")
    print()

    # ─── PART B: Remove duplicates ───
    seen = {}
    duplicates = []
    keep_ids = set()

    for item in data:
        item_id = item['id']
        nq = normalize_q(item['q'])
        if nq in seen:
            duplicates.append({'remove_id': item_id, 'keep_id': seen[nq], 'q': item['q']})
        else:
            seen[nq] = item_id
            keep_ids.add(item_id)

    # Filter out duplicates
    cleaned = [item for item in data if item['id'] in keep_ids]

    print(f"Total duplicates found: {len(duplicates)}")
    if duplicates:
        print("\nList of duplicates removed:")
        for d in duplicates:
            print(f"  Removed id={d['remove_id']} (duplicate of id={d['keep_id']}) | q={d['q'][:60]}...")
    print()

    # Re-assign sequential ids
    for i, item in enumerate(cleaned, 1):
        item['id'] = i

    # Save
    with open(FILE, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    print(f"Final total count after cleanup: {len(cleaned)}")
    print(f"File saved to: {FILE}")


if __name__ == "__main__":
    main()