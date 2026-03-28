import { GoogleGenerativeAI } from "@google/generative-ai";

const AI_MODEL  = "gemini-2.5-flash"; // Updated to the correct model name

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { budget, preferences = {}, preferredFoods = [], goals } = req.body;
    const selectedPreferences = Object.entries(preferences)
      .filter(([key, value]) => value && key !== 'noRestrictions')
      .map(([key]) => key);
    const dietaryLine = selectedPreferences.length > 0
      ? selectedPreferences.join(', ')
      : 'None';
    const preferredFoodsLine = Array.isArray(preferredFoods) && preferredFoods.length > 0
      ? preferredFoods.join(', ')
      : 'None';
    const totalBudget = Number(budget) || 0;
    const dailyBudget = totalBudget > 0 ? totalBudget / 7 : 0;
    const goalCalories = Number(goals?.calories) || 2000;
    const goalProtein = Number(goals?.protein) || 0;
    const goalCarbs = Number(goals?.carbs) || 0;
    const goalFat = Number(goals?.fat) || 0;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 1. Ensure model name is correct (1.5-flash is the stable JSON-capable model)
    const model = genAI.getGenerativeModel({ model: AI_MODEL });

    const prompt = `
    You are a JSON generator.

    Return ONLY valid JSON.
    No markdown. No explanation.

    Generate a 7-day Filipino meal plan.

    Constraints:
    - Total weekly budget: ₱${totalBudget}
    - Daily budget cap: ₱${dailyBudget.toFixed(2)}
    - Goal: Calories ${goalCalories}, Protein ${goalProtein}g, Carbs ${goalCarbs}g, Fat ${goalFat}g
    - Dietary preferences: ${dietaryLine}
    - Preferred foods: ${preferredFoodsLine}

    Rules:
    - Output exactly 7 items (Monday to Sunday), each with Breakfast, Lunch, Dinner.
    - The total cost of meals for each day MUST be <= ₱${dailyBudget.toFixed(2)}.
    - The sum of meal prices MUST equal day.totalPrice.
    - The sum of meal calories MUST equal day.totalCalories.
    - The sum of meal protein/fat/carbs MUST equal day.totalProtein/day.totalFat/day.totalCarbs.
    - Keep day calories close to goal (${goalCalories}) with a tolerance of +/-10%.
    - Keep day macros close to goals with tolerance of +/-15% where possible.
    - Macro-calorie consistency: (protein*4 + carbs*4 + fat*9) should be reasonably close to calories (within +/-20%).
    - Prices and macros should be realistic for Filipino meals and serving sizes.
    - Use numbers only (no units in numeric fields), no negatives.
    - Strictly follow dietary preferences when provided.
    - Prioritize preferred foods when compatible with dietary preferences and budget.
    - If preference includes vegan: no meat, fish, eggs, dairy, honey.
    - If preference includes vegetarian: no meat or fish.
    - If preference includes halal: only halal-compliant dishes and proteins.
    - If preference includes pescatarian: fish/seafood allowed, no other meat.
    - In the components, only state the main components of the meal.
    - Also state the serving size of the components and separate them with comma. For example, "Tapa - 150g, Rice - 250g, Egg - 1pc".
    - With the name of the meal, make it short and concise. For example, instead of "Tapsilog with Egg and Rice", just state "Tapsilog".
    - For EACH meal, include numeric macros: "protein", "fat", and "carbs" in grams.
    - IMPORTANT: Macro field names MUST be exactly "protein", "fat", and "carbs".

    Schema:
    [
      {
        "day": "Monday",
        "meals": [
          {
            "type": "Breakfast",
            "name": "string",
            "price": number,
            "calories": number,
            "protein": number,
            "fat": number,
            "carbs": number,
            "components": "string"
          }
        ],
        "totalPrice": number,
        "totalCalories": number,
        "totalProtein": number,
        "totalFat": number,
        "totalCarbs": number
      }
    ]

    Example Output:
    [
      {
        "day": "Monday",
        "meals": [
          {
            "type": "Breakfast",
            "name": "Tapsilog",
            "price": 85,
            "calories": 450,
            "protein": 28,
            "fat": 16,
            "carbs": 48,
            "components": "Tapa - 150g, Rice - 250g, Egg - 1pc"
          },
          {
            "type": "Lunch",
            "name": "Tinola",
            "price": 120,
            "calories": 320,
            "protein": 32,
            "fat": 10,
            "carbs": 24,
            "components": "Rice - 250g, Tinola - 250g"
          },
          {
            "type": "Dinner",
            "name": "Sinigang na Baboy",
            "price": 150,
            "calories": 380,
            "protein": 26,
            "fat": 14,
            "carbs": 35,
            "components": "Rice - 250g, Sinigang - 350g"
          }
        ],
        "totalPrice": 355,
        "totalCalories": 1150,
        "totalProtein": 86,
        "totalFat": 40,
        "totalCarbs": 107
      }
    ]
    `;

    // 2. Pass the config directly into the generateContent call
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    
    // 3. Safety trim (still a good practice)
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const mealPlan = JSON.parse(cleanJson);

    const toNumber = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    // 4. Normalize fields and enforce computed daily totals for consistency.
    const normalizedPlan = (Array.isArray(mealPlan) ? mealPlan : []).map((day) => {
      const meals = (Array.isArray(day?.meals) ? day.meals : []).map((meal) => ({
        ...meal,
        price: toNumber(meal?.price),
        calories: toNumber(meal?.calories),
        protein: toNumber(meal?.protein),
        fat: toNumber(meal?.fat),
        carbs: toNumber(meal?.carbs),
        components: meal?.components || meal?.ingredients || ''
      }));

      const totalPrice = meals.reduce((sum, meal) => sum + meal.price, 0);
      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);

      return {
        ...day,
        meals,
        totalPrice: Math.round(totalPrice * 100) / 100,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalFat: Math.round(totalFat),
        totalCarbs: Math.round(totalCarbs)
      };
    });

    res.status(200).json(normalizedPlan);
  } catch (error) {
    console.error('Error Details:', error);
    res.status(500).json({ error: 'Generation Failed', details: error.message });
  }
}