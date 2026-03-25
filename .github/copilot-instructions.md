# SulitMeal - AI Coding Guidelines

## Project Overview
SulitMeal is a smart meal-planning web application that generates customized weekly meal plans balancing nutritional goals with budget constraints. Features AI-driven meal generation, precision nutrition tracking, and Filipino food focus.

## Architecture Overview
- **Frontend**: React 19 + Vite with React Compiler
- **UI Framework**: Custom CSS with white (#ffffff) and dark gray (#222222) color scheme
- **State Management**: React hooks (useState) for wizard flow and meal planning
- **Styling**: Utility-first design with clean, data-driven aesthetic

## Key Technologies & Patterns

### React Patterns
- **Functional Components** with hooks
- **Wizard Flow**: Multi-step setup (Budget → People → Goals → Plan)
- **State Management**: Local state for user inputs and meal plan data
- **Event Handling**: Form inputs with controlled components

### Styling Approach
- **Primary Colors**: Professional blue-gray palette (#2d3748 text, #ffffff background)
- **Accent Colors**: Blue primary (#2b6cb0) and green secondary (#38a169) for health/food theme
- **Design System**: Consistent spacing, subtle borders (#e2e8f0), and modern shadows
- **Layout**: CSS Grid for responsive weekly meal display
- **Components**: Card-based design with smooth animations and gradients
- **Color Variables**: Comprehensive CSS custom properties for maintainable theming

### Component Structure
```
src/
├── components/
│   └── DayCard.jsx + DayCard.css  # Reusable day card component
└── App.jsx (Main component with wizard + meal plan views)
    ├── SetupWizard (4-step process)
    │   ├── Budget input
    │   ├── People count
    │   ├── Nutrition goals (grid layout)
    │   └── Generate plan button
    └── MealPlan (7-day grid using DayCard components)
        ├── DayCard components
        └── Export functionality
```

### Development Workflow
- **Start dev server**: `npm run dev` (requires Node.js 22.12+)
- **Build**: `npm run build` (React Compiler optimization)
- **Lint**: `npm run lint` (ESLint with React rules)
- **Preview**: `npm run preview`

### Code Patterns

#### State Management
```jsx
const [currentStep, setCurrentStep] = useState(1)
const [budget, setBudget] = useState('')
const [goals, setGoals] = useState({calories: 2000, protein: 150})
```

#### CSS Custom Properties
```css
:root {
  --text: #2d3748;           /* Primary text - professional blue-gray */
  --text-secondary: #718096; /* Secondary text */
  --text-light: #a0aec0;     /* Light text for details */
  --bg: #ffffff;             /* Pure white background */
  --bg-secondary: #f8fafc;   /* Light gray background */
  --bg-accent: #fef5e7;      /* Warm accent background */
  --primary: #2b6cb0;        /* Professional blue */
  --primary-light: #4299e1;  /* Light blue */
  --secondary: #38a169;      /* Health green */
  --secondary-light: #68d391; /* Light green */
  --accent: #ed8936;         /* Warm orange accent */
  --border: #e2e8f0;         /* Subtle borders */
  --border-light: #f1f5f9;   /* Very light borders */
  --shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  --shadow-light: rgba(0, 0, 0, 0.05) 0 2px 8px;
}
```

#### Secondary Color Usage
- **Header**: Blue to green gradient background
- **Step Indicators**: Blue gradient for active steps
- **Day Cards**: Blue-green gradient accents on hover
- **Buttons**: Blue gradient primary, outlined secondary
- **Accents**: Green underlines and highlights throughout
- **Modular components**: Extract reusable UI into separate components (e.g., DayCard)

#### Component Props Pattern
```jsx
// DayCard component example
<DayCard
  day="Monday"
  dailyBudget={500}
  meals={[
    { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450 },
    { type: 'Lunch', name: 'Tinola', price: 120, calories: 320 }
  ]}
  calorieGoal={2000}
/>
```

#### Filipino Food Integration
- Default meals: Tapsilog, Tinola, Sinigang na Baboy
- Pricing in Philippine Pesos (₱)
- Local ingredient considerations

## File References
- `src/App.jsx`: Main component with wizard logic and meal plan
- `src/components/DayCard.jsx`: Reusable day card component with props
- `src/components/DayCard.css`: Component-specific styling
- `src/App.css`: Layout and wizard styling
- `src/index.css`: Global styles and CSS custom properties
- `vite.config.js`: React Compiler configuration
- `eslint.config.js`: Linting rules for React development