
import React from 'react';
import type { Analysis } from '../types';
import { Recommendation } from '../types';
import { BuyIcon } from './icons/BuyIcon';
import { SellIcon } from './icons/SellIcon';
import { WaitIcon } from './icons/WaitIcon';

interface AnalysisDisplayProps {
  analysis: Analysis;
}

const StatCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => {
    const isPositive = value?.startsWith('+');
    const isNegative = value?.startsWith('-');
    
    let valueColor = 'text-gray-100';
    if (isPositive) valueColor = 'text-green-400';
    if (isNegative) valueColor = 'text-red-500';

    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 ${className}`}>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider">{title}</h3>
            <p className={`text-xl font-bold mt-1 ${valueColor}`}>{value}</p>
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
            bg: 'bg-yellow-500/10 border-yellow-500',
            text: 'text-yellow-400',
            icon: <WaitIcon />,
        },
    };
    const styles = recommendationStyles[analysis.recommendation] || recommendationStyles[Recommendation.AGUARDAR];
    
    return (
        <div className={`p-6 rounded-xl border-2 text-center flex flex-col items-center justify-center ${styles.bg}`}>
            <h2 className="text-sm uppercase text-gray-400 tracking-widest">Recomendação</h2>
            <div className={`flex items-center gap-4 my-3 ${styles.text}`}>
                {styles.icon}
                <p className="text-4xl md:text-5xl font-black tracking-wider">{analysis.recommendation}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 text-sm">
                <div className="text-red-400">
                    <span className="text-gray-500">Stop-Loss: </span>{analysis.stopLoss}
                </div>
                <div className="text-green-400">
                    <span className="text-gray-500">Take-Profit: </span>{analysis.takeProfit}
                </div>
            </div>
        </div>
    );
};


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">{analysis.asset}</h2>
                <p className="text-4xl font-black text-cyan-400 mt-1">{analysis.price}</p>
            </div>
            <div className="text-8xl">
                {analysis.chartEmoji}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Variação 24h" value={analysis.change24h} />
            <StatCard title="Variação 7d" value={analysis.change7d} />
            <StatCard title="Volume 24h" value={analysis.volume} />
            <StatCard title="Tendência Curto Prazo" value={analysis.trendShortTerm} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                 <RecommendationCard analysis={analysis} />
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Resumo da Análise</h3>
                    <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                </div>
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
