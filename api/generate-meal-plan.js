import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { budget, people, goals } = req.body;

    // Initialize Gemini (API key comes from environment variables)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create prompt for Gemini
    const prompt = `
      Create a weekly meal plan for Filipino families with these requirements:
      - Budget: ₱${budget} for the week
      - Number of people: ${people}
      - Daily calorie goal: ${goals.calories}
      - Protein: ${goals.protein}g daily
      - Carbs: ${goals.carbs}g daily
      - Fat: ${goals.fat}g daily

      Return a JSON array with 7 days (Monday-Sunday). Each day should have:
      {
        "day": "Monday",
        "meals": [
          { "type": "Breakfast", "name": "meal name", "price": 50-100, "calories": 400-500, "ingredients": "Tapa - 150g\\nRice - 250g\\nEgg - 1pc" },
          { "type": "Lunch", "name": "meal name", "price": 100-150, "calories": 600-800, "ingredients": "Rice - 250g\\nUlam - XXXg" },
          { "type": "Dinner", "name": "meal name", "price": 100-150, "calories": 500-700, "ingredients": "Rice - 250g\\nUlam - XXXg" }
        ]
      }

      Use popular Filipino dishes. Keep within budget constraints.
      For ingredients, list all main components on SEPARATE LINES using \\n (newline).
      Include rice, bread, or main starch. For compound meals like -ilog foods, include all parts (e.g., Tapa, Rice, Egg for Tapsilog).
      Return ONLY valid JSON array, no other text.
    `;

    const result = await model.generateContent(prompt);
    const mealPlan = JSON.parse(result.response.text());

    res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan', details: error.message });
  }
}
