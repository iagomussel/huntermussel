import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import PlansPage from './pages/Plans';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plans" element={<PlansPage />} />
              </Routes>
            </div>
          </Router>
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;