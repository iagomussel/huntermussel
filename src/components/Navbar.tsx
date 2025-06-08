
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto sm:h-10"
                src="/assets/images/logo.svg"
                alt="Hunter Mussel - Professional Software Development"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/produtos"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              Products
            </Link>
            <Link
              to="/projetos"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              Projects
            </Link>
            <Link
              to="/sobre"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/produtos"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/projetos"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/sobre"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block mx-3 my-2 px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
