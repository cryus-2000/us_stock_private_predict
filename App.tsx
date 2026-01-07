
import React, { useState, useEffect } from 'react';
import { Mail, Calendar, RefreshCw, ChevronRight, Settings, LayoutDashboard, Send, Clock, AlertCircle } from 'lucide-react';
import { generateDailyReport } from './services/geminiService';
import { DailyReport } from './types';
import StockCard from './components/StockCard';

const App: React.FC = () => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const purchasePrice = 38.63;

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyReport(purchasePrice);
      setReport(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch the latest stock data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-500 mb-8">
            <div className="bg-blue-600 rounded-lg p-2">
              <RefreshCw className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">InsightAI</span>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600/10 text-blue-400">
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors">
              <Calendar size={18} /> History
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors">
              <Mail size={18} /> Subscriptions
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors">
              <Settings size={18} /> Settings
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-widest">Tracking Ticker</p>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">RKLB</span>
              <span className="text-blue-400 text-sm font-mono">${purchasePrice}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Investment Daily <ChevronRight size={18} className="text-slate-600" /> 
              <span className="text-blue-500">{report?.date || new Date().toLocaleDateString('zh-CN')}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Clock size={12} />
              Last updated: {lastUpdated || 'Never'}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchReport}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
              <Send size={18} />
              Send Email Report
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-3 text-rose-400 items-start">
              <AlertCircle className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error loading report</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/10 rounded-full"></div>
                <div className="w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-white">Aggregating Market Data...</p>
                <p className="text-slate-500 text-sm max-w-xs">Scanning RKLB news and finding mid-cap gems via Gemini Search Grounding.</p>
              </div>
            </div>
          ) : report ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Left Column: Stocks */}
              <div className="space-y-8">
                <section>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Core Portfolio Tracking</h2>
                  <StockCard type="RKLB" insight={report.rklbInsight} />
                </section>

                <section>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Discovery: Mid-Cap Pick</h2>
                  <StockCard type="NEW" recommendation={report.newRecommendation} />
                </section>
              </div>

              {/* Right Column: Email Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-blue-400" />
                    <span className="font-semibold text-sm">Draft Email Preview</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">READY TO SEND</span>
                </div>
                <div className="p-6 flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none prose-slate">
                  <div className="mb-6 pb-6 border-b border-slate-800 text-slate-400">
                    <div className="flex gap-4 mb-1">
                      <span className="w-12">To:</span>
                      <span className="text-slate-200">Portfolio Owner &lt;investor@example.com&gt;</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-12">Subject:</span>
                      <span className="text-slate-200">每日投资快讯: RKLB 分析与 ${report.newRecommendation.symbol} 推荐</span>
                    </div>
                  </div>
                  
                  {/* Render Markdown content */}
                  <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300">
                    {report.emailBody}
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
                   <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Discard</button>
                   <button className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">Send Now</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500 text-center">
              <LayoutDashboard size={48} className="mb-4 opacity-20" />
              <p>No report data available. Start by clicking "Refresh Data".</p>
            </div>
          )}

          {/* Footer Info */}
          <footer className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-xs">
              Investment advice provided is based on algorithmic news sentiment and technical analysis. 
              Always perform your own due diligence before trading.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
