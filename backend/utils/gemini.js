import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY,
});

const getGeminiResponse = async (messages) => {
    try {
        // Map our internal database format to Gemini's expected format
        const formattedHistory = messages.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // model: "gemma-3-27b",
            contents: formattedHistory,
            config: {
                systemInstruction: "You are IntelliBot, an AI assistant for the IntelliCar platform. Your responses MUST be extremely concise, straight to the point, and highly summarized. Provide answers in plain text ONLY. ABSOLUTELY DO NOT use bolding, asterisks, hashtags, or markdown formatting, as the frontend cannot render them. Keep your response under 3-4 short sentences or points. FIRM RULE: I am an AI exclusively designed for IntelliCar. If the user asks ANY question or topic completely unrelated to cars, vehicles, driving, transportation, or the IntelliCar platform itself, you MUST politely decline to answer, stating that you can only help with car-related inquiries."
            }
        });

        return response.candidates[0].content.parts[0].text;
    } catch (err) {
        throw new Error(err.message);
    }
}

export default getGeminiResponse;
