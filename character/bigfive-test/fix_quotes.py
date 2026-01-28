#!/usr/bin/env python3
import json
import re

def fix_json_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace curly quotes in the JSON string values only
    # This preserves the structural JSON quotes
    content = re.sub(r'(?<=\"text\": \")([^\"]+)(?=\")',
                    lambda m: m.group(1).replace('"', '\\"').replace('"', '\\"'),
                    content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    # Validate
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f'{filename}: Valid JSON ✓')
        return True
    except json.JSONDecodeError as e:
        print(f'{filename}: Invalid JSON - {e}')
        return False

# Fix both JSON files
fix_json_file('src/data/bigfive-questions-raw.json')
fix_json_file('src/data/bigfive-scoring.json')
