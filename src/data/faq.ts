export interface FAQItem {
  question: string;
  answer: string;
}

export const homeFAQ: FAQItem[] = [
  {
    question: "What is HunterMussel?",
    answer:
      "HunterMussel is a software house specializing in DevOps, AI automation, and scalable software engineering. We help teams that need reliable delivery, robust cloud infrastructure, and AI integrated into real operational systems — not just demos.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Primarily scale-ups and funded startups that need to scale technology without building a large internal team. We also work with engineering teams at established companies looking to modernize their infrastructure and delivery pipelines.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We operate in GMT-3 and collaborate in real time with teams in the US, Europe, and Latin America. All documentation and communication for international projects is delivered in English.",
  },
  {
    question: "Is HunterMussel a freelancer or an agency?",
    answer:
      "Neither in the traditional sense. We operate as a technical partner — a small, senior-only team that works close to your engineering org. No account managers in the middle. You talk directly to the people building.",
  },
  {
    question: "How does a new project start?",
    answer:
      "We begin with a free diagnostic session to understand your technical context, current bottlenecks, and goals. From there, we deliver a proposal with scope, timeline, and engagement model (fixed-scope project or monthly retainer).",
  },
  {
    question: "How much does it cost to hire HunterMussel?",
    answer:
      "It depends on scope. Fixed-scope projects start at $1,500 USD. Monthly retainers for DevOps and automation range from $900 to $3,500 USD depending on complexity and dedicated hours. We run a free diagnostic before any proposal.",
  },
  {
    question: "Do you work on fixed-scope projects or monthly retainers?",
    answer:
      "Both. Fixed-scope for defined deliverables like CI/CD implementation, infrastructure migration, or AI agent setup. Monthly retainer for teams that need ongoing DevOps support, automation evolution, and continuous delivery improvement.",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "AWS, GCP, Docker, Kubernetes, Terraform, GitHub Actions, Python, Go, Node.js, React, OpenAI, LangChain, n8n, Zapier — among others. Stack decisions are driven by what fits the project best, not by arbitrary preference.",
  },
  {
    question: "Do you work with generative AI?",
    answer:
      "Yes. We build autonomous agents, LLM-orchestrated workflows, and AI integrations into existing systems. We work with OpenAI, LangChain, RAG pipelines, and LLMOps practices for production environments.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes, always. Confidentiality agreements are standard before any technical scoping conversation.",
  },
];

export const serviceFAQ: Record<string, FAQItem[]> = {
  "ci-cd-devops": [
    {
      question: "When does it make sense to outsource DevOps?",
      answer:
        "When your product team is spending more time maintaining infrastructure than shipping features. Teams under 15 engineers rarely justify a full-time senior DevOps hire. Outsourcing delivers the same capability at lower cost and without turnover risk.",
    },
    {
      question: "How long does it take to implement a CI/CD pipeline?",
      answer:
        "For an application with a defined stack, a basic pipeline (build, test, deploy) is up in 1–2 weeks. Complex environments with multiple services, staging, and production typically take 3–6 weeks depending on existing technical debt.",
    },
    {
      question: "Which CI/CD tools do you work with?",
      answer:
        "GitHub Actions, GitLab CI, CircleCI, and AWS CodePipeline. The choice depends on what your team already uses and the cost-benefit for your specific context.",
    },
    {
      question: "What does 'infrastructure as code' actually mean for our team?",
      answer:
        "It means your infrastructure — servers, databases, networking, permissions — is defined in version-controlled code (Terraform, Pulumi) instead of manual clicks. This gives you reproducibility, audit trails, and the ability to spin up identical environments for dev, staging, and production.",
    },
    {
      question: "Is it more cost-effective to outsource DevOps or hire internally?",
      answer:
        "For teams under 20 engineers, outsourcing typically delivers the same output at 40–60% lower cost, with no hiring risk, no turnover, and immediate access to senior-level expertise across multiple stacks. Internal hires make more sense once DevOps demand is consistent and high-volume.",
    },
  ],
  "cloud-infrastructure-ai": [
    {
      question: "Which cloud do you recommend for startups?",
      answer:
        "AWS for most cases — it has the most mature managed services and the best startup credit programs (AWS Activate). GCP makes sense when there's heavy use of BigQuery or Vertex AI. We evaluate each case to avoid unnecessary vendor lock-in.",
    },
    {
      question: "How do you reduce AWS costs without hurting performance?",
      answer:
        "The main levers are EC2/RDS rightsizing, Spot Instances for interruption-tolerant workloads, data transfer review, and eliminating idle resources. A 2-week audit typically identifies 20–40% in savings.",
    },
    {
      question: "What is LLMOps and why does it matter?",
      answer:
        "LLMOps is the set of practices for running LLMs reliably in production: prompt versioning, response observability, token cost control, and fallback strategies. Without it, AI systems become black boxes in production that are expensive to debug and maintain.",
    },
    {
      question: "How do we choose between AWS, GCP, and Azure?",
      answer:
        "AWS has the most mature ecosystem and the best startup credit programs. GCP stands out for ML/AI workloads with Vertex AI and BigQuery. Azure makes sense when there's deep integration with Microsoft 365 or enterprise clients in the MS ecosystem. For most startups, AWS is the safe starting point.",
    },
    {
      question: "What is Infrastructure as Code and why should we use it?",
      answer:
        "IaC means defining and provisioning infrastructure through code (Terraform, Pulumi, CloudFormation) instead of manual configuration. This gives you reproducibility, version control, reduced human error, and the ability to create identical environments for dev, staging, and production.",
    },
  ],
  "intelligent-automation": [
    {
      question: "What is an AI Agent and how is it different from a chatbot?",
      answer:
        "A chatbot answers questions. An AI Agent executes tasks: it accesses systems, makes context-based decisions, calls APIs, processes documents, and acts autonomously within defined boundaries. The difference is between a response and an action.",
    },
    {
      question: "Which processes have the best ROI for AI automation?",
      answer:
        "The highest-impact ones are: ticket triage and routing, document data extraction (contracts, invoices), lead qualification, operational report generation, and intelligent monitoring with smart alerts.",
    },
    {
      question: "How do you make sure the agent won't make wrong decisions?",
      answer:
        "We define explicit guardrails upfront. The agent operates within defined scopes, critical actions go through human approval, and every decision is fully logged for auditing. The autonomy level is calibrated by the client.",
    },
    {
      question: "How do we start using AI in our engineering process?",
      answer:
        "The path of least resistance is automating repetitive tasks: issue triage, release notes generation, AI-assisted code review, and smart alerts. This creates immediate value without requiring a full process redesign.",
    },
    {
      question: "What is RAG and when should we use it?",
      answer:
        "RAG (Retrieval-Augmented Generation) connects an LLM to a specific knowledge base, enabling responses grounded in your company's internal documents rather than just model training. It's ideal for internal chatbots, documentation search, and support assistants.",
    },
  ],
  "security-compliance": [
    {
      question: "What is a security audit and when should we get one?",
      answer:
        "A security audit is a systematic technical review of code, infrastructure, and configurations to identify vulnerabilities before they're exploited. It's most valuable before major launches, after rapid team growth, or whenever sensitive user data is involved.",
    },
    {
      question: "Do you help with LGPD and GDPR compliance?",
      answer:
        "Yes. We map data flows, implement technical controls (encryption, anonymization, access logging), review policies, and prepare infrastructure to meet LGPD requirements for Brazilian operations and GDPR for international ones.",
    },
    {
      question: "What does DevSecOps mean in practice?",
      answer:
        "DevSecOps integrates security checks directly into the CI/CD pipeline: static analysis, dependency scanning, container image scanning, and secret detection run automatically on every commit. Security becomes a continuous process, not a gate at the end.",
    },
    {
      question: "Do you sign NDAs before discussing security details?",
      answer:
        "Yes, always. Confidentiality agreements are standard before any technical scoping conversation, and especially before security reviews that involve sensitive system access.",
    },
  ],
  "ai-process-management": [
    {
      question: "What is AI Process Management?",
      answer:
        "AI Process Management uses machine learning and automation to optimize, monitor, and continuously improve business processes. Unlike traditional BPM, it adapts in real time based on data patterns rather than fixed rules.",
    },
    {
      question: "How does AI Process Management differ from simple automation?",
      answer:
        "Simple automation follows fixed rules. AI Process Management learns from outcomes, identifies bottlenecks autonomously, and proposes or applies optimizations. The system gets smarter with more data.",
    },
    {
      question: "Which processes are best suited for AI Process Management?",
      answer:
        "High-volume repetitive processes with clear success metrics: approval workflows, document routing, SLA monitoring, resource scheduling, and quality control pipelines. Any process that generates data is a candidate.",
    },
    {
      question: "How long does it take to see ROI from AI process improvements?",
      answer:
        "For well-defined processes, measurable improvement (speed, error rate, cost) typically appears within 4–8 weeks of deployment. Full ROI realization depends on process complexity and volume.",
    },
  ],
  "workflows-bpm": [
    {
      question: "What is BPM and when do you need it?",
      answer:
        "Business Process Management (BPM) is the discipline of systematically designing, executing, monitoring, and optimizing business processes. You need it when processes involve multiple teams, are prone to bottlenecks, or lack visibility and accountability.",
    },
    {
      question: "How do workflows integrate with existing systems?",
      answer:
        "We use API-first integration patterns. If your system has a REST API or webhook support, it can be connected. For systems without APIs, we use RPA as an intermediary layer to bridge the gap.",
    },
    {
      question: "What tools do you use to build workflows?",
      answer:
        "n8n, Zapier, and custom-built orchestration depending on complexity and control requirements. For enterprise-grade flows with complex branching, we build custom solutions on top of workflow engines like Temporal or Prefect.",
    },
    {
      question: "Can workflows run without human intervention?",
      answer:
        "Yes. Fully automated workflows run 24/7 without human touch. We also support hybrid models where automation handles the routine steps and humans are looped in only for decisions that require judgment.",
    },
  ],
};

export const caseFAQ: FAQItem[] = [
  {
    question: "Does this type of solution work for my industry?",
    answer:
      "The technical patterns behind CI/CD, automation, and cloud infrastructure are industry-agnostic. The difference is compliance context and specific integrations, not the engineering approach. We've delivered projects across SaaS, logistics, education, healthcare, and security.",
  },
  {
    question: "How long did this project take?",
    answer:
      "Infrastructure and CI/CD projects typically take 3–8 weeks. AI automation engagements range from 2 weeks to 3 months depending on workflow complexity and the number of system integrations required.",
  },
  {
    question: "Do you provide support after delivery?",
    answer:
      "Yes. We offer ongoing support and evolution through monthly retainers. Many clients move to a retainer after the initial project to keep the solution growing.",
  },
  {
    question: "How do you measure results after delivery?",
    answer:
      "We define technical KPIs at the start of every engagement: deploy frequency, lead time for changes, MTTR, uptime, and infrastructure cost. We deliver a baseline vs. outcome report at project close.",
  },
  {
    question: "What if we already have legacy infrastructure? Do we need to rebuild everything?",
    answer:
      "No. We start from where you are. The approach is incremental — we identify the biggest bottlenecks, prioritize by ROI, and evolve infrastructure without tearing down what already works. Big bang migrations rarely make sense.",
  },
  {
    question: "Which systems can you integrate into an AI Agent?",
    answer:
      "Any system with a REST API or webhook. We've integrated Notion, Slack, HubSpot, Salesforce, Google Workspace, legacy systems via API gateway, and SQL/NoSQL databases. For systems without an API, we use RPA as an intermediary layer.",
  },
];

export const blogDevOpsFAQ: FAQItem[] = [
  {
    question: "What is DevOps as a Service?",
    answer:
      "A model where a company outsources its entire DevOps operation to an external specialized team: pipelines, infrastructure, monitoring, and automation. It eliminates the need to hire and retain an internal team while maintaining the same technical level.",
  },
  {
    question: "What is the difference between a DevOps Engineer and an SRE?",
    answer:
      "DevOps Engineers focus on automating the software delivery cycle (CI/CD, infrastructure as code). SREs (Site Reliability Engineers) focus on system reliability and availability in production. In practice, the roles overlap in small teams.",
  },
  {
    question: "What metrics should we use to measure DevOps maturity?",
    answer:
      "DORA metrics are the industry standard: deployment frequency, lead time for changes, change failure rate, and MTTR. Elite teams deploy multiple times per day with MTTR under one hour. These are a solid benchmark for any team.",
  },
  {
    question: "How long does it take to implement a CI/CD pipeline?",
    answer:
      "For an application with a defined stack, a basic pipeline (build, test, deploy) is up in 1–2 weeks. Complex environments with multiple services, staging, and production typically take 3–6 weeks depending on existing technical debt.",
  },
];

export const blogAIFAQ: FAQItem[] = [
  {
    question: "How do we start using AI in our engineering process?",
    answer:
      "The path of least resistance is automating repetitive tasks: issue triage, release notes generation, AI-assisted code review, and smart alerts. This creates immediate value without requiring a full process redesign.",
  },
  {
    question: "What is RAG and when should we use it?",
    answer:
      "RAG (Retrieval-Augmented Generation) connects an LLM to a specific knowledge base, enabling responses grounded in your company's internal documents rather than just model training. It's ideal for internal chatbots, documentation search, and support assistants.",
  },
  {
    question: "How much does it cost to run LLMs in production?",
    answer:
      "It depends on the model and volume. GPT-4o costs approximately $2.50 per 1M input tokens. For high volumes, open-source models (Llama, Mistral) running on your own infrastructure can reduce costs by up to 80%, but require more engineering investment. The right choice depends on the cost-latency-quality tradeoff.",
  },
  {
    question: "What is an AI Agent and how is it different from a chatbot?",
    answer:
      "A chatbot answers questions. An AI Agent executes tasks: it accesses systems, makes context-based decisions, calls APIs, processes documents, and acts autonomously within defined boundaries. The difference is between a response and an action.",
  },
];

export const blogCloudFAQ: FAQItem[] = [
  {
    question: "How do we choose between AWS, GCP, and Azure for a startup?",
    answer:
      "AWS has the most mature ecosystem and the best startup credit programs. GCP stands out for ML/AI workloads with Vertex AI and BigQuery. Azure makes sense when there's deep integration with Microsoft 365 or enterprise clients in the MS ecosystem. For most startups, AWS is the safe starting point.",
  },
  {
    question: "What is Infrastructure as Code and why should we use it?",
    answer:
      "IaC means defining and provisioning infrastructure through code (Terraform, Pulumi, CloudFormation) instead of manual configuration. This gives you reproducibility, version control, reduced human error, and the ability to create identical environments for dev, staging, and production.",
  },
  {
    question: "How do you reduce AWS costs without hurting performance?",
    answer:
      "The main levers are EC2/RDS rightsizing, Spot Instances for interruption-tolerant workloads, data transfer review, and eliminating idle resources. A 2-week audit typically identifies 20–40% in savings.",
  },
  {
    question: "Which cloud do you recommend for startups?",
    answer:
      "AWS for most cases — it has the most mature managed services and the best startup credit programs (AWS Activate). GCP makes sense when there's heavy use of BigQuery or Vertex AI. We evaluate each case to avoid unnecessary vendor lock-in.",
  },
];

export const blogGeneralFAQ: FAQItem[] = [
  {
    question: "What is HunterMussel?",
    answer:
      "HunterMussel is a software house specializing in DevOps, AI automation, and scalable software engineering. We help teams that need reliable delivery, robust cloud infrastructure, and AI integrated into real operational systems — not just demos.",
  },
  {
    question: "How does a new project start?",
    answer:
      "We begin with a free diagnostic session to understand your technical context, current bottlenecks, and goals. From there, we deliver a proposal with scope, timeline, and engagement model (fixed-scope project or monthly retainer).",
  },
  {
    question: "Is it more cost-effective to outsource DevOps or hire internally?",
    answer:
      "For teams under 20 engineers, outsourcing typically delivers the same output at 40–60% lower cost, with no hiring risk, no turnover, and immediate access to senior-level expertise across multiple stacks. Internal hires make more sense once DevOps demand is consistent and high-volume.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We operate in GMT-3 and collaborate in real time with teams in the US, Europe, and Latin America. All documentation and communication for international projects is delivered in English.",
  },
];
