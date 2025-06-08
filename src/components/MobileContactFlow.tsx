
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Phone, Mail, MessageSquare, Calculator, Send } from 'lucide-react';
import { useToast } from '../utils/useToast';
import Toast from './Toast';

interface ContactFlowData {
  step: number;
  contactType: 'quote' | 'support' | 'general' | '';
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const MobileContactFlow = () => {
  const [data, setData] = useState<ContactFlowData>({
    step: 1,
    contactType: '',
    projectType: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'E-commerce Platform',
    'Management System',
    'API Development',
    'Custom Software',
    'Other'
  ];

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $30,000',
    '$30,000 - $50,000',
    '$50,000+',
    'Not sure yet'
  ];

  const timelineOptions = [
    'ASAP',
    '1-2 months',
    '3-6 months',
    '6+ months',
    'Flexible'
  ];

  const nextStep = () => {
    setData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setData(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleInputChange = (field: keyof ContactFlowData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(process.env.VITE_N8N_WEBHOOK_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mobile-contact',
          timestamp: new Date().toISOString(),
          source: 'huntermussel-website',
          data: {
            contactType: data.contactType,
            projectType: data.projectType,
            budget: data.budget,
            timeline: data.timeline,
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            message: data.message
          }
        })
      });

      if (response.ok) {
        showToast('Contact request submitted successfully!', 'success');
        setData({
          step: 1,
          contactType: '',
          projectType: '',
          budget: '',
          timeline: '',
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      showToast('Error submitting request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    const totalSteps = data.contactType === 'quote' ? 5 : 3;
    return (data.step / totalSteps) * 100;
  };

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px]">
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${getStepProgress()}%` }}
          />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
          <h2 className="text-xl font-bold">Get In Touch</h2>
          <p className="text-blue-100 text-sm mt-1">
            Step {data.step} of {data.contactType === 'quote' ? '5' : '3'}
          </p>
        </div>

        {/* Steps */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Contact Type */}
            {data.step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">How can we help you?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleInputChange('contactType', 'quote');
                      nextStep();
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center"
                  >
                    <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Get a Quote</div>
                      <div className="text-sm text-gray-500">For a new project</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleInputChange('contactType', 'support');
                      setData(prev => ({ ...prev, step: 4 })); // Skip project details
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center"
                  >
                    <Phone className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">Support Request</div>
                      <div className="text-sm text-gray-500">For existing clients</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleInputChange('contactType', 'general');
                      setData(prev => ({ ...prev, step: 4 })); // Skip project details
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center"
                  >
                    <MessageSquare className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium">General Inquiry</div>
                      <div className="text-sm text-gray-500">Questions or partnerships</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Project Type (Quote only) */}
            {data.step === 2 && data.contactType === 'quote' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">What type of project?</h3>
                <div className="space-y-2">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        handleInputChange('projectType', type);
                        nextStep();
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  onClick={prevStep}
                  className="flex items-center text-gray-600 hover:text-gray-800 mt-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              </motion.div>
            )}

            {/* Step 3: Budget & Timeline (Quote only) */}
            {data.step === 3 && data.contactType === 'quote' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4">Budget Range</h3>
                  <div className="space-y-2">
                    {budgetRanges.map((budget) => (
                      <button
                        key={budget}
                        onClick={() => handleInputChange('budget', budget)}
                        className={`w-full p-3 border rounded-lg transition-colors text-left ${
                          data.budget === budget
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                  <div className="space-y-2">
                    {timelineOptions.map((timeline) => (
                      <button
                        key={timeline}
                        onClick={() => handleInputChange('timeline', timeline)}
                        className={`w-full p-3 border rounded-lg transition-colors text-left ${
                          data.timeline === timeline
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {timeline}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!data.budget || !data.timeline}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4/5: Contact Information */}
            {(data.step === 4 || (data.step === 5 && data.contactType === 'quote')) && (
              <motion.div
                key="contact-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  
                  <input
                    type="email"
                    placeholder="Email *"
                    value={data.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={data.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <input
                    type="text"
                    placeholder="Company"
                    value={data.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <textarea
                    placeholder="Additional message..."
                    value={data.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={prevStep}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!data.name || !data.email || isSubmitting}
                    className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default MobileContactFlow;
