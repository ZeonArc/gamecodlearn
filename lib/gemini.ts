import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Standard text model
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// JSON-output model for structured AI responses
export const jsonModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { responseMimeType: "application/json" },
});

export { genAI };

export function parseAIJSON(text: string) {
  try {
    // Strip markdown formatting common with Gemini output
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("AI JSON Parse Error. Raw Text:", text);
    throw new Error("Failed to parse AI JSON output");
  }
}
