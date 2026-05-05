import { GoogleGenAI, Type } from "@google/genai";
import { FORAGE_SPECIES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a specialist in tropical forage crops identification, specifically for the Philippine context.
Analyze the image provided and identify the forage species.
The study identified 14 species (7 grasses, 7 legumes). 
GRASSES: Napier, Guinea, Signal, Mulato II, Para, Star, Rhodes.
LEGUMES: Madre de Agua, Ipil-ipil, Centro, Stylo, Calopo, Desmanthus, Arachis pintoi (Pinto Peanut).

Return your identification in JSON format.
If you are unsure, pick the closest match from the list above.
`;

export async function identifyForage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          { text: "Identify this forage crop from the known 14 species." },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            speciesId: {
              type: Type.STRING,
              description: "The ID of the identified species (slug format, e.g., 'madre-de-agua')",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence level between 0 and 1",
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief reasoning for the identification",
            }
          },
          required: ["speciesId", "confidence"]
        }
      },
    });

    const data = JSON.parse(response.text);
    const species = FORAGE_SPECIES.find(s => s.id === data.speciesId) || FORAGE_SPECIES[0];
    
    return {
      species,
      confidence: data.confidence,
      reasoning: data.reasoning,
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Identification failed:", error);
    throw error;
  }
}
