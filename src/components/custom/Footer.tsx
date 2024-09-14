import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">
            <span className="text-yellow-400">Yellow</span> Taxi
          </h2>
          <p className="text-sm">Your reliable ride, anytime, anywhere.</p>
        </div>
        <nav className="mb-4 md:mb-0">
          <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
            <li><Link to="/terms" className="hover:text-yellow-400">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-yellow-400">Privacy</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
          </ul>
        </nav>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Yellow Taxi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
