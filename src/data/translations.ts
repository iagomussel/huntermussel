import type { Lang } from "@/context/LangContext";

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const heroT = {
  en: {
    badge: "AI Automation, DevOps & Software Delivery",
    h1a: "AI automation, DevOps, &",
    h1b: "scalable software engineering",
    subtitle:
      "HunterMussel designs custom software, cloud infrastructure, and AI automation systems for teams that need reliable delivery, faster operations, and measurable growth.",
    cta1: "Start Project",
    cta2: "View Case Studies",
    terminal1: "▸ Provisioning cloud infrastructure...",
    terminal2: "▸ Deploying scalable architecture...",
    terminal3: "✓ System online with seamless AI integrations 🚀",
  },
  pt: {
    badge: "Automação com IA, DevOps & Entrega de Software",
    h1a: "Automação com IA, DevOps e",
    h1b: "engenharia de software escalável",
    subtitle:
      "HunterMussel projeta software personalizado, infraestrutura em nuvem e sistemas de automação com IA para equipes que precisam de entrega confiável, operações mais ágeis e crescimento mensurável.",
    cta1: "Iniciar Projeto",
    cta2: "Ver Cases",
    terminal1: "▸ Provisionando infraestrutura em nuvem...",
    terminal2: "▸ Implantando arquitetura escalável...",
    terminal3: "✓ Sistema online com integrações de IA 🚀",
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const servicesT = {
  en: {
    label: "// expertise",
    heading: "Services for systems, delivery, and automation",
    viewAll: "View all services",
    items: [
      {
        title: "Workflows & BPM",
        slug: "workflows-bpm",
        description:
          "Designing the operating backbone behind scalable teams, approvals, handoffs, and automated business logic.",
      },
      {
        title: "CI/CD & DevOps Engineering",
        slug: "ci-cd-devops",
        description:
          "Automated delivery pipelines, infrastructure as code, and production-safe release systems for fast teams.",
      },
      {
        title: "Intelligent Automation & AI Agents",
        slug: "intelligent-automation",
        description:
          "Autonomous agents, orchestrated workflows, and AI-powered task automation connected to your real systems.",
      },
      {
        title: "AI Process Management",
        slug: "ai-process-management",
        description:
          "Mapping, redesigning, and optimizing operational processes with AI-backed decision systems and measurable ROI.",
      },
      {
        title: "Cloud Infrastructure & AI Deployment",
        slug: "cloud-infrastructure-ai",
        description:
          "Production cloud platforms for AI workloads, LLMOps, observability, and high-availability deployment patterns.",
      },
      {
        title: "Security, Compliance & LGPD/GDPR",
        slug: "security-compliance",
        description:
          "Security audits, privacy controls, encryption strategy, and compliance implementation for sensitive systems.",
      },
    ],
  },
  pt: {
    label: "// expertise",
    heading: "Serviços para sistemas, entrega e automação",
    viewAll: "Ver todos os serviços",
    items: [
      {
        title: "Workflows & BPM",
        slug: "workflows-bpm",
        description:
          "Desenhando a espinha dorsal operacional de equipes escaláveis, aprovações, handoffs e lógica de negócio automatizada.",
      },
      {
        title: "CI/CD & Engenharia DevOps",
        slug: "ci-cd-devops",
        description:
          "Pipelines de entrega automatizados, infraestrutura como código e sistemas de deploy seguros para times ágeis.",
      },
      {
        title: "Automação Inteligente & Agentes de IA",
        slug: "intelligent-automation",
        description:
          "Agentes autônomos, workflows orquestrados e automação de tarefas com IA conectados aos seus sistemas reais.",
      },
      {
        title: "Gestão de Processos com IA",
        slug: "ai-process-management",
        description:
          "Mapeamento, redesenho e otimização de processos operacionais com sistemas de decisão baseados em IA e ROI mensurável.",
      },
      {
        title: "Infraestrutura em Nuvem & Deploy de IA",
        slug: "cloud-infrastructure-ai",
        description:
          "Plataformas em nuvem para workloads de IA, LLMOps, observabilidade e padrões de alta disponibilidade.",
      },
      {
        title: "Segurança, Compliance & LGPD/GDPR",
        slug: "security-compliance",
        description:
          "Auditorias de segurança, controles de privacidade, estratégia de criptografia e implementação de compliance para sistemas sensíveis.",
      },
    ],
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export const aboutT = {
  en: {
    label: "// about",
    heading1: "Software engineering",
    heading2: "built for scale",
    p1: "HunterMussel is a software house driven by a passion for solving complex problems. We combine robust custom development, cloud operations (Ops), and technical SEO to build highly scalable systems.",
    p2: "Operating from the Americas (GMT-3), we collaborate in real-time with global teams to deliver high-impact solutions.",
    p3: "We don't just build software; we architect scalable infrastructure and integrate AI the right way, ensuring high performance, reliable operations, and strong search engine visibility.",
    bio: "Software engineer with deep expertise in distributed architectures, cloud operations, and SEO marketing. Passionate about building scalable systems, high-performance teams, and integrating AI seamlessly.",
  },
  pt: {
    label: "// sobre",
    heading1: "Engenharia de software",
    heading2: "construída para escalar",
    p1: "HunterMussel é uma software house movida pela paixão em resolver problemas complexos. Combinamos desenvolvimento personalizado, operações em nuvem (Ops) e SEO técnico para construir sistemas altamente escaláveis.",
    p2: "Atuando das Américas (GMT-3), colaboramos em tempo real com equipes globais para entregar soluções de alto impacto.",
    p3: "Não construímos apenas software; arquitetamos infraestrutura escalável e integramos IA do jeito certo, garantindo alta performance, operações confiáveis e forte visibilidade nos mecanismos de busca.",
    bio: "Engenheiro de software com profunda expertise em arquiteturas distribuídas, operações em nuvem e marketing de SEO. Apaixonado por construir sistemas escaláveis, times de alta performance e integração de IA de forma eficiente.",
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------
export const casesT = {
  en: {
    label: "// cases",
    headingPre: "Projects We've ",
    headingHighlight: "Delivered",
    subtitle:
      "Real solutions built with AI, automation, and cutting-edge engineering.",
    viewAll: "View all case studies",
    items: [
      {
        title: "Delivery App",
        slug: "delivery-app",
        category: "Automation & Logistics",
        description:
          "AI-powered delivery app for route optimization, demand forecasting, and real-time automated order management.",
      },
      {
        title: "AI-Powered LMS",
        slug: "ai-powered-lms",
        category: "Education & AI",
        description:
          "Learning platform with AI adaptive paths, automatic grading, and student performance analytics.",
      },
      {
        title: "Corporate Website",
        slug: "corporate-website",
        category: "Digital Presence",
        description:
          "Corporate website with advanced SEO, headless CMS, and intelligent customer service chatbot integration.",
      },
      {
        title: "Smart CRM",
        slug: "smart-crm",
        category: "Management & Sales",
        description:
          "CRM with AI lead scoring, follow-up automation, and predictive dashboards for sales teams.",
      },
      {
        title: "Scheduling App",
        slug: "scheduling-app",
        category: "Productivity",
        description:
          "Intelligent scheduling system with AI for time optimization, automatic reminders, and availability management.",
      },
    ],
  },
  pt: {
    label: "// cases",
    headingPre: "Projetos que ",
    headingHighlight: "Entregamos",
    subtitle:
      "Soluções reais construídas com IA, automação e engenharia de ponta.",
    viewAll: "Ver todos os cases",
    items: [
      {
        title: "App de Delivery",
        slug: "delivery-app",
        category: "Automação & Logística",
        description:
          "App de delivery com IA para otimização de rotas, previsão de demanda e gestão automatizada de pedidos em tempo real.",
      },
      {
        title: "LMS com IA",
        slug: "ai-powered-lms",
        category: "Educação & IA",
        description:
          "Plataforma de ensino com trilhas adaptativas por IA, correção automática e analytics de desempenho dos alunos.",
      },
      {
        title: "Site Corporativo",
        slug: "corporate-website",
        category: "Presença Digital",
        description:
          "Site corporativo com SEO avançado, CMS headless e chatbot inteligente para atendimento ao cliente.",
      },
      {
        title: "CRM Inteligente",
        slug: "smart-crm",
        category: "Gestão & Vendas",
        description:
          "CRM com scoring de leads por IA, automação de follow-up e dashboards preditivos para equipes de vendas.",
      },
      {
        title: "App de Agendamento",
        slug: "scheduling-app",
        category: "Produtividade",
        description:
          "Sistema de agendamento inteligente com IA para otimização de horários, lembretes automáticos e gestão de disponibilidade.",
      },
    ],
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// Tech
// ---------------------------------------------------------------------------
export const techT = {
  en: { heading: "Technologies We Master" },
  pt: { heading: "Tecnologias que Dominamos" },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------
export const toolsT = {
  en: {
    label: "// tools",
    heading: "Free Developer Tools",
    subtitle:
      "Client-side utilities for encoding, hashing, formatting, and more — no account, no uploads, no tracking.",
    viewAll: "View all tools →",
    items: [
      {
        slug: "prompt-optimizer",
        title: "Prompt Optimizer",
        category: "ai",
        description:
          "5-step wizard that assembles production-ready prompts for Claude, GPT-4, Gemini and open-source models. Fully deterministic.",
      },
      {
        slug: "token-counter",
        title: "Token Counter",
        category: "ai",
        description:
          "Count tokens and estimate API costs for GPT-4o, Claude, Gemini and more — in real-time, right in your browser.",
        badge: "new",
      },
      {
        slug: "commit-message-generator",
        title: "Commit Message Generator",
        category: "ai",
        description:
          "Step-by-step wizard to craft conventional commit messages with scope, breaking changes, and branch name suggestions.",
        badge: "new",
      },
      {
        slug: "ai-model-picker",
        title: "AI Model Picker",
        category: "ai",
        description:
          "Answer 5 questions about your use case and get the top 3 AI models ranked by fit — with pros, cons, and pricing.",
        badge: "new",
      },
      {
        slug: "llm-cost-estimator",
        title: "LLM Cost Estimator",
        category: "ai",
        description:
          "Compare live API costs across 300+ models from OpenRouter. Enter token counts, sort by price, filter by provider.",
        badge: "new",
      },
      {
        slug: "persona-picker",
        title: "AI Persona Picker",
        category: "ai",
        description:
          "20 ready-made system prompt personas for engineers, writers, and analysts. Copy in one click or save your own.",
        badge: "new",
      },
      {
        slug: "base64-converter",
        title: "Base64 Converter",
        category: "encoding",
        description:
          "Convert, validate, and repair Base64/Base64URL payloads fully client-side.",
      },
      {
        slug: "hash-generator",
        title: "Hash Generator",
        category: "hashing",
        description:
          "Generate and verify MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
      },
      {
        slug: "image-optimizer",
        title: "Image Optimizer",
        category: "imaging",
        description:
          "Convert images to WebP in-browser. Control quality and resize — zero uploads.",
      },
      {
        slug: "markdown-editor",
        title: "Markdown Editor",
        category: "writing",
        description:
          "Live Markdown editor with preview, export, and formatting shortcuts.",
      },
      {
        slug: "estimators",
        title: "Estimators",
        category: "planning",
        description:
          "Project and effort estimation tools for engineering teams.",
      },
      {
        slug: "log-viewer",
        title: "Log Viewer",
        category: "devops",
        description:
          "Parse, filter, and inspect structured log files directly in the browser.",
      },
      {
        slug: "jwt-inspector",
        title: "JWT Inspector",
        category: "security",
        description:
          "Decode JWT tokens, inspect claims, and get live expiry countdown with security warnings.",
      },
      {
        slug: "yaml-json",
        title: "YAML ↔ JSON",
        category: "devops",
        description:
          "Bidirectional YAML and JSON converter with real-time validation. No server, no logs.",
      },
      {
        slug: "online-linters",
        title: "Online Linters",
        category: "linting",
        description:
          "Real-time linter for JSON, YAML, JavaScript, and Markdown powered by Monaco Editor.",
      },
      {
        slug: "diff-viewer",
        title: "Diff Viewer",
        category: "text",
        description:
          "Compare two texts side-by-side or unified — added, removed, and unchanged lines highlighted.",
      },
    ],
  },
  pt: {
    label: "// tools",
    heading: "Ferramentas Gratuitas para Desenvolvedores",
    subtitle:
      "Utilitários client-side para encoding, hashing, formatação e muito mais — sem conta, sem uploads, sem rastreamento.",
    viewAll: "Ver todas as ferramentas →",
    items: [
      {
        slug: "prompt-optimizer",
        title: "Otimizador de Prompts",
        category: "ai",
        description:
          "Wizard em 5 etapas que monta prompts prontos para produção para Claude, GPT-4, Gemini e modelos open-source. Totalmente determinístico.",
      },
      {
        slug: "token-counter",
        title: "Contador de Tokens",
        category: "ai",
        description:
          "Conte tokens e estime custos de API para GPT-4o, Claude, Gemini e mais — em tempo real, direto no navegador.",
        badge: "new",
      },
      {
        slug: "commit-message-generator",
        title: "Gerador de Mensagens de Commit",
        category: "ai",
        description:
          "Wizard passo a passo para criar mensagens de commit convencionais com escopo, breaking changes e sugestões de nome de branch.",
        badge: "new",
      },
      {
        slug: "ai-model-picker",
        title: "Seletor de Modelo de IA",
        category: "ai",
        description:
          "Responda 5 perguntas sobre seu caso de uso e obtenha os 3 principais modelos de IA ranqueados por adequação — com prós, contras e preços.",
        badge: "new",
      },
      {
        slug: "llm-cost-estimator",
        title: "Estimador de Custo de LLM",
        category: "ai",
        description:
          "Compare custos de API em tempo real de 300+ modelos no OpenRouter. Insira contagens de tokens, ordene por preço, filtre por provedor.",
        badge: "new",
      },
      {
        slug: "persona-picker",
        title: "Seletor de Persona de IA",
        category: "ai",
        description:
          "20 personas de prompt de sistema prontas para engenheiros, escritores e analistas. Copie em um clique ou salve as suas.",
        badge: "new",
      },
      {
        slug: "base64-converter",
        title: "Conversor Base64",
        category: "encoding",
        description:
          "Converta, valide e repare payloads Base64/Base64URL totalmente no lado do cliente.",
      },
      {
        slug: "hash-generator",
        title: "Gerador de Hash",
        category: "hashing",
        description:
          "Gere e verifique hashes MD5, SHA-1, SHA-256, SHA-384 e SHA-512.",
      },
      {
        slug: "image-optimizer",
        title: "Otimizador de Imagens",
        category: "imaging",
        description:
          "Converta imagens para WebP no navegador. Controle qualidade e redimensione — sem uploads.",
      },
      {
        slug: "markdown-editor",
        title: "Editor Markdown",
        category: "writing",
        description:
          "Editor Markdown ao vivo com preview, exportação e atalhos de formatação.",
      },
      {
        slug: "estimators",
        title: "Estimativas",
        category: "planning",
        description:
          "Ferramentas de estimativa de projetos e esforço para times de engenharia.",
      },
      {
        slug: "log-viewer",
        title: "Visualizador de Logs",
        category: "devops",
        description:
          "Parse, filtre e inspecione arquivos de log estruturados diretamente no navegador.",
      },
      {
        slug: "jwt-inspector",
        title: "Inspector JWT",
        category: "security",
        description:
          "Decodifique tokens JWT, inspecione claims e obtenha contagem regressiva de expiração com avisos de segurança.",
      },
      {
        slug: "yaml-json",
        title: "YAML ↔ JSON",
        category: "devops",
        description:
          "Conversor bidirecional YAML e JSON com validação em tempo real. Sem servidor, sem logs.",
      },
      {
        slug: "online-linters",
        title: "Linters Online",
        category: "linting",
        description:
          "Linter em tempo real para JSON, YAML, JavaScript e Markdown com Monaco Editor.",
      },
      {
        slug: "diff-viewer",
        title: "Diff Viewer",
        category: "text",
        description:
          "Compare dois textos lado a lado ou unificado — linhas adicionadas, removidas e inalteradas destacadas.",
      },
    ],
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
export const contactT = {
  en: {
    label: "// contact",
    headingPre: "Let's Build ",
    headingHighlight: "Together?",
    subtitle: "Tell us about your project. We'll respond within 24 hours.",
    preferWriting: "Prefer writing first?",
    formDescription:
      "Send the project context, current constraints, and what kind of outcome you need. If scheduling is easier, the live calendar is available on the right.",
    labelName: "Name",
    labelEmail: "Email",
    labelPhone: "Phone (Optional)",
    labelMessage: "Message",
    placeholderName: "Your name",
    placeholderPhone: "+1 (555) 000-0000",
    placeholderMessage: "Describe your project...",
    btnSending: "Sending...",
    btnSend: "Send Message",
    successMsg:
      "Thank you for contacting us! Message sent. We'll respond shortly.",
    errorMsg:
      "I'm sorry, due the high demand we can't meet your request at moment. Hope we can talk soon.",
  },
  pt: {
    label: "// contato",
    headingPre: "Vamos Construir ",
    headingHighlight: "Juntos?",
    subtitle: "Fale sobre o seu projeto. Respondemos em até 24 horas.",
    preferWriting: "Prefere escrever primeiro?",
    formDescription:
      "Envie o contexto do projeto, restrições atuais e o tipo de resultado que você precisa. Se agendar for mais fácil, o calendário ao vivo está disponível ao lado.",
    labelName: "Nome",
    labelEmail: "E-mail",
    labelPhone: "Telefone (Opcional)",
    labelMessage: "Mensagem",
    placeholderName: "Seu nome",
    placeholderPhone: "+55 (21) 99999-9999",
    placeholderMessage: "Descreva seu projeto...",
    btnSending: "Enviando...",
    btnSend: "Enviar Mensagem",
    successMsg:
      "Obrigado pelo contato! Mensagem enviada. Responderemos em breve.",
    errorMsg:
      "Pedimos desculpas, devido à alta demanda não podemos atender sua solicitação no momento. Esperamos conversar em breve.",
  },
} satisfies Record<Lang, object>;

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export const faqT = {
  en: { title: "Frequently Asked Questions" },
  pt: { title: "Perguntas Frequentes" },
} satisfies Record<Lang, object>;
