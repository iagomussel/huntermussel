import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Projects from './pages/Projects';
import Plans from './pages/Plans';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Referrals from './pages/Referrals';
import NewsletterPage from './pages/Newsletter';
import BlogRedirect from './components/BlogRedirect';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/blog" element={<BlogRedirect />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;