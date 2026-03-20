# FunQuest - Quiz System for Children

Fun Quest quiz game built with **React + Vite**.

## Overview
Choose a difficulty level and answer multiple-choice questions before the timer runs out. Your score is shown at the end.

## Difficulty & Timer
Each question has a per-level countdown (timer resets per question):

- `Easy`: 30 seconds
- `Medium`: 20 seconds
- `Hard`: 10 seconds

## Features

- Difficulty selection screen (`Easy`, `Medium`, `Hard`)
- Circular countdown timer with auto-fail when time runs out
- Next/Previous navigation while unanswered
- Result screen with score summary and confetti on passing
- Sound effects for clicks and correct/incorrect answers

## Tech Stack

- React (UI)
- Vite (dev server + build)
- Tailwind CSS (styling)
- Framer Motion (animations)

## Setup & Run

1. Install dependencies
   - `npm install`
2. Start development server
   - `npm run dev`
3. Open the URL shown in the terminal (usually `http://localhost:5173`)

## Build for Production

- `npm run build`
- Preview the production build
  - `npm run preview`






