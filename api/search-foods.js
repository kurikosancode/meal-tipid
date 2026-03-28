import { readFile } from 'node:fs/promises'
import path from 'node:path'

async function loadCustomFoods() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'config', 'customFoods.json')
    const fileContents = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(fileContents)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : DEFAULT_CUSTOM_FOODS
  } catch (error) {
    console.error('customFoods.json load error:', error)
    return []
  }
}

function buildFallbackFoods(customFoods) {
  return [
    ...customFoods,
  'Chicken Curry',
  'Beef Caldereta',
  'Pork Menudo',
  'Arroz Caldo',
  'Monggo Soup'
  ]
}

function dedupe(list) {
  return [...new Set(list.filter(Boolean))]
}

async function fetchFoodSuggestions(query, customFoods) {
  const fallbackFoods = buildFallbackFoods(customFoods)
  const mealResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
  )

  if (!mealResponse.ok) {
    throw new Error('External API request failed')
  }

  const mealData = await mealResponse.json()
  const meals = Array.isArray(mealData.meals) ? mealData.meals : []

  const normalizedQuery = query.toLowerCase()

  const fromApi = meals
    .map((meal) => meal?.strMeal)
    .filter(Boolean)

  const fromCustom = customFoods.filter((food) => food.toLowerCase().includes(normalizedQuery))
  const fromFallback = fallbackFoods.filter((food) => food.toLowerCase().includes(normalizedQuery))

  const suggestions = dedupe([
    ...fromCustom,
    ...fromApi,
    ...fromFallback,
    ...fallbackFoods
  ]).slice(0, 15)

  return suggestions
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const customFoods = await loadCustomFoods()
  const fallbackFoods = buildFallbackFoods(customFoods)

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!query || query.length < 2) {
    return res.status(200).json({ foods: fallbackFoods })
  }

  try {
    const foods = await fetchFoodSuggestions(query, customFoods)
    return res.status(200).json({ foods })
  } catch (error) {
    console.error('search-foods error:', error)
    const localMatches = fallbackFoods.filter((food) =>
      food.toLowerCase().includes(query.toLowerCase())
    )
    return res.status(200).json({ foods: localMatches.length > 0 ? localMatches : fallbackFoods })
  }
}