import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { Analysis, Source } from './types';
import { getTradingAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [asset, setAsset] = useState<string>('BTC/USD');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (assetSymbol: string) => {
    if (!assetSymbol) {
      setError("Por favor, insira um símbolo de ativo.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setSources([]);
    try {
      const { analysisData, sources } = await getTradingAnalysis(assetSymbol);
      setAnalysis(analysisData);
      setSources(sources);
    } catch (e) {
      console.error(e);
      setError("Não foi possível obter a análise. Verifique o símbolo do ativo e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis('BTC/USD');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(asset);
  };

  return (
    <>
      <style>{`
        body {
          background-color: #0D1117;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 20px 20px;
          font-family: 'Inter', sans-serif;
        }
        h1, h2, h3, button {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      <div className="min-h-screen text-gray-300">
        <div className="container mx-auto p-4 md:p-8">
          <Header />
          <main>
            <InputForm
              asset={asset}
              setAsset={setAsset}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <div className="mt-8">
              {isLoading && <LoadingSpinner />}
              {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
              {analysis && !isLoading && <AnalysisDisplay analysis={analysis} sources={sources} />}
            </div>
          </main>
          <footer className="text-center mt-12 text-xs text-gray-500">
            <p>Criado por Totti Alves Studios AI</p>
            <p className="mt-2">Aviso: Informações apenas para fins educativos, não constitui conselho financeiro.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;