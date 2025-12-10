import React from 'react';
import type { Analysis, Source } from '../types';
import { Recommendation } from '../types';
import { BuyIcon } from './icons/BuyIcon';
import { SellIcon } from './icons/SellIcon';
import { WaitIcon } from './icons/WaitIcon';

interface AnalysisDisplayProps {
  analysis: Analysis;
  sources: Source[];
}

const StatCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => {
    // FIX: Coerce `value` to string to prevent runtime errors with .startsWith()
    // This handles cases where the API might return a number instead of a string.
    const stringValue = String(value ?? '');
    const isPositive = stringValue.startsWith('+');
    const isNegative = stringValue.startsWith('-');
    
    let valueColor = 'text-white';
    if (isPositive) valueColor = 'text-green-400';
    if (isNegative) valueColor = 'text-red-500';

    return (
        <div className={`bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-gray-700 ${className}`}>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{title}</h3>
            <p className={`text-xl font-bold mt-1 ${valueColor}`}>{stringValue}</p>
        </div>
    );
}

const RecommendationCard: React.FC<{ analysis: Analysis }> = ({ analysis }) => {
    const recommendationStyles = {
        [Recommendation.COMPRAR]: {
            bg: 'bg-green-500/10 border-green-500',
            text: 'text-green-400',
            icon: <BuyIcon />,
        },
        [Recommendation.VENDER]: {
            bg: 'bg-red-500/10 border-red-500',
            text: 'text-red-500',
            icon: <SellIcon />,
        },
        [Recommendation.AGUARDAR]: {
            bg: 'bg-blue-500/10 border-blue-500',
            text: 'text-blue-400',
            icon: <WaitIcon />,
        },
    };
    const styles = recommendationStyles[analysis.recommendation] || recommendationStyles[Recommendation.AGUARDAR];
    
    return (
        <div className={`p-6 rounded-xl border-2 text-center flex flex-col items-center justify-center ${styles.bg}`}>
            <h2 className="text-sm uppercase text-gray-400 tracking-widest font-semibold">Recomendação</h2>
            <div className={`flex items-center gap-4 my-3 ${styles.text}`}>
                {styles.icon}
                <p className="text-4xl md:text-5xl font-black tracking-wider">{analysis.recommendation}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 text-base">
                <div className="text-red-400">
                    <span className="text-gray-500 font-semibold">Stop-Loss: </span>{analysis.stopLoss}
                </div>
                <div className="text-green-400">
                    <span className="text-gray-500 font-semibold">Take-Profit: </span>{analysis.takeProfit}
                </div>
            </div>
        </div>
    );
};

const SourcesDisplay: React.FC<{ sources: Source[] }> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-gray-400 mb-3">Fontes de Dados</h3>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 hover:underline truncate transition-colors"
            >
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, sources }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">{analysis.asset}</h2>
                <p className="text-4xl font-black text-blue-400 mt-1">{analysis.price}</p>
            </div>
            <div className="text-8xl opacity-80">
                {analysis.chartEmoji}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Variação 24h" value={analysis.change24h} />
            <StatCard title="Variação 7d" value={analysis.change7d} />
            <StatCard title="Volume 24h" value={analysis.volume} />
            <StatCard title="Tendência Curto Prazo" value={analysis.trendShortTerm} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                 <RecommendationCard analysis={analysis} />
                <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-gray-400 mb-2">Resumo da Análise</h3>
                    <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                </div>
                <SourcesDisplay sources={sources} />
            </div>

            <div className="space-y-4">
                <StatCard title="Tendência Médio Prazo" value={analysis.trendMediumTerm} />
                <StatCard title="Suporte" value={analysis.support} />
                <StatCard title="Resistência" value={analysis.resistance} />
                <StatCard title="RSI" value={analysis.rsi} />
                <StatCard title="MACD" value={analysis.macd} />
                <StatCard title="Médias Móveis" value={analysis.movingAverages} />
            </div>
        </div>
    </div>
  );
};