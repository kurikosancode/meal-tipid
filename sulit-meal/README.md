# MealTipid

A smart meal-planning web application designed to bridge the gap between nutritional goals and financial constraints. MealTipid generates fully customized weekly meal plans that adhere to a specific budget while hitting precise macronutrient targets.

## Features

- **AI-Driven Meal Generation**: Creates 7-day plans based on weekly budget with even distribution
- **Precision Nutrition**: Set specific targets for calories, protein, and macronutrients
- **Filipino Food Focus**: Default meal suggestions featuring authentic Filipino dishes
- **Budget Optimization**: Considers serving sizes and bulk-buy logic for families/groups
- **Flexible Database**: Select from built-in foods with dynamic local pricing
- **Export Options**: One-click export to PDF, PNG, or CSV

## Tech Stack

- **Frontend**: React 19 + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: CSS with custom properties
- **Build Tool**: Vite with React Compiler
- **Linting**: ESLint with React rules

## Getting Started

### Prerequisites
- Node.js 22.12.0 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── DayCard.jsx + DayCard.css  # Reusable day card component
├── App.jsx                       # Main application component
├── App.css                       # Main application styles
└── index.css                     # Global styles and variables
```
