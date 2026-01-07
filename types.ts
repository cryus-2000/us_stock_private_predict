
export interface StockNews {
  title: string;
  source: string;
  url: string;
  summary: string;
  timestamp: string;
}

export interface StockInsight {
  symbol: string;
  currentPrice: string;
  purchasePrice: number;
  news: StockNews[];
  analysis: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: string;
}

export interface MidCapRecommendation {
  symbol: string;
  companyName: string;
  marketCap: string;
  industry: string;
  reason: string;
  potentialUpside: string;
}

export interface DailyReport {
  date: string;
  rklbInsight: StockInsight;
  newRecommendation: MidCapRecommendation;
  emailBody: string;
}
