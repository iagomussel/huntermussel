import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, FileText, Shield, Calculator, Clock, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import type { LucideIcon } from 'lucide-react';

const Products = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { ref: awsRef, inView: awsInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const awsAuditHighlights: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: Shield,
      title: 'Blindagem de segurança e conformidade',
      description: 'Apontamos gaps em IAM, redes, proteção de dados e monitoramento antes que virem incidentes ou findings.'
    },
    {
      icon: Calculator,
      title: 'Roteiro de otimização de custos',
      description: 'Simulamos economias em instâncias reservadas, storage e workloads ociosos em horas, não semanas.'
    },
    {
      icon: FileText,
      title: 'Relatório executivo completo',
      description: 'Entregamos briefing pronto para o board e apêndice técnico detalhado para squads de engenharia.'
    },
    {
      icon: Clock,
      title: 'Entrega em 72 horas',
      description: 'Do kickoff à reunião executiva em três dias úteis com arquitetos AWS seniores liderando.'

    }
  ];

  const awsAuditStats = [
    { stat: '30%', label: 'Economia média identificada' },
    { stat: '50+', label: 'Controles avaliados por auditoria' },
    { stat: '1', label: 'Workshop estratégico incluso' }

  ];

  const odontomasterFeatures = [
    {
      icon: Users,
      title: 'Gestão de pacientes',
      description: 'Prontuários completos, histórico clínico e anexos centralizados'
    },
    {
      icon: Calendar,
      title: 'Agenda inteligente',
      description: 'Controle de consultas com confirmações automáticas e lembretes'
    },
    {
      icon: FileText,
      title: 'Registros eletrônicos',
      description: 'Armazenamento seguro de laudos, imagens e planos de tratamento'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Produtos - AWS Audit Accelerator e Plataformas Sob Medida | Hunter Mussel</title>
        <meta
          name="description"
          content="Conheça o AWS Audit Accelerator e programas cloud da Hunter Mussel. Auditoria completa da conta AWS, plataformas verticais e modernização sob medida para seu negócio."

        />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-6">
                Produtos e Programas que aceleram sua nuvem
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Do AWS Audit Accelerator às plataformas personalizadas, a Hunter Mussel entrega soluções que blindam segurança, reduzem custos e habilitam novas receitas digitais.

              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://awsaudit.huntermussel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
                >
                  Reservar AWS Audit

                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border border-blue-100 text-blue-100 hover:bg-blue-500/20 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Conversar sobre soluções sob medida

                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AWS Audit Accelerator Section */}
        <section ref={awsRef} className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={awsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <span className="inline-flex items-center bg-blue-500/10 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  AWS Audit Accelerator
                </span>
                <h2 className="text-3xl font-bold leading-tight">
                  O caminho mais rápido para um diagnóstico executivo da sua conta AWS.
                </h2>
                <p className="text-blue-100 text-lg">
                  Em três dias úteis avaliamos 50+ controles de segurança, infraestrutura, dados e custos. Você sai com um plano de ação priorizado e um workshop executivo conduzido por arquiteto AWS sênior.

                </p>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                    Revisão completa alinhada ao AWS Well-Architected e aos benchmarks CIS.
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                    Scorecards executivos com savings quantificados, nível de risco e esforço de mitigação.
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                    Roadmap 30-60-90 dias com apoio opcional da nossa engenharia para implementação acelerada.

                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="https://awsaudit.huntermussel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-500 text-slate-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-400 transition-colors"
                  >
                    Ver planos e agenda

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center border border-blue-200 text-blue-100 hover:bg-blue-500/20 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Solicitar proposta enterprise

                  </Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  {awsAuditStats.map((item) => (
                    <div key={item.label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-5 text-center">
                      <div className="text-2xl font-bold text-blue-200 mb-1">{item.stat}</div>
                      <div className="text-xs uppercase tracking-wide text-blue-300">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={awsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                {awsAuditHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={highlight.title} className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-blue-200" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* OdontoMaster Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">OdontoMaster</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Plataforma completa para clínicas odontológicas. Simplifique processos,
                    aumente a produtividade e ofereça experiências memoráveis aos pacientes.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Agenda inteligente com confirmação automática</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Prontuários eletrônicos integrados com imagens e laudos</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Financeiro integrado com convênios e faturamento</span>
                    </div>
                  </div>
                  <div className="mt-8 space-x-4">
                    <a
                      href="/produtos/odontomaster"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Conhecer solução
                    </a>
                    <button
                      className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Agendar demonstração
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-8 md:p-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Recursos em destaque</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {odontomasterFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="bg-white p-4 rounded-lg shadow"
                          >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Development & Custom Solutions Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Programas digitais sob medida</h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Além da auditoria AWS, entregamos plataformas completas para setores regulados e negócios que precisam escalar operações com segurança, compliance e experiência excepcional.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Saúde e bem-estar</h3>
                <p className="text-gray-600 mb-4">
                  CRMs clínicos, telemedicina, portais de pacientes e integrações com operadoras e laboratórios.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Fluxos regulatórios prontos para LGPD e ANS</li>
                  <li>• Dashboards de indicadores clínicos e financeiros</li>
                  <li>• Automação de faturamento, cobranças e autorizações</li>
                </ul>
                <Link to="/contact" className="inline-block text-blue-600 font-semibold hover:text-blue-700">
                  Falar com especialista →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Educação e impacto social</h3>
                <p className="text-gray-600 mb-4">
                  Plataformas de aprendizagem, avaliação contínua e comunidades híbridas para escolas, edtechs e instituições.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Engajamento multi-dispositivo para alunos e famílias</li>
                  <li>• Analytics pedagógico e relatórios para gestores</li>
                  <li>• Integrações com ERPs acadêmicos e CRMs de captação</li>
                </ul>
                <Link to="/contact" className="inline-block text-blue-600 font-semibold hover:text-blue-700">
                  Discutir projeto →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h2a2 2 0 012 2v9a2 2 0 01-2 2H3m14-13h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M9 5h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Indústria e varejo</h3>
                <p className="text-gray-600 mb-4">
                  Plataformas de monitoramento, automação e experiência omnichannel conectadas à AWS e sistemas legados.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Integrações com ERPs, WMS, OMS e marketplaces</li>
                  <li>• IA para previsão de demanda e manutenção preditiva</li>
                  <li>• Portais B2B/B2C com catálogos e pricing dinâmico</li>
                </ul>
                <Link to="/contact" className="inline-block text-blue-600 font-semibold hover:text-blue-700">
                  Explorar possibilidades →
                </Link>
              </div>
            </div>
          </div>
        </section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar uma conversa estratégica
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </main>
    </>
  );
};

export default Products; 