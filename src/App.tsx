import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { trackPageView, initPerformanceTracking } from './utils/analytics';
import A11yProvider from './components/A11yProvider';
import { setupLazyLoading, deferNonCriticalResources, setupResponsiveImages } from './utils/performance';

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  
  return null;
};

function App() {
  // Initialize performance tracking and optimizations
  useEffect(() => {
    // Analytics
    initPerformanceTracking();
    
    // Performance optimizations
    setupLazyLoading();
    deferNonCriticalResources();
    setupResponsiveImages();
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <A11yProvider>
          <Suspense fallback={<Loading />}>
            <Router>
              <AnalyticsTracker />
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main id="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </Suspense>
        </A11yProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
