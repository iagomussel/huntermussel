import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Contact = () => {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5521995775689`, '_blank');
  };

  return (
    <div className="pt-16">
      <SEOHead
        title="Contact - Hunter Mussel"
        description="Get in touch with us to discuss your next software development project."
        path="/contact"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are ready to help transform your ideas into reality. Contact us through any of the channels below!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-8 text-center">Get In Touch</h2>
            
            <div className="space-y-8">
              <a 
                href="tel:+5521995775689"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-6 w-6 text-[#4B82F1] mr-4 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Phone</div>
                  <span className="text-gray-600">+55 (21) 99577-5689</span>
                </div>
              </a>
              
              <a 
                href="mailto:iagomussel.so@gmail.com"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-6 w-6 text-[#4B82F1] mr-4 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Email</div>
                  <span className="text-gray-600">iagomussel.so@gmail.com</span>
                </div>
              </a>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-6 w-6 text-[#4B82F1] mr-4 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Location</div>
                  <span className="text-gray-600">Rio de Janeiro, RJ - Brazil</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center font-medium"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
