
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Gift, Users, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '../utils/useToast';
import Toast from './Toast';

interface ReferralData {
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  referredCompany?: string;
  message?: string;
}

const ReferralProgram = () => {
  const [formData, setFormData] = useState<ReferralData>({
    referrerName: '',
    referrerEmail: '',
    referredName: '',
    referredEmail: '',
    referredCompany: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://huntermussel.com';
  const referralLink = `${baseUrl}?ref=${formData.referrerEmail ? btoa(formData.referrerEmail) : ''}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      showToast('Link de indicação copiado!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast('Não foi possível copiar o link', 'error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send referral data to n8n webhook
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
          type: 'referral',
          timestamp: new Date().toISOString(),
          source: 'huntermussel-website',
          data: formData
        })
      });

      if (response.ok) {
        showToast('Indicação enviada! Entraremos em contato com seu indicado em breve.', 'success');
        setFormData({
          referrerName: '',
          referrerEmail: '',
          referredName: '',
          referredEmail: '',
          referredCompany: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit referral');
      }
    } catch (error) {
      showToast('Não foi possível enviar agora. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <div className="flex items-center mb-4">
              <Gift className="w-8 h-8 mr-3" />
              <h2 className="text-3xl font-bold">Programa de Indicação Hunter Mussel</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Indique empresas que precisam do AWS Audit Accelerator e receba 10% da primeira venda confirmada.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-xl font-semibold mb-6 text-center">Benefícios para você e seu indicado</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Comissão de 10%</h4>
                <p className="text-gray-600 text-sm">Receba 10% do valor do primeiro projeto fechado pelo indicado</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Bônus para o indicado</h4>
                <p className="text-gray-600 text-sm">O indicado garante 5% OFF no AWS Audit Accelerator</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Compartilhamento simples</h4>
                <p className="text-gray-600 text-sm">Use seu link personalizado ou envie os dados direto pelo formulário</p>
              </div>
            </div>
          </div>

          {/* Referral Link Section */}
          <div className="p-8 border-b">
            <h3 className="text-xl font-semibold mb-4">Seu link de indicação</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
              />
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Compartilhe com CFOs, CTOs e líderes de plataforma que precisam auditar a conta AWS.
            </p>
          </div>

          {/* Referral Form */}
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6">Envie uma indicação agora</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 text-gray-700">Seus dados</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="referrerName"
                      value={formData.referrerName}
                      onChange={handleChange}
                      placeholder="Seu nome *"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <input
                      type="email"
                      name="referrerEmail"
                      value={formData.referrerEmail}
                      onChange={handleChange}
                      placeholder="Seu e-mail *"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-gray-700">Dados do indicado</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="referredName"
                      value={formData.referredName}
                      onChange={handleChange}
                      placeholder="Nome do indicado *"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <input
                      type="email"
                      name="referredEmail"
                      value={formData.referredEmail}
                      onChange={handleChange}
                      placeholder="E-mail do indicado *"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      name="referredCompany"
                      value={formData.referredCompany}
                      onChange={handleChange}
                      placeholder="Empresa (opcional)"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Contexto adicional sobre a conta AWS (opcional)"
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
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
                  'Enviar indicação'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ReferralProgram;
