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
