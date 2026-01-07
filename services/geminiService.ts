
import { GoogleGenAI } from "@google/genai";
import { DailyReport, StockInsight, MidCapRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateDailyReport(purchasePrice: number): Promise<DailyReport> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Task: Act as a senior equity analyst.
    1. Search for the latest news on Rocket Lab (RKLB) from the last 24 hours.
    2. Analyze the news relative to the user's purchase price of ${purchasePrice}.
    3. Determine a BUY, SELL, or HOLD recommendation for RKLB based on current technicals and news sentiment.
    4. Find ONE mid-cap stock (Market Cap between $2B and $30B) that is currently a "BUY" opportunity. Avoid mega-caps (like AAPL, NVDA) and penny stocks/small caps.
    5. Format the entire response as a professional investment email in Simplified Chinese.
    
    Output must be a JSON object with this exact structure:
    {
      "rklbInsight": {
        "symbol": "RKLB",
        "currentPrice": "string (latest market price)",
        "purchasePrice": ${purchasePrice},
        "news": [
          { "title": "string", "source": "string", "url": "string", "summary": "string", "timestamp": "string" }
        ],
        "analysis": "detailed analysis in Chinese",
        "recommendation": "BUY" | "SELL" | "HOLD",
        "targetPrice": "string"
      },
      "newRecommendation": {
        "symbol": "string",
        "companyName": "string",
        "marketCap": "string",
        "industry": "string",
        "reason": "why buy this stock (Chinese)",
        "potentialUpside": "string"
      },
      "emailBody": "Full email text in Markdown format, professionally written as a daily briefing."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Extract grounding URLs if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => chunk.web.uri);

    // Enrich news with real grounding links if the AI didn't provide enough
    if (data.rklbInsight && data.rklbInsight.news && urls.length > 0) {
      data.rklbInsight.news = data.rklbInsight.news.map((n: any, i: number) => ({
        ...n,
        url: urls[i] || n.url
      }));
    }

    return {
      date: new Date().toLocaleDateString('zh-CN'),
      ...data
    } as DailyReport;
  } catch (error) {
    console.error("Failed to generate report:", error);
    throw error;
  }
}
