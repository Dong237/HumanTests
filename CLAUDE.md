# HumanTests - Psychological Test Suite

## Overview
A collection of 9 classical psychological tests for measuring **talent**, **character**, and **interest**. All built as standalone React web apps with a shared Excalidraw-style UI aesthetic.

## Architecture

### Directory Structure
```
HumanTests/
├── character/           # Personality & behavior tests
│   ├── bigfive-test/    # Big Five (OCEAN) - 240Q, 5 dims, port 5174
│   ├── mbti-test/       # MBTI 16 types - 70Q, 4 dichotomies, port 5176
│   ├── disc-test/       # DISC behavior - 28Q, 4 types, port 5177
│   ├── 16pf-test/       # Cattell 16PF - 163Q, 16 factors, port 5178
│   └── enneagram-test/  # Enneagram - 90Q, 9 types, port 5179
├── talent/              # Strengths & ability tests
│   ├── dips-talent-test/    # DIPS talent - 40Q, 10 dims, port 5175
│   └── via-strengths-test/  # VIA strengths - 120Q, 24 strengths, port 5180
├── interest/            # Vocational interest tests
│   ├── holland-riasec-test/    # Holland RIASEC - 60Q, 6 types, port 5181
│   └── onet-interest-profiler/ # O*NET Interest Profiler - 60Q, 6 types, port 5182
└── CLAUDE.md
```

### Tech Stack (all tests)
- React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + Recharts
- jsPDF + html2canvas for PDF export
- localStorage for progress persistence

### Shared Pattern (each test app)
```
<test>/
├── package.json, vite.config.ts, tailwind.config.js, tsconfig*.json
├── src/
│   ├── App.tsx              # 3-view state: intro → test → results
│   ├── index.css            # Excalidraw-style components
│   ├── types/index.ts       # Test-specific interfaces
│   ├── utils/scoring.ts     # Test-specific scoring algorithm
│   ├── utils/download.ts    # PDF/CSV/JSON/clipboard export
│   ├── data/*.json          # Questions, scoring config, explanations
│   └── components/          # TestIntro, TestFlow, QuestionCard, Results, charts
```

### Excalidraw UI Classes
- `.excalidraw-card` — white card with 2px border, 4px offset shadow
- `.excalidraw-button` — 3px border, hover lift, active press
- `.progress-bar` / `.progress-fill` — bordered progress indicator

## Commands
```bash
# Run any test
cd <category>/<test-name> && npm run dev

# Build any test
cd <category>/<test-name> && npm run build
```

## Key Conventions
- Every test intro page cites its source with a hyperlink
- All questions are in Chinese
- localStorage key pattern: `<test-name>-progress`
- Ports: 5174-5182 (one per test)

## Question Sources
All from public domain or open-source:
- IPIP (ipip.ori.org) — BigFive, 16PF, Holland RIASEC, VIA
- O*NET Center (onetcenter.org) — O*NET Interest Profiler
- OpenPsychometrics — DISC (ODAT)
- Open-source implementations — MBTI, Enneagram
