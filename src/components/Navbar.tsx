import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-10 w-10" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hunter Mussel
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-indigo-600">Services</Link>
            <Link to="/portfolio" className="text-gray-700 hover:text-indigo-600">Portfolio</Link>
            <Link to="/plans" className="text-gray-700 hover:text-indigo-600">Pricing</Link>
            <LanguageSwitcher />
            <Link to="/contact" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Contact
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/services" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Services</Link>
            <Link to="/portfolio" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Portfolio</Link>
            <Link to="/plans" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Pricing</Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            <Link to="/contact" className="block px-3 py-2 bg-indigo-600 text-white rounded-md">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
