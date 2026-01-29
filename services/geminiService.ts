
import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeminiRefinedPost } from "../types";

export const refinePostContent = async (text: string): Promise<GeminiRefinedPost | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refine this community service or marketplace post. If it's messy, clean it up. Suggest a professional title and the most appropriate category from this list: ${Object.values(Category).join(', ')}. 
      Include items for sale, requests for elderly assistance, pet care, and homemade food/baked goods/food donations.
      Input text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              description: "Must be exactly one of the provided categories"
            }
          },
          required: ["title", "description", "category"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as GeminiRefinedPost;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return null;
  }
};
