import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'web-dev',
    title: 'Desenvolvimento Web',
    description: 'Criamos aplicações web modernas, responsivas e escaláveis usando as mais recentes tecnologias.',
    icon: 'code',
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Automatização de processos, CI/CD, e gestão de infraestrutura para entregas ágeis e confiáveis.',
    icon: 'git-branch',
  },
  {
    id: 'cloud',
    title: 'AWS Cloud',
    description: 'Soluções cloud-native otimizadas para performance, segurança e escalabilidade na AWS.',
    icon: 'cloud',
  },
  {
    id: 'mobile',
    title: 'Apps Mobile',
    description: 'Desenvolvimento de aplicativos nativos e cross-platform para iOS e Android.',
    icon: 'smartphone',
  },
];