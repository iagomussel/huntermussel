
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, BookOpen, Code } from 'lucide-react';
import { useToast } from '../utils/useToast';
import Toast from './Toast';

interface NewsletterData {
  email: string;
  name: string;
  interests: string[];
  frequency: 'weekly' | 'monthly';
}

const Newsletter = () => {
  const [formData, setFormData] = useState<NewsletterData>({
    email: '',
    name: '',
    interests: [],
    frequency: 'monthly'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const interestOptions = [
    { id: 'tech-insights', label: 'Insights técnicos', icon: Code },
    { id: 'company-updates', label: 'Novidades Hunter Mussel', icon: Bell },
    { id: 'case-studies', label: 'Estudos de caso AWS', icon: BookOpen },
    { id: 'industry-trends', label: 'Tendências e FinOps', icon: Mail }
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestChange = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'newsletter',
          timestamp: new Date().toISOString(),
          source: 'huntermussel-website',
          data: formData
        })
      });

      if (response.ok) {
        showToast('Inscrição realizada! Você receberá nossos próximos conteúdos.', 'success');
        setFormData({
          email: '',
          name: '',
          interests: [],
          frequency: 'monthly'
        });
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      showToast('Não foi possível inscrever agora. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Receba novidades sobre AWS</h2>
          <p className="text-blue-100">
            Conteúdo prático sobre auditoria AWS, FinOps e cases brasileiros direto no seu e-mail
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Como gostaria de ser chamado"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail corporativo *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="voce@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Temas de interesse
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                        ${formData.interests.includes(option.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(option.id)}
                        onChange={() => handleInterestChange(option.id)}
                        disabled={isSubmitting}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequência desejada
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="weekly">Resumo semanal</option>
                <option value="monthly">Resumo mensal</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formData.interests.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Quero receber novidades'
              )}
            </button>

            {formData.interests.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                Selecione pelo menos um tema para receber conteúdos relevantes
              </p>
            )}
          </form>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 p-6 border-t">
          <h3 className="font-semibold mb-3 text-center">O que você vai receber</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Alertas sobre riscos e savings identificados em auditorias AWS</li>
            <li>• Cases reais com resultados para CFOs, CTOs e squads de plataforma</li>
            <li>• Checklists de conformidade e governança para diretoria</li>
            <li>• Convites prioritários para workshops e webinars exclusivos</li>
            <li>• Zero spam, cancelamento a qualquer momento</li>
          </ul>
        </div>
      </motion.div>
    </>
  );
};

export default Newsletter;
