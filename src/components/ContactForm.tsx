import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultMessages = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  message: 'Message',
  submit: 'Send Message',
  sending: 'Sending...',
  sent: 'Message Sent!',
  error: 'An error occurred. Please try again.',
};

const ContactForm = () => {
  const { t } = useTranslation('translation', {
    useSuspense: false,
    fallback: defaultMessages
  });

  const getTranslation = (key: keyof typeof defaultMessages) => {
    try {
      return t(`contactForm.${key}`) || defaultMessages[key];
    } catch {
      return defaultMessages[key];
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const formatWhatsAppMessage = (data: typeof formData) => {
    const message = Object.entries(data)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('%0A');
    return encodeURIComponent(message);
  };

  const openWhatsApp = (message: string) => {
    const whatsappUrl = `https://wa.me/5521995775689?text=${message}`;
    const windowRef = window.open(whatsappUrl, '_blank');
    
    if (!windowRef) {
      throw new Error('Failed to open WhatsApp. Please check your popup blocker settings.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const formattedMessage = formatWhatsAppMessage(formData);
      openWhatsApp(formattedMessage);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      resetForm();
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : getTranslation('error')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {getTranslation('name')}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className={inputClasses}
          onChange={handleChange}
          value={formData.name}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {getTranslation('email')}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className={inputClasses}
          onChange={handleChange}
          value={formData.email}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          {getTranslation('phone')}
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          className={inputClasses}
          onChange={handleChange}
          value={formData.phone}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {getTranslation('message')}
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          className={inputClasses}
          onChange={handleChange}
          value={formData.message}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white transition-colors ${
          isSuccess
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? (
          <span className="animate-pulse">{getTranslation('sending')}</span>
        ) : isSuccess ? (
          <>
            {getTranslation('sent')}
            <Check className="ml-2 h-5 w-5" />
          </>
        ) : (
          <>
            {getTranslation('submit')}
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;