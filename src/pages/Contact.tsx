
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { sendContactForm, ContactFormData } from '../utils/notifications';
import { useToast } from '../utils/useToast';
import Toast from '../components/Toast';
import { Mail, Phone, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    product: 'odontomaster'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const contactData: ContactFormData = {
        ...formData,
        source: 'contact'
      };
      
      const result = await sendContactForm(contactData);
      
      if (result.success) {
        showToast(result.message, 'success');
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          product: 'odontomaster'
        });
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Unexpected error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Hunter Mussel | Get Professional Software Development Support</title>
        <meta name="description" content="Contact Hunter Mussel for professional software development services. Get expert consultation for web applications, mobile apps, and custom software solutions." />
        <meta name="keywords" content="contact hunter mussel, software development consultation, custom software contact, web development services, mobile app development" />
        <link rel="canonical" href="https://huntermussel.com/contact" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://huntermussel.com/contact" />
        <meta property="og:title" content="Contact Hunter Mussel - Professional Software Development" />
        <meta property="og:description" content="Get in touch with our expert software development team. We're ready to help transform your ideas into powerful digital solutions." />
        <meta property="og:image" content="https://huntermussel.com/assets/images/contact.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://huntermussel.com/contact" />
        <meta property="twitter:title" content="Contact Hunter Mussel - Professional Software Development" />
        <meta property="twitter:description" content="Get in touch with our expert software development team. We're ready to help transform your ideas into powerful digital solutions." />
        <meta property="twitter:image" content="https://huntermussel.com/assets/images/contact.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "Hunter Mussel",
              "url": "https://huntermussel.com",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-21-99577-5689",
                "email": "contato@huntermussel.com",
                "contactType": "Customer Service",
                "availableLanguage": ["English", "Portuguese"]
              }
            }
          })}
        </script>
      </Helmet>

      <Toast toast={toast} onClose={hideToast} />

      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Let's Build Something Amazing Together
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8">
                Ready to transform your ideas into powerful digital solutions? 
                We're here to help your business grow.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Free Consultation
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  24/7 Support Available
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Quick Response
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="lg:flex">
                  {/* Contact Form */}
                  <div className="lg:w-2/3 p-6 sm:p-8 lg:p-12">
                    <div className="max-w-lg mx-auto lg:mx-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Get Started Today
                      </h2>
                      <p className="text-gray-600 mb-6 sm:mb-8">
                        Tell us about your project and we'll get back to you within 24 hours.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                              Company
                            </label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="Your Company"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                            Service of Interest
                          </label>
                          <select
                            id="product"
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="odontomaster">OdontoMaster (Dental Management)</option>
                            <option value="veterinary">Veterinary Management System</option>
                            <option value="educational">Educational Management Platform</option>
                            <option value="web-app">Web Application Development</option>
                            <option value="mobile-app">Mobile App Development</option>
                            <option value="custom">Custom Software Development</option>
                            <option value="consultation">Consultation Services</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Project Details *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                          ></textarea>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="lg:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 lg:p-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Get In Touch
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start group">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">Email</p>
                              <a 
                                href="mailto:contato@huntermussel.com" 
                                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                              >
                                contato@huntermussel.com
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-start group">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                              <Phone className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">Phone</p>
                              <a 
                                href="tel:+5521995775689" 
                                className="text-green-600 hover:text-green-700 transition-colors font-medium"
                              >
                                +55 (21) 99577-5689
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-start group">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <MessageSquare className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">Support</p>
                              <a 
                                href="mailto:suporte@huntermussel.com" 
                                className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                              >
                                suporte@huntermussel.com
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" />
                          Business Hours
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span className="font-medium">9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span className="font-medium">9:00 AM - 1:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span className="font-medium text-red-600">Closed</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          * Emergency support available 24/7 for premium clients
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Why Choose Hunter Mussel?
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            Expert software development team
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            Custom solutions for your business
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            Ongoing support and maintenance
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            Competitive pricing and timelines
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
