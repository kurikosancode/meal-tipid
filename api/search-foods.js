const FALLBACK_FOODS = [
  'Chicken Adobo',
  'Sinigang na Baboy',
  'Tinola',
  'Tapsilog',
  'Pancit Canton',
  'Ginisang Monggo',
  'Bangus Sisig',
  'Laing',
  'Tokwa at Baboy',
  'Lumpiang Shanghai',
  'Chicken Afritada',
  'Pinakbet'
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!query || query.length < 2) {
    return res.status(200).json({ foods: FALLBACK_FOODS })
  }

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error('External API request failed')
    }

    const data = await response.json()
    const meals = Array.isArray(data.meals) ? data.meals : []

    const foods = meals
      .map((meal) => meal.strMeal)
      .filter(Boolean)
      .slice(0, 15)

    if (foods.length === 0) {
      const localMatches = FALLBACK_FOODS.filter((food) =>
        food.toLowerCase().includes(query.toLowerCase())
      )
      return res.status(200).json({ foods: localMatches.length > 0 ? localMatches : FALLBACK_FOODS })
    }

    return res.status(200).json({ foods })
  } catch (error) {
    console.error('search-foods error:', error)
    const localMatches = FALLBACK_FOODS.filter((food) =>
      food.toLowerCase().includes(query.toLowerCase())
    )
    return res.status(200).json({ foods: localMatches.length > 0 ? localMatches : FALLBACK_FOODS })
  }
}