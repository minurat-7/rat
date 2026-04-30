# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository has two parts:

1. **Python coding exercises** — solutions to problems from Baekjoon Online Judge (BOJ), organized by concept
2. **`webapp/`** — a React + Vite study planner web app (see below)

## Python Exercises

No build system or test runner. Each `.py` file is a standalone solution runnable with:

```bash
python3 <file>.py
```

Problems that require input can be tested by piping input:

```bash
echo "1 2" | python3 io/1000.py
```

### Directory structure

| Directory | Concept |
|-----------|---------|
| `io/`     | Input/output, `input()`, `map()`, `split()` |
| `if/`     | Conditionals (`if`/`elif`/`else`, `and`/`or`) |
| `loop/`   | `for`/`while` loops, nested loops |
| `list/`   | List operations, `max()`, `sum()`, indexing |

File names are the BOJ problem numbers (e.g., `1000.py` = BOJ #1000).

## Webapp (Study Planner)

Located in `webapp/`. React + Vite frontend, no backend — all state in LocalStorage.

```bash
cd webapp
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build
```

### Architecture

- `src/data/schedule.js` — hardcoded Apr 26 ~ Jun 6 schedule + F&E problem table
- `src/hooks/useTasks.js` — LocalStorage read/write and rollover logic
- `src/components/DayView.jsx` — main view showing today's tasks
- `src/components/TaskItem.jsx` — individual checkbox row
- `src/components/DateNav.jsx` — previous/next day navigation

### Key behaviors

- **Rollover**: unchecked tasks automatically carry over to the next day on app load (compares last-visited date to today)
- **LocalStorage schema**: `{ checks: { "YYYY-MM-DD": { taskId: bool } }, rollovers: { "YYYY-MM-DD": [...] } }`
- **Task types**: `tball` (T.ball math problems), `lecture` (인강), `fe` (F&E fungo/entry sets), `event` (모의고사/더프)
