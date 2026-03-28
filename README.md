# MealTipid

MealTipid is a meal-planning web app that generates weekly Filipino meal plans based on budget, dietary preferences, and macro goals.

<p align="center"> <img src="docs/images/preview.png" alt="MealTipid Preview" width="900" /> </p>

## What It Does

- Generates a 7-day meal plan (Breakfast, Lunch, Dinner) with AI
- Balances calories, protein, fat, and carbs per day
- Supports dietary filters (vegan, vegetarian, halal, pescatarian)
- Supports preferred-food suggestions/autocomplete
- Lets you edit meals directly in the plan view
- Exports meal plans to PDF, PNG, and CSV

## Tech Stack

- Frontend: React 19 + Vite
- AI: Google Gemini (`gemini-2.5-flash`)
- Search suggestions: TheMealDB + local custom foods
- Export:
	- PDF: `@react-pdf/renderer`
	- PNG: `html2canvas` (template-based image export)
	- CSV: in-app generator


## Vibe Coding
- GitHub Copilot
- ChatGPT