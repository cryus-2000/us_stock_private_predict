
import React from 'react';
import { StockInsight, MidCapRecommendation } from '../types';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Rocket, Target, Briefcase } from 'lucide-react';

interface Props {
  insight?: StockInsight;
  recommendation?: MidCapRecommendation;
  type: 'RKLB' | 'NEW';
}

const StockCard: React.FC<Props> = ({ insight, recommendation, type }) => {
  if (type === 'RKLB' && insight) {
    const isUp = insight.recommendation === 'BUY';
    const isDown = insight.recommendation === 'SELL';

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Rocket className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{insight.symbol} Analysis</h3>
              <p className="text-slate-400 text-sm">Entry: ${insight.purchasePrice}</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-2 ${
            isUp ? 'bg-emerald-500/20 text-emerald-400' : 
            isDown ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {isUp ? <TrendingUp size={16} /> : isDown ? <TrendingDown size={16} /> : <Minus size={16} />}
            {insight.recommendation}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Current Price</span>
            <span className="text-lg font-semibold text-white">{insight.currentPrice}</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Target Price</span>
            <span className="text-lg font-semibold text-blue-400">{insight.targetPrice}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Recent News</h4>
          <div className="space-y-3">
            {insight.news.map((n, i) => (
              <a 
                key={i} 
                href={n.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group bg-slate-900/30 p-3 rounded-lg hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {n.title}
                  </span>
                  <ExternalLink size={14} className="text-slate-500 flex-shrink-0 ml-2" />
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                  <span>{n.source}</span>
                  <span>{n.timestamp}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "{insight.analysis}"
          </p>
        </div>
      </div>
    );
  }

  if (type === 'NEW' && recommendation) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Briefcase size={80} />
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <Target className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Mid-Cap Pick</h3>
            <p className="text-indigo-400 text-xs font-mono tracking-tighter">ALGORITHMIC OPPORTUNITY</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-4xl font-black text-white tracking-tight">{recommendation.symbol}</h2>
            <span className="text-slate-400 text-sm">{recommendation.companyName}</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">{recommendation.industry}</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">MCap: {recommendation.marketCap}</span>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-emerald-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
            <TrendingUp size={14} /> Upside Potential: {recommendation.potentialUpside}
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {recommendation.reason}
          </p>
        </div>

        <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
          VIEW CHARTS & FUNDAMENTALS
        </button>
      </div>
    );
  }

  return null;
};

export default StockCard;
