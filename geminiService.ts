
import { GoogleGenAI, Type } from "@google/genai";
import { Industry } from "./types";

export const generateIndustryDraft = async (pkd: string, name: string): Promise<Partial<Industry>> => {
  // Inicjalizacja instancji bezpośrednio przed wywołaniem, aby zapewnić aktualny klucz API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Przygotuj profesjonalną analizę branży o kodzie PKD ${pkd} (${name}) dla doradcy bankowego w Polsce. 
                 Skup się na ryzykach kredytowych, modelach biznesowych i specyfice polskiego rynku.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            businessModel: { type: Type.STRING },
            costDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
            revenueDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyKPIs: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  label: { type: Type.STRING }, 
                  value: { type: Type.STRING } 
                } 
              } 
            },
            funFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
            checklistQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["description", "businessModel", "costDrivers", "revenueDrivers", "keyKPIs", "funFacts", "checklistQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Pusta odpowiedź od modelu AI.");
    }

    const data = JSON.parse(text);
    return {
      description: data.description,
      businessModel: data.businessModel,
      costDrivers: data.costDrivers,
      revenueDrivers: data.revenueDrivers,
      keyKPIs: data.keyKPIs,
      funFacts: data.funFacts,
      checklist: data.checklistQuestions.map((q: string, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        question: q,
        isDone: false
      }))
    };
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    // Przekazanie bardziej szczegółowego błędu do UI
    if (error.message?.includes("API key not valid")) {
      throw new Error("Nieprawidłowy klucz API. Sprawdź konfigurację.");
    }
    throw new Error(error.message || "Wystąpił wewnętrzny błąd podczas komunikacji z AI.");
  }
};
