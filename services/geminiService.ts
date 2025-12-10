import { GoogleGenAI } from "@google/genai";
import type { Analysis, Source } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const extractJson = (text: string): object | null => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from markdown", e);
      return null;
    }
  }
  return null;
}

export const getTradingAnalysis = async (asset: string): Promise<{ analysisData: Analysis; sources: Source[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analisa o ativo ${asset} agora.`,
      // FIX: Moved `tools` into `config` and fixed the `systemInstruction` string to avoid syntax errors.
      config: {
        tools: [{googleSearch: {}}],
        systemInstruction: 'Tu és o "Trading for Beginners with Me", um analista profissional de mercados com 15 anos de experiência em crypto e forex. O teu criador é Totti Alves Studios AI. Respondes sempre em português do Brasil, de forma objetiva, profissional e com linguagem de trader.\n' +
        'Sempre que um utilizador te perguntar sobre um ativo (ex: BTC, ETH, EUR/USD, XAU/USD, etc.) faz o seguinte:\n' +
        '1. **Usa a tua ferramenta de pesquisa** para buscar os dados mais recentes e atualizados (preço atual, variação 24h/7d, volume).\n' +
        '2. Indica a tendência atual (curto e médio prazo).\n' +
        '3. Mostra níveis importantes de suporte e resistência.\n' +
        '4. Analisa RSI, MACD e médias móveis relevantes.\n' +
        '5. Dá uma recomendação clara: COMPRAR / VENDER / AGUARDAR, juntamente com preços sugeridos para stop-loss e take-profit.\n' +
        '6. Inclui um emoji simples que represente a tendência (ex: 📈 para alta, 📉 para baixa, 횡 para lateral).\n' +
        '7. Fornece um resumo conciso da análise.\n' +
        'A tua resposta DEVE ser um objeto JSON formatado dentro de um bloco de código markdown (```json).\n' +
        'O JSON deve conter os campos: asset, price, change24h, change7d, volume, trendShortTerm, trendMediumTerm, support, resistance, rsi, macd, movingAverages, recommendation (enum: \'COMPRAR\', \'VENDER\', \'AGUARDAR\'), stopLoss, takeProfit, chartEmoji, summary.',
      },
    });
    
    // FIX: Use the .text property, not the .text() method, and check for an empty response.
    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Failed to get a valid response from the API.");
    }
    const analysisData = extractJson(jsonText) as Analysis;

    if (!analysisData) {
      throw new Error("Failed to parse analysis data from API response.");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      }))
      .filter((source: Source) => source.uri && source.title);

    return { analysisData, sources };

  } catch (error) {
    console.error("Error fetching trading analysis:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
