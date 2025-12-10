
import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    asset: { type: Type.STRING, description: "O símbolo do ativo analisado, ex: BTC/USD" },
    price: { type: Type.STRING, description: "O preço atual do ativo." },
    change24h: { type: Type.STRING, description: "A variação percentual nas últimas 24 horas, com sinal de + ou -." },
    change7d: { type: Type.STRING, description: "A variação percentual nos últimos 7 dias, com sinal de + ou -." },
    volume: { type: Type.STRING, description: "O volume de negociação nas últimas 24 horas." },
    trendShortTerm: { type: Type.STRING, description: "A tendência de curto prazo (ex: Alta, Baixa, Lateral)." },
    trendMediumTerm: { type: Type.STRING, description: "A tendência de médio prazo (ex: Alta, Baixa, Lateral)." },
    support: { type: Type.STRING, description: "O principal nível de suporte." },
    resistance: { type: Type.STRING, description: "O principal nível de resistência." },
    rsi: { type: Type.STRING, description: "O valor do RSI (Índice de Força Relativa) e sua interpretação (ex: 55 - Neutro)." },
    macd: { type: Type.STRING, description: "O estado do MACD (Convergência/Divergência de Médias Móveis) (ex: Cruzamento de alta)." },
    movingAverages: { type: Type.STRING, description: "Análise baseada em médias móveis relevantes (ex: Preço acima da MA50)." },
    recommendation: { type: Type.STRING, enum: ['COMPRAR', 'VENDER', 'AGUARDAR'], description: "A recomendação de ação." },
    stopLoss: { type: Type.STRING, description: "O preço sugerido para stop-loss." },
    takeProfit: { type: Type.STRING, description: "O preço sugerido para take-profit." },
    chartEmoji: { type: Type.STRING, description: "Um único emoji representando a tendência, ex: 📈 para alta, 📉 para baixa, 횡 para lateral." },
    summary: { type: Type.STRING, description: "Um breve resumo profissional da análise." }
  },
  required: ["asset", "price", "change24h", "change7d", "volume", "trendShortTerm", "trendMediumTerm", "support", "resistance", "rsi", "macd", "movingAverages", "recommendation", "stopLoss", "takeProfit", "chartEmoji", "summary"]
};

export const getTradingAnalysis = async (asset: string): Promise<Analysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analisa o ativo ${asset} agora.`,
      config: {
        systemInstruction: `Tu és o "Trading for Beginners with Me", um analista profissional de mercados com 15 anos de experiência em crypto e forex. O teu criador é Totti Alves Studios AI. Respondes sempre em português do Brasil, de forma objetiva, profissional e com linguagem de trader.
        Sempre que um utilizador te perguntar sobre um ativo (ex: BTC, ETH, EUR/USD, XAU/USD, etc.) faz o seguinte:
        1. Busca os dados mais recentes (preço atual, variação 24h/7d, volume).
        2. Indica a tendência atual (curto e médio prazo).
        3. Mostra níveis importantes de suporte e resistência.
        4. Analisa RSI, MACD e médias móveis relevantes.
        5. Dá uma recomendação clara: COMPRAR / VENDER / AGUARDAR, juntamente com preços sugeridos para stop-loss e take-profit.
        6. Inclui um emoji simples que represente a tendência (ex: 📈 para alta, 📉 para baixa, 횡 para lateral).
        7. Fornece um resumo conciso da análise.
        A tua resposta DEVE seguir o schema JSON fornecido.`,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const analysisData = JSON.parse(jsonText);

    return analysisData as Analysis;

  } catch (error) {
    console.error("Error fetching trading analysis:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
