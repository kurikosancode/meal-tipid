import { useState } from 'react'

const SAMPLE_MEALS = [
  { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450 },
  { type: 'Lunch', name: 'Tinola', price: 120, calories: 320 },
  { type: 'Dinner', name: 'Sinigang na Baboy', price: 150, calories: 380 }
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function useMealGeneration() {
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const resetMealPlan = () => {
    setMealPlan(null)
    setError(null)
    setLoading(false)
  }

  const generateMealPlan = async (budget, preferences, preferredFoods, goals) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, preferences, preferredFoods, goals })
      })

      if (!response.ok) {
        let details = 'Unknown server error'
        try {
          const errorBody = await response.json()
          details = errorBody?.details || errorBody?.error || details
        } catch {
          details = `HTTP ${response.status}`
        }
        throw new Error(details)
      }

      const meals = await response.json()
      setMealPlan(meals)
    } catch (err) {
      console.error('Error:', err)
      setError(`AI generation failed (${err.message}). Using sample meals.`)
      setMealPlan(DAYS.map((day) => ({ day, meals: SAMPLE_MEALS })))
    } finally {
      setLoading(false)
    }
  }

  return {
    mealPlan,
    loading,
    error,
    generateMealPlan,
    resetMealPlan
  }
}
