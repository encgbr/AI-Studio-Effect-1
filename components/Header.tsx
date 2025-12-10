import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
        Trading for Beginners with Me
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mt-2 font-light">
        Seu Assistente de Trading 24h
      </p>
    </header>
  );
};