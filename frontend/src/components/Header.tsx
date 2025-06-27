import React from 'react';
import { useAppContext } from '../context/AppContext';
import logo from '../assets/logo.svg';

interface HeaderProps {
  onSidebarToggle: () => void;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, showLogo = true }) => {
  const { goToWelcomeScreen } = useAppContext();

  return (
    <header className="bg-gray-950 flex justify-between items-center p-4">
      <div className="flex items-center">
        <button 
          onClick={onSidebarToggle}
          className="mr-4 text-white block md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        {showLogo && (
          <div className="relative group">
            <button 
              onClick={goToWelcomeScreen} 
              className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-125"
              aria-label="Return to main page"
            >
              <img src={logo} alt="Logo" className="h-12 w-28" />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm font-medium rounded px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-700">
              Return to main page
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
