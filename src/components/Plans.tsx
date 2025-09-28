import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: {
    label: string;
    href: string;
    external?: boolean;
  };
}

const Services = () => {
  const services: Service[] = [
    {
      name: 'AWS Audit Accelerator',
      price: 'R$ 12.900 fixo',
      description: 'Auditoria completa da conta AWS + workshop executivo',

      features: [
        'Revisão de 50+ controles de segurança, custos e confiabilidade',
        'Relatório bilíngue com scorecards e heat maps',
        'Debrief ao vivo com arquiteto AWS sênior',
        'Roadmap 30-60-90 dias com responsáveis e esforço estimado',
        'Suporte opcional para implementação acelerada'
      ],
      isPopular: true,
      cta: {
        label: 'Reservar auditoria AWS',
        href: 'https://awsaudit.huntermussel.com',
        external: true
      }
    },
    {
      name: 'Cloud Modernization Sprint',
      price: 'a partir de R$ 18.000',
      description: 'Evolução de workloads críticos na AWS',
      features: [
        'Avaliação de arquitetura e governança',
        'Blueprint de modernização orientado a produtos',
        'Infra as Code e automações de CI/CD',
        'Observabilidade e FinOps desde o dia zero',
        'Treinamento e transição para o time interno'
      ],
      cta: {
        label: 'Solicitar proposta',
        href: '/contact'
      }
    },
    {
      name: 'Plataformas Personalizadas',
      price: 'a partir de R$ 32.000',
      description: 'Soluções sob medida para novas linhas de receita',
      features: [
        'Descoberta e desenho de produto conjunto',
        'Equipe multidisciplinar dedicada',
        'Integrações com sistemas legados e parceiros',
        'Suporte a compliance (LGPD, PCI, HIPAA)',
        'Runbook operacional e handover completo'
      ],
      cta: {
        label: 'Discutir solução sob medida',
        href: '/contact'
      }

    },
    {
      name: 'Mobile & Experience Factory',
      price: 'a partir de R$ 22.000',
      description: 'Apps iOS/Android e experiências omnichannel',
      features: [
        'UX research com foco em retenção',
        'Desenvolvimento nativo ou cross-platform',
        'Integração com APIs e sistemas internos',
        'Publicação assistida nas lojas e ASO',
        'Monitoramento, analytics e growth contínuo'
      ],
      cta: {
        label: 'Conversar com especialista',
        href: '/contact'
      }
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Outras soluções Hunter Mussel
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Engenheiros, designers e líderes de produto prontos para acelerar sua estratégia digital
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <motion.div
              key={service.name}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                service.isPopular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {service.isPopular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                <p className="mt-4 text-gray-600">{service.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">{service.price}</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                {service.cta.external ? (
                  <a
                    href={service.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex w-full justify-center py-3 px-4 rounded-lg font-medium ${
                      service.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {service.cta.label}
                  </a>
                ) : (
                  <Link
                    to={service.cta.href}
                    className={`mt-8 inline-flex w-full justify-center py-3 px-4 rounded-lg font-medium ${
                      service.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {service.cta.label}
                  </Link>
                )}

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
