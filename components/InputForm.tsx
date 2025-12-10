import React from 'react';

// FIX: Define props interface to resolve TypeScript error.
interface InputFormProps {
  asset: string;
  setAsset: (asset: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ asset, setAsset, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
      <input
        type="text"
        value={asset}
        onChange={(e) => setAsset(e.target.value.toUpperCase())}
        placeholder="Ex: BTC/USD, ETH, EUR/USD"
        className="w-full sm:flex-1 bg-gray-900 border-2 border-gray-700 text-gray-200 rounded-md px-4 py-3 text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-md text-lg tracking-wider transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? 'Analisando...' : 'Analisar Ativo'}
      </button>
    </form>
  );
};
