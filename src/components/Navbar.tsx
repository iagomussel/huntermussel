import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen, Code2 } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo className="h-10" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#4B82F1]">Home</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#4B82F1] flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Blog</span>
            </Link>
            <div className="relative group">
              <Link 
                to="/projects" 
                className="flex items-center text-[#4B82F1] hover:text-[#3A6ACF]"
              >
                <Code2 className="h-5 w-5 mr-1" />
                <span>Projects</span>
              </Link>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link 
                    to="/projects" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Software Solutions
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/contact" className="bg-[#4B82F1] text-white px-4 py-2 rounded-md hover:bg-[#3A6ACF]">
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
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-[#4B82F1]">Home</Link>
            <Link to="/blog" className="flex items-center px-3 py-2 text-gray-700 hover:text-[#4B82F1]">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Blog</span>
            </Link>
            <Link 
              to="/projects" 
              className="flex items-center px-3 py-2 text-[#4B82F1] hover:text-[#3A6ACF]"
            >
              <Code2 className="h-5 w-5 mr-1" />
              <span>Projects</span>
            </Link>
            <Link to="/contact" className="block px-3 py-2 bg-[#4B82F1] text-white rounded-md">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
