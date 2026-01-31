import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThumbnailSlotData, AnalysisResult } from "../types";

const parseJSON = (text: string) => {
    try {
        // Remove markdown code blocks if present
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return null;
    }
}

export const analyzeThumbnails = async (
  title: string,
  niche: string,
  thumbnails: ThumbnailSlotData[]
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Filter out empty slots
  const activeThumbnails = thumbnails.filter((t) => t.base64 !== null);

  if (activeThumbnails.length === 0) {
    throw new Error("No thumbnails provided");
  }

  const parts = [];

  // Add context
  parts.push({
    text: `You are an expert YouTube Strategist and Graphic Designer. 
    I will provide you with ${activeThumbnails.length} thumbnail variations for a video.
    
    Context:
    - Video Title: "${title}"
    - Channel Niche/Topic: "${niche || "General Content"}"
    
    Your task:
    1. Analyze each thumbnail (labeled A, B, C, etc.) based on Click-Through Rate (CTR) potential, legibility, emotional impact, and relevance to the title.
    2. Assign a score from 0-100 for each.
    3. List pros and cons for each.
    4. Select one clear overall winner.
    
    Return the result in strictly valid JSON format matching the schema provided.
    `
  });

  // Add images
  activeThumbnails.forEach((thumb) => {
    // Extract base64 data (remove "data:image/png;base64," prefix if present)
    const base64Data = thumb.base64?.split(',')[1];
    if (base64Data) {
      parts.push({
        text: `Thumbnail ${thumb.id}:`
      });
      parts.push({
        inlineData: {
          mimeType: thumb.file?.type || 'image/png',
          data: base64Data
        }
      });
    }
  });

  // Define Schema
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      overallWinner: { type: Type.STRING, description: "The Slot ID (e.g., 'A') of the best thumbnail." },
      summary: { type: Type.STRING, description: "A brief summary of why the winner won." },
      thumbnails: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            slotId: { type: Type.STRING },
            score: { type: Type.NUMBER },
            critique: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["slotId", "score", "critique", "pros", "cons"]
        }
      }
    },
    required: ["overallWinner", "summary", "thumbnails"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Upgraded for superior reasoning and multimodal critique
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a world-class YouTube growth consultant. Your analysis is data-driven, brutally honest, and focused on maximizing human psychology and CTR.",
        temperature: 0.4,
      }
    });

    const result = parseJSON(response.text);
    if (!result) throw new Error("Invalid JSON response from AI");
    
    return result as AnalysisResult;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};