import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Plans';
import ContactForm from '../components/ContactForm';
import { lazy } from 'react';
const MobileContactFlow = lazy(() => import('../components/MobileContactFlow'));
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Calculator,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  BadgeCheck,
  BarChart3,
  Globe2,
  Target,
  Building2,
  Lightbulb
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const auditDeliverables: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Shield,
    title: 'Raio-X de Segurança e Conformidade',
    description:
      'Mapeamos riscos críticos em IAM, redes, backups, GuardDuty, Shield e criptografia para fortalecer sua conta antes das auditorias.'
  },
  {
    icon: Calculator,
    title: 'Plano de Otimização de Custos',
    description:
      'Identificamos desperdícios, dimensionamento incorreto e oportunidades de savings com cenários claros de economia em até 30 dias.'
  },
  {
    icon: FileText,
    title: 'Dossiê Executivo Bilíngue',
    description:
      'Relatório em português e inglês com heatmaps, priorização 30-60-90 dias e recomendações acionáveis para diretoria e time técnico.'
  },
  {
    icon: Users,
    title: 'Reunião Estratégica com Líder Técnico',
    description:
      'Sessão de 60 minutos com nosso arquiteto AWS para alinhar prioridades, investimentos e plano de execução com todas as áreas.'
  }
];

const executiveBenefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: TrendingUp,
    title: 'Visão financeira imediata',
    description:
      'Você recebe cenários de ROI e impacto em OPEX/CAPEX para decidir investimentos com confiança e embasar comitês executivos.'
  },
  {
    icon: Clock,
    title: 'Diagnóstico em 72 horas',
    description:
      'Processo enxuto, com checklist Well-Architected e CIS Benchmarks, garantindo velocidade sem abrir mão da profundidade técnica.'
  },
  {
    icon: Shield,
    title: 'Governança pronta para auditorias',
    description:
      'Checklist de conformidade para LGPD, ISO 27001 e FinOps, reduzindo surpresas em auditorias internas e externas.'
  }
];

const auditProcess = [
  {
    title: 'Kick-off e descoberta',
    description:
      'Reunião inicial com liderança e squads técnicos para alinhar objetivos de negócio, escopo e acessos mínimos necessários.'
  },
  {
    title: 'Análise assistida por especialistas',
    description:
      'Revisão de 50+ controles de segurança, custos, performance e confiabilidade combinando automações proprietárias e entrevistas.'
  },
  {
    title: 'Relatório executivo + workshop',
    description:
      'Entrega do dossiê completo, apresentação ao board e definição das iniciativas de curto, médio e longo prazo.'
  }
];

const confidenceStats = [
  { stat: '72h', label: 'Entrega do relatório completo' },
  { stat: '30%', label: 'Economia média identificada' },
  { stat: '50+', label: 'Controles avaliados por auditoria' },
  { stat: '9.6/10', label: 'NPS com CFOs e CTOs atendidos' }
];

const testimonials = [
  {
    quote:
      'O relatório do AWS Audit Accelerator deu clareza total sobre os riscos de segurança e economias possíveis. Em duas semanas reduzimos 27% da fatura da AWS.',
    name: 'Fernanda Alves',
    role: 'CFO',
    company: 'ScaleCommerce'
  },
  {
    quote:
      'A reunião executiva com o líder técnico alinhou diretoria, segurança e engenharia em um único plano. Foi o melhor investimento para acelerar nossa jornada cloud.',
    name: 'Ricardo Lima',
    role: 'CTO',
    company: 'FinData Bank'
  },
  {
    quote:
      'Em menos de 72 horas tínhamos um roadmap completo com prioridades claras e quick wins. A equipe de Hunter Mussel entende o contexto brasileiro e fala a língua do board.',
    name: 'Juliana Rocha',
    role: 'Head de Tecnologia',
    company: 'MedPrime'
  }
];

const credibilitySignals: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: 'Arquitetos certificados pela AWS',
    description:
      'Time liderado por AWS Certified Solutions Architects com experiência em ambientes regulados, fintechs e SaaS globais.'
  },
  {
    icon: BarChart3,
    title: 'FinOps orientado a ROI',
    description:
      'Modelamos cenários de economia com foco em EBITDA, orçamento de TI e governança financeira com FinOps Foundation Framework.'
  },
  {
    icon: Globe2,
    title: 'Cobertura Brasil + EUA',
    description:
      'Suporte bilíngue em português e inglês, com relatórios executivos prontos para board meetings no Brasil e internacional.'
  },
  {
    icon: Target,
    title: 'Foco em riscos críticos',
    description:
      'Priorizamos 50+ controles Well-Architected, CIS e LGPD para eliminar exposições de segurança e compliance antes de auditorias externas.'
  }
];

const idealProfiles: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: 'Scale-ups e empresas enterprise',
    description:
      'Organizações com múltiplas contas, landing zones complexas ou pressionadas por comitês de risco e governança corporativa.'
  },
  {
    icon: Users,
    title: 'CFOs, CTOs e Heads de Segurança',
    description:
      'Lideranças que precisam traduzir métricas técnicas em decisões de investimento, savings e roadmap estratégico.'
  },
  {
    icon: Lightbulb,
    title: 'Times que preparam nova rodada de funding',
    description:
      'Startups e scale-ups que precisam demonstrar maturidade em segurança, eficiência em nuvem e governança para investidores.'
  }
];

const faqs = [
  {
    question: 'Como é feito o acesso à minha conta AWS durante a auditoria?',
    answer:
      'Seguimos princípios de menor privilégio com roles temporárias e trilhas de auditoria completas. Utilizamos IAM Identity Center ou AWS SSO conforme a sua política, e não armazenamos credenciais após o encerramento.'
  },
  {
    question: 'Quanto tempo leva para receber o relatório executivo?',
    answer:
      'O ciclo completo dura até 72 horas úteis: kick-off, coleta de evidências automatizadas, entrevistas rápidas e entrega do dossiê executivo acompanhada de workshop ao vivo.'
  },
  {
    question: 'Vocês ajudam a implementar as recomendações?',
    answer:
      'Sim. Podemos apoiar com um sprint de implementação focado nos quick wins priorizados, além de oferecer acompanhamento mensal para squads de segurança, plataforma ou FinOps.'
  },
  {
    question: 'O AWS Audit Accelerator substitui o AWS Well-Architected Review?',
    answer:
      'Nós incorporamos todos os pilares do Well-Architected, mas vamos além: adicionamos FinOps avançado, benchmarks de compliance (LGPD, ISO 27001) e um plano 30-60-90 dias com owners atribuídos.'
  }
];

const Home = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hunter Mussel',
    url: 'https://huntermussel.com',
    logo: 'https://huntermussel.com/assets/images/logo.svg',
    description:
      'Hunter Mussel entrega a AWS Audit Accelerator: auditoria completa da conta AWS com relatório executivo bilíngue e reunião com líder técnico.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR'

    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-0000',
      contactType: 'sales'
    },
    sameAs: [
      'https://github.com/huntermussel',
      'https://linkedin.com/company/huntermussel'
    ],
    offers: [
      {
        '@type': 'Service',
        name: 'AWS Audit Accelerator',
        serviceType: 'Auditoria de Conta AWS',
        url: 'https://awsaudit.huntermussel.com',
        areaServed: ['Brasil', 'Estados Unidos'],
        serviceOutput: 'Relatório executivo bilíngue, plano 30-60-90 dias e workshop com arquiteto AWS',
        provider: {
          '@type': 'Organization',
          name: 'Hunter Mussel'
        }
      },
      {
        '@type': 'Service',
        serviceType: 'Modernização de aplicações em nuvem',
        provider: {
          '@type': 'Organization',
          name: 'Hunter Mussel'
        }
      }
    ]
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))

  };

  const [auditRef, auditInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [credibilityRef, credibilityInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [auditRef, auditInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const [idealRef, idealInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [faqRef, faqInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const auditDeliverables: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: Shield,
      title: 'Security & Compliance Review',
      description: 'Pinpoint misconfigurations across IAM, VPC, GuardDuty, Shield, and encryption policies before attackers or auditors do.'
    },
    {
      icon: Calculator,
      title: 'Cost & Efficiency Optimization',
      description: 'Spot unused resources, right-size workloads, and model immediate savings opportunities across your AWS portfolio.'
    },
    {
      icon: FileText,
      title: 'Executive-Ready Reporting',
      description: 'Receive a concise executive summary plus a detailed technical appendix your engineering team can action immediately.'
    },
    {
      icon: Users,
      title: 'Live Strategy Workshop',
      description: 'Walk through findings with a senior AWS architect and align leadership on a 30-60-90 day modernization roadmap.'
    }
  ];

  const auditProcess = [
    {
      title: 'Kickoff & Context',
      description: 'We meet with your stakeholders, review your architecture goals, and collect the least privilege access needed for analysis.'
    },
    {
      title: 'Deep AWS Analysis',
      description: 'Automated and manual reviews across 45+ controls with Well-Architected and CIS Benchmarks guiding our assessment.'
    },
    {
      title: 'Executive Debrief',
      description: 'A 60-minute readout with leadership and engineering to prioritize remediation, savings, and modernization initiatives.'
    }
  ];

  const auditOutcomes = [
    { stat: '30%', label: 'Average Immediate Cost Savings' },
    { stat: '50+', label: 'Actionable Security & Resilience Checks' },
    { stat: '72h', label: 'Turnaround from Kickoff to Report' }
  ];

  return (
    <>
      <Helmet>
        <title>Hunter Mussel | Auditoria de Conta AWS com Relatório Executivo</title>
        <meta
          name="description"
          content="Auditoria AWS em 72h com relatório executivo bilíngue, plano 30-60-90 dias e reunião com líder técnico. Reduza custos, elimine riscos e acelere sua governança cloud."
        />
        <meta
          name="keywords"
          content="auditoria aws, aws well-architected, otimização de custos aws, segurança na nuvem, relatório executivo aws, finops"

        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://huntermussel.com/" />
        <meta property="og:title" content="Auditoria de Conta AWS | Hunter Mussel" />
        <meta
          property="og:description"
          content="Reserve o AWS Audit Accelerator: diagnóstico profundo, relatório executivo e workshop com arquiteto AWS para priorizar suas próximas iniciativas."

        />
        <meta property="og:image" content="https://huntermussel.com/assets/images/hero.jpg" />
        <meta property="og:site_name" content="Hunter Mussel" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://huntermussel.com/" />
        <meta name="twitter:title" content="Auditoria de Conta AWS | Hunter Mussel" />
        <meta
          name="twitter:description"
          content="Auditoria AWS completa com savings, conformidade e workshop executivo liderado por especialista certificado."

        />
        <meta name="twitter:image" content="https://huntermussel.com/assets/images/hero.jpg" />

        <link rel="canonical" href="https://huntermussel.com/" />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>

      <main id="main-content">
        <Hero />

        <section ref={credibilityRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={credibilityInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <span className="inline-flex items-center bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
                Por que Hunter Mussel
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Auditoria de conta AWS que entrega clareza para o board e para os squads
              </h2>
              <p className="text-lg text-gray-600">
                O AWS Audit Accelerator une Well-Architected, FinOps avançado e governança de segurança para que você reduza custos, elimine riscos críticos e comprove maturidade em cloud.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {credibilitySignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <motion.div
                    key={signal.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={credibilityInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{signal.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{signal.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://awsaudit.huntermussel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg"
              >
                Ver detalhes do AWS Audit Accelerator
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 text-slate-900 hover:bg-slate-100 font-semibold transition-colors"
              >
                Conversar sobre contexto da sua conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section ref={auditRef} className="py-20 bg-slate-950 text-white">

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={auditInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <span className="inline-flex items-center bg-emerald-500/10 text-emerald-200 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
                AWS Audit Accelerator
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Auditoria de Conta AWS que gera ação imediata
              </h2>
              <p className="text-lg md:text-xl text-blue-100">
                Nossos especialistas certificam a saúde da sua infraestrutura, revelam oportunidades de economia e entregam um dossiê executivo pronto para apresentar ao board.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {auditDeliverables.map((deliverable, index) => {
                const Icon = deliverable.icon;
                return (
                  <motion.div
                    key={deliverable.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={auditInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-6"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-200" />

                    </div>
                    <h3 className="text-xl font-semibold mb-3">{deliverable.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{deliverable.description}</p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://awsaudit.huntermussel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-blue-600 text-slate-900 font-semibold hover:from-emerald-300 hover:to-blue-500 transition-all shadow-lg"
              >
                Reservar minha auditoria AWS
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/40 text-white hover:bg-white/10 font-semibold transition-colors"
              >
                Conversar com especialista
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section ref={idealRef} className="py-16 bg-blue-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Para quem criamos o AWS Audit Accelerator</h2>
              <p className="text-lg text-slate-600">
                Se você precisa provar governança em cloud, destravar savings ou preparar a empresa para novas auditorias, este programa foi desenhado para você.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {idealProfiles.map((profile, index) => {
                const Icon = profile.icon;
                return (
                  <motion.div
                    key={profile.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={idealInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{profile.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.description}</p>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </section>

        <section ref={statsRef} className="py-16 bg-white">

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-gray-600 mb-4 uppercase tracking-wide text-sm">Confiança de lideranças em nuvem no Brasil e nos EUA</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {confidenceStats.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">{item.stat}</div>
                    <div className="text-gray-600 text-sm uppercase tracking-wide">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section ref={benefitsRef} className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Impacto direto para o board executivo</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transforme dados técnicos em decisões estratégicas. Nosso relatório traduz métricas de segurança, custos e performance em ações priorizadas para CFOs, CTOs e líderes de produto.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {executiveBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={processRef} className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Como funciona o AWS Audit Accelerator</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Metodologia comprovada para gerar clareza técnica e estratégica sem interromper suas operações.
                </p>
                <div className="space-y-6">
                  {auditProcess.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-200 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-blue-100 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-slate-900/70 border border-slate-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-4">O que está incluído</h3>
                <ul className="space-y-4 text-sm text-blue-100">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5" />
                    Inventário detalhado de contas, workloads críticos, gaps de governança e recomendações de priorização.
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5" />
                    Plano de savings com quick wins e iniciativas estruturais incluindo responsáveis e estimativas de esforço.
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5" />
                    Reunião executiva com materiais prontos para apresentar em comitês de risco, tecnologia e finanças.
                  </li>
                </ul>
                <a
                  href="https://awsaudit.huntermussel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition-colors"
                >
                  Conferir planos e agenda disponível
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={testimonialsRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Executivos que confiam na Hunter Mussel</h2>
              <div className="flex justify-center mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">Avaliação média 4.9/5</span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm"
                >
                  <div className="flex mb-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">“{testimonial.quote}”</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Services />

        <section ref={faqRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas frequentes sobre o AWS Audit Accelerator</h2>
              <p className="text-lg text-gray-600">
                Detalhes práticos sobre acesso, prazos e formatos para você tomar a melhor decisão sem surpresas.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl p-6 bg-gray-50"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-emerald-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Agenda semanal limitada
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para desbloquear sua próxima rodada de savings?</h2>
              <p className="text-lg text-blue-100 mb-8">
                Reservamos poucas auditorias por semana para garantir atenção total da nossa equipe sênior. Escolha o melhor formato para falar conosco agora mesmo.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
                  <Clock className="h-8 w-8 text-emerald-300 mb-3" />
                  <h3 className="font-semibold mb-2">Reunião executiva</h3>
                  <p className="text-sm text-blue-100">30 minutos com líder técnico para CFOs, CTOs e diretores.</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
                  <Users className="h-8 w-8 text-emerald-300 mb-3" />
                  <h3 className="font-semibold mb-2">Sessão com squads</h3>
                  <p className="text-sm text-blue-100">Alinhamento com engenharia, segurança e FinOps.</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
                  <FileText className="h-8 w-8 text-emerald-300 mb-3" />
                  <h3 className="font-semibold mb-2">Assessment preliminar</h3>
                  <p className="text-sm text-blue-100">Checklist rápido para priorizar workloads críticos.</p>
                </div>
              </div>

              <div className="lg:hidden mb-8">
                <MobileContactFlow />
              </div>
              <div className="hidden lg:block mb-8">
                <ContactForm />
              </div>

              <p className="text-sm text-blue-200">Dados protegidos e confidenciais. Sem spam.</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Garanta sua próxima decisão estratégica em nuvem</h2>
            <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Tenha clareza absoluta sobre riscos, custos e oportunidades na AWS com um parceiro que traduz dados técnicos para o idioma da diretoria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://awsaudit.huntermussel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-lg"
              >
                Fechar minha auditoria AWS agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border-2 border-white/70 text-white hover:bg-white hover:text-slate-900 rounded-lg font-semibold transition-colors"
              >
                Quero falar com um especialista
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-blue-100 mt-4">Tempo médio de início: 48 horas após o kick-off.</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
