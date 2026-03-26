import { useState, useEffect } from 'react'
import './App.css'
import DayCard from './components/DayCard'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [budget, setBudget] = useState('')
  const [preferences, setPreferences] = useState({
    vegan: false,
    vegetarian: false,
    halal: false,
    pescatarian: false,
    noRestrictions: true
  })
  const [darkMode, setDarkMode] = useState(false)
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  })
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Sample meal data - fallback if Gemini call fails
  const sampleMeals = [
    { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450 },
    { type: 'Lunch', name: 'Tinola', price: 120, calories: 320 },
    { type: 'Dinner', name: 'Sinigang na Baboy', price: 150, calories: 380 }
  ]

  const handleNext = async () => {
    if (currentStep === 3) {
      // Generate meal plan when reaching step 3
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/generate-meal-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budget, preferences, goals })
        })

        if (!response.ok) {
          throw new Error('Failed to generate meal plan')
        }

        const meals = await response.json()
        setMealPlan(meals)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to generate meal plan. Using sample meals.')
        // Use sample meals as fallback
        setMealPlan(days.map(day => ({ day, meals: sampleMeals })))
      } finally {
        setLoading(false)
      }
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // Debug dark mode toggle
  const handleToggleDarkMode = () => {
    console.log('Toggle clicked, current:', darkMode)
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
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
        {currentStep < 4 ? (
          <div className="setup-wizard">
            <div className="wizard-header">
              <div className="step-indicator">
                <span className={currentStep >= 1 ? 'active' : ''}>1</span>
                <span className={currentStep >= 2 ? 'active' : ''}>2</span>
                <span className={currentStep >= 3 ? 'active' : ''}>3</span>
                <span className={currentStep >= 4 ? 'active' : ''}>4</span>
              </div>
              <h2>
                {currentStep === 1 && 'Set Your Weekly Budget'}
                {currentStep === 2 && 'Select Food Preferences'}
                {currentStep === 3 && 'Nutrition Goals'}
                {currentStep === 4 && 'Your Meal Plan'}
              </h2>
            </div>

            <div className="wizard-content">
              {currentStep === 1 && (
                <div className="step-content">
                  <label htmlFor="budget">Weekly Budget (₱)</label>
                  <input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    min="1000"
                    max="50000"
                  />
                  <p className="help-text">Enter your total weekly food budget in Philippine Pesos</p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content">
                  <label>Food Preferences</label>
                  <div className="preferences-list">
                    <button
                      type="button"
                      className={`preference-item ${preferences.vegan ? 'selected' : ''}`}
                      onClick={() => setPreferences({ ...preferences, vegan: !preferences.vegan, noRestrictions: false })}
                    >
                      <span className="checkmark">{preferences.vegan ? '✓' : ''}</span>
                      <label>Vegan</label>
                    </button>
                    <button
                      type="button"
                      className={`preference-item ${preferences.vegetarian ? 'selected' : ''}`}
                      onClick={() => setPreferences({ ...preferences, vegetarian: !preferences.vegetarian, noRestrictions: false })}
                    >
                      <span className="checkmark">{preferences.vegetarian ? '✓' : ''}</span>
                      <label>Vegetarian</label>
                    </button>
                    <button
                      type="button"
                      className={`preference-item ${preferences.halal ? 'selected' : ''}`}
                      onClick={() => setPreferences({ ...preferences, halal: !preferences.halal, noRestrictions: false })}
                    >
                      <span className="checkmark">{preferences.halal ? '✓' : ''}</span>
                      <label>Halal</label>
                    </button>
                    <button
                      type="button"
                      className={`preference-item ${preferences.pescatarian ? 'selected' : ''}`}
                      onClick={() => setPreferences({ ...preferences, pescatarian: !preferences.pescatarian, noRestrictions: false })}
                    >
                      <span className="checkmark">{preferences.pescatarian ? '✓' : ''}</span>
                      <label>Pescatarian</label>
                    </button>
                    <button
                      type="button"
                      className={`preference-item ${preferences.noRestrictions ? 'selected' : ''}`}
                      onClick={() => setPreferences({ ...preferences, noRestrictions: !preferences.noRestrictions, vegan: false, vegetarian: false, halal: false, pescatarian: false })}
                    >
                      <span className="checkmark">{preferences.noRestrictions ? '✓' : ''}</span>
                      <label>No Restrictions</label>
                    </button>
                  </div>
                  <p className="help-text">Select your dietary preferences for meal recommendations</p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content">
                  <div className="nutrition-goals">
                    <div className="goal-item">
                      <label htmlFor="calories">Daily Calories</label>
                      <input
                        id="calories"
                        type="number"
                        value={goals.calories}
                        onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
                      />
                    </div>
                    <div className="goal-item">
                      <label htmlFor="protein">Protein (g)</label>
                      <input
                        id="protein"
                        type="number"
                        value={goals.protein}
                        onChange={(e) => setGoals({ ...goals, protein: e.target.value })}
                      />
                    </div>
                    <div className="goal-item">
                      <label htmlFor="carbs">Carbs (g)</label>
                      <input
                        id="carbs"
                        type="number"
                        value={goals.carbs}
                        onChange={(e) => setGoals({ ...goals, carbs: e.target.value })}
                      />
                    </div>
                    <div className="goal-item">
                      <label htmlFor="fat">Fat (g)</label>
                      <input
                        id="fat"
                        type="number"
                        value={goals.fat}
                        onChange={(e) => setGoals({ ...goals, fat: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="wizard-actions">
              {currentStep > 1 && (
                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              <button className="btn-primary" onClick={handleNext} disabled={loading}>
                {loading ? 'Generating...' : currentStep === 3 ? 'Generate Plan' : 'Next'}
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
                    .join(', ') || 'No restrictions'}
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
                days.map((day) => (
                  <DayCard
                    key={day}
                    day={day}
                    dailyBudget={Math.floor(budget / 7)}
                    meals={sampleMeals}
                    calorieGoal={goals.calories}
                  />
                ))
              )}
            </div>
            {error && <div style={{ color: '#e53e3e', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

            <div className="plan-actions">
              <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
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
