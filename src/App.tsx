import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { A11yProvider } from './components/A11yProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Projects = lazy(() => import('./pages/Projects'));
const Plans = lazy(() => import('./pages/Plans'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FreeTools = lazy(() => import('./pages/FreeTools'));
const Newsletter = lazy(() => import('./pages/Newsletter'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Login = lazy(() => import('./pages/Login'));
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
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/produtos" element={<Products />} />
                    <Route path="/projetos" element={<Projects />} />
                    <Route path="/planos" element={<Plans />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/contato" element={<Navigate to="/contact" replace />} />
                    <Route path="/free-tools" element={<FreeTools />} />
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
                </Suspense>
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