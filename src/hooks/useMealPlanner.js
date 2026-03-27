import { useEffect, useState } from 'react'
import { WIZARD_STEPS } from '../config/wizardSteps'

const DEFAULT_BUDGET = 5000
const DEFAULT_PREFERENCES = {
  vegan: false,
  vegetarian: false,
  halal: false,
  pescatarian: false,
  noRestrictions: true
}
const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SAMPLE_MEALS = [
  { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450 },
  { type: 'Lunch', name: 'Tinola', price: 120, calories: 320 },
  { type: 'Dinner', name: 'Sinigang na Baboy', price: 150, calories: 380 }
]

function useMealPlanner() {
  const [currentStep, setCurrentStep] = useState(1)
  const [budget, setBudget] = useState(String(DEFAULT_BUDGET))
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [darkMode, setDarkMode] = useState(false)
  const [goals, setGoals] = useState(DEFAULT_GOALS)
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const firstStepId = WIZARD_STEPS[0]?.id ?? 1
  const lastStepId = WIZARD_STEPS[WIZARD_STEPS.length - 1]?.id ?? firstStepId
  const lastInputStepId = [...WIZARD_STEPS].reverse().find((step) => step.component)?.id ?? firstStepId
  const currentStepIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStep)
  const currentStepConfig = WIZARD_STEPS.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepConfig?.component

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const handleNext = async () => {
    if (currentStep === lastInputStepId) {
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
        setMealPlan(DAYS.map((day) => ({ day, meals: SAMPLE_MEALS })))
      } finally {
        setLoading(false)
      }
    }

    if (currentStepIndex >= 0 && currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1].id)
    }
  }

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const resetToFirstStep = () => {
    setCurrentStep(firstStepId)
  }

  return {
    budget,
    setBudget,
    preferences,
    setPreferences,
    darkMode,
    goals,
    setGoals,
    mealPlan,
    loading,
    error,
    firstStepId,
    lastStepId,
    lastInputStepId,
    currentStep,
    currentStepIndex,
    CurrentStepComponent,
    currentStepConfig,
    days: DAYS,
    sampleMeals: SAMPLE_MEALS,
    handleNext,
    handleBack,
    handleToggleDarkMode,
    resetToFirstStep
  }
}

export default useMealPlanner
