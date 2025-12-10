
export enum Recommendation {
  COMPRAR = 'COMPRAR',
  VENDER = 'VENDER',
  AGUARDAR = 'AGUARDAR',
}

export interface Analysis {
  asset: string;
  price: string;
  change24h: string;
  change7d: string;
  volume: string;
  trendShortTerm: string;
  trendMediumTerm: string;
  support: string;
  resistance: string;
  rsi: string;
  macd: string;
  movingAverages: string;
  recommendation: Recommendation;
  stopLoss: string;
  takeProfit: string;
  chartEmoji: string;
  summary: string;
}
