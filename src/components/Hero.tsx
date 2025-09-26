import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute -right-40 -bottom-32 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" aria-hidden="true" />
      <div className="absolute -left-32 -top-24 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full" aria-hidden="true" />
      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold uppercase tracking-wide bg-white/10 backdrop-blur rounded-full border border-white/20">
            Auditoria AWS + Relatório Executivo em 72h
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Auditoria Completa da sua Conta AWS
            <span className="text-emerald-300 block mt-2">Economia, Segurança e Confiança para sua liderança</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 leading-relaxed px-4">
            Identificamos riscos críticos, desperdícios de nuvem e oportunidades de escala. Você recebe um dossiê executivo em português e uma reunião estratégica com nosso líder técnico para priorizar ações imediatas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="https://awsaudit.huntermussel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-400 to-blue-600 hover:from-emerald-300 hover:to-blue-500 text-slate-950 px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-bold transition-all inline-flex items-center justify-center text-sm sm:text-base shadow-xl transform hover:scale-105"
            >
              Agendar Auditoria AWS
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-white/40 text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Falar com um Arquiteto Cloud
            </Link>
          </div>
          <p className="text-blue-100 text-sm mt-6">
            ✓ Conformidade com Well-Architected & CIS • ✓ Roadmap 30-60-90 dias • ✓ Oficinas para diretoria e time técnico
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;