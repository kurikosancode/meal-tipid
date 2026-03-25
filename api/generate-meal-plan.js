import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { budget, people, goals } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // FIX 1: Add generationConfig to force JSON output
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Create a weekly meal plan for Filipino families with these requirements:
      - Budget: ₱${budget} total for the week
      - Number of people: ${people}
      - Daily calories: ${goals.calories}
      - Protein: ${goals.protein}g, Carbs: ${goals.carbs}g, Fat: ${goals.fat}g

      Return a JSON array of 7 objects (Monday-Sunday). 
      Format: {"day": "Monday", "meals": [{"type": "Breakfast", "name": "string", "price": number, "calories": number, "ingredients": "item1\\nitem2"}]}
      Use popular Filipino dishes. Keep within budget.
      Return ONLY the JSON array.
    `;

    const result = await model.generateContent(prompt);
    
    // FIX 2: Sanitize the string before parsing
    let text = result.response.text();
    
    // This removes common Markdown artifacts if the model ignores the config
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const mealPlan = JSON.parse(cleanJson);

    res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate meal plan', 
      details: error.message 
    });
  }
}