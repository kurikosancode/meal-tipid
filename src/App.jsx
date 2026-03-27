import './App.css'
import DayCard from './components/DayCard'
import { WIZARD_STEPS } from './config/wizardSteps'
import { useWizardForm } from './hooks/useWizardForm'
import { useWizardNavigation } from './hooks/useWizardNavigation'
import { useMealGeneration } from './hooks/useMealGeneration'
import { useDarkMode } from './hooks/useDarkMode'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SAMPLE_MEALS = [
  { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450 },
  { type: 'Lunch', name: 'Tinola', price: 120, calories: 320 },
  { type: 'Dinner', name: 'Sinigang na Baboy', price: 150, calories: 380 }
]

function App() {
  const {
    budget,
    setBudget,
    preferences,
    setPreferences,
    preferredFoods,
    setPreferredFoods,
    goals,
    setGoals
  } = useWizardForm()
  const { currentStepId, currentStepIndex, currentStepConfig, CurrentStepComponent, lastInputStepId, handleNext, handleBack, resetToFirstStep } = useWizardNavigation()
  const { mealPlan, loading, error, generateMealPlan, resetMealPlan } = useMealGeneration()
  const { darkMode, handleToggleDarkMode } = useDarkMode()

  const isPlanView = Boolean(mealPlan)

  const handleNextWithGeneration = async () => {
    const movedToNextStep = handleNext()
    if (!movedToNextStep && currentStepId === lastInputStepId) {
      await generateMealPlan(budget, preferences, preferredFoods, goals)
    }
  }

  const handleStartOver = () => {
    resetMealPlan()
    resetToFirstStep()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>MealTipid</h1>
        <p>Smart Meal Planning for Filipinos</p>
      </header>
      <button className="dark-mode-toggle" onClick={handleToggleDarkMode} title="Toggle dark mode">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <main className="main">
        {!isPlanView ? (
          <div className="setup-wizard">
            <div className="wizard-header">
              <div className="step-indicator">
                {WIZARD_STEPS.map((step, index) => (
                  <span key={step.id} className={index <= currentStepIndex ? 'active' : ''}>{index + 1}</span>
                ))}
              </div>
              <h2>{currentStepConfig?.title}</h2>
            </div>

            <div className="wizard-content">
              {CurrentStepComponent ? (
                <CurrentStepComponent
                  budget={budget}
                  setBudget={setBudget}
                  preferences={preferences}
                  setPreferences={setPreferences}
                  preferredFoods={preferredFoods}
                  setPreferredFoods={setPreferredFoods}
                  goals={goals}
                  setGoals={setGoals}
                />
              ) : null}
            </div>

            <div className="wizard-actions">
              {currentStepIndex > 0 && (
                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              <button className="btn-primary" onClick={handleNextWithGeneration} disabled={loading}>
                {loading ? 'Generating...' : currentStepId === lastInputStepId ? 'Generate Plan' : 'Next'}
              </button>
            </div>
          </div>
        ) : (

          <div className="meal-plan">
            <div className="plan-header">
              <h2>Your Weekly Meal Plan</h2>
              <div className="plan-summary">
                <span>Budget: ₱{budget}</span>
                <span>
                  Preferences: {Object.entries(preferences)
                    .filter(([key, value]) => value && key !== 'noRestrictions')
                    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                    .join(', ') || 'None'}
                </span>
                <span>Daily Goal: {goals.calories} cal</span>
              </div>
            </div>

            <div className="weekly-grid">
              {mealPlan ? (
                mealPlan.map((dayPlan) => (
                  <DayCard
                    key={dayPlan.day || dayPlan.day}
                    day={dayPlan.day}
                    meals={dayPlan.meals}
                  />
                ))
              ) : (
                DAYS.map((day) => (
                  <DayCard
                    key={day}
                    day={day}
                    dailyBudget={Math.floor(budget / 7)}
                    meals={SAMPLE_MEALS}
                    calorieGoal={goals.calories}
                  />
                ))
              )}
            </div>
            {error && <div style={{ color: '#e53e3e', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

            <div className="plan-actions">
              <button className="btn-secondary" onClick={handleStartOver}>
                Start Over
              </button>
              <button className="btn-primary">
                Export Plan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App;
