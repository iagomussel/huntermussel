import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { A11yProvider } from './components/A11yProvider';
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
import Newsletter from './pages/Newsletter';
import BlogRedirect from './components/BlogRedirect';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <HelmetProvider>
      <A11yProvider>
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="pt-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/projetos" element={<Projects />} />
                  <Route path="/planos" element={<Plans />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route 
                    path="/admin/referrals" 
                    element={
                      <PrivateRoute>
                        <Referrals />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/blog" element={<BlogRedirect />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ErrorBoundary>
      </A11yProvider>
    </HelmetProvider>
  );
}

export default App;