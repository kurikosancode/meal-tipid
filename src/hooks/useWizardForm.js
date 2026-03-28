import { useState } from 'react'

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
  protein: 100,
  carbs: 250,
  fat: 65
}

export function useWizardForm() {
  const [budget, setBudget] = useState(String(DEFAULT_BUDGET))
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [preferredFoods, setPreferredFoods] = useState([])
  const [goals, setGoals] = useState(DEFAULT_GOALS)

  return {
    budget,
    setBudget,
    preferences,
    setPreferences,
    preferredFoods,
    setPreferredFoods,
    goals,
    setGoals
  }
}
