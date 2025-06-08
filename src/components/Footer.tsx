import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Hunter Mussel</h3>
            <p className="text-gray-400 mb-4">
              We develop innovative, high-quality software solutions for businesses that want to transform their ideas into powerful applications.
            </p>
            <p className="text-gray-400">
              Specialized in web development, mobile apps, and cloud solutions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/iagomussel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <address className="text-gray-400 not-italic space-y-2">
              <p>
                <a href="mailto:contato@huntermussel.com" className="hover:text-white transition-colors">
                  contact@huntermussel.com
                </a>
              </p>
              <p>
                <a href="tel:+5521995775689" className="hover:text-white transition-colors">
                  (21) 99577-5689
                </a>
              </p>
              <p className="mt-4">
                <strong>Support:</strong><br />
                <a href="mailto:suporte@huntermussel.com" className="hover:text-white transition-colors">
                  support@huntermussel.com
                </a>
              </p>
              <p className="text-sm">
                Mon-Fri: 9am - 6pm<br />
                Sat: 9am - 1pm
              </p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Hunter Mussel. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://linkedin.com/company/huntermussel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/iagomussel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 