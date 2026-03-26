import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { budget, people, goals } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 1. Ensure model name is correct (1.5-flash is the stable JSON-capable model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a JSON generator.

    Return ONLY valid JSON.
    No markdown. No explanation.

    Generate a 7-day Filipino meal plan.

    Constraints:
    - Budget: ₱${budget}
    - People: ${people}
    - Goal: ${goals}

    Rules:
    - The ingredients should be the just the main component of the food. 
      For example, if the meal is "Tapsilog", the ingredient should be "Tapa, Rice, Egg".

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
            "ingredients": "string"
          }
        ]
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

    res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error Details:', error);
    res.status(500).json({ error: 'Generation Failed', details: error.message });
  }
}