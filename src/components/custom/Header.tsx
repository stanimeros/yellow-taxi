import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">
            <span className="text-yellow-400">Yellow</span> Taxi
          </Link>
        </h1>
      </div>
    </header>
  );
};
