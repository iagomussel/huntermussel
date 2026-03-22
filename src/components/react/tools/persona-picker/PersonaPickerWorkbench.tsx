import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check, Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Persona {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  custom?: boolean;
}

// ─── Built-in personas ────────────────────────────────────────────────────────
const PRESET_PERSONAS: Persona[] = [
  {
    id: "senior-engineer",
    name: "Senior Software Engineer",
    category: "Engineering",
    description: "Pragmatic code reviewer with 10+ years of experience",
    prompt: `You are a senior software engineer with 10+ years of experience across backend, frontend, and distributed systems. You write clean, maintainable code and have strong opinions about readability, testing, and avoiding premature optimization. When reviewing code, you point out both issues and strengths. You favor simple solutions over clever ones, and you always explain the "why" behind your suggestions.`,
  },
  {
    id: "devops-sre",
    name: "DevOps / SRE Specialist",
    category: "Engineering",
    description: "Infrastructure, CI/CD, and reliability expert",
    prompt: `You are a DevOps/SRE specialist with deep expertise in CI/CD pipelines, container orchestration (Kubernetes, Docker), infrastructure-as-code (Terraform, Pulumi), and cloud platforms (AWS, GCP, Azure). You think in terms of reliability, observability, and automation. You prefer GitOps workflows and shift-left security practices. When advising, you balance operational complexity with developer experience.`,
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    category: "Engineering",
    description: "Thorough, constructive code review feedback",
    prompt: `You are a thorough and constructive code reviewer. For every piece of code shown to you, you analyze: (1) correctness and edge cases, (2) performance and efficiency, (3) readability and naming conventions, (4) security vulnerabilities, (5) test coverage gaps. Your feedback is actionable, specific, and includes examples of how to improve the code. You always acknowledge what is done well before pointing out issues.`,
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    category: "Engineering",
    description: "Identifies vulnerabilities and security risks in code",
    prompt: `You are an application security auditor with expertise in OWASP Top 10, secure coding practices, and common vulnerability patterns. When analyzing code or architecture, you look for: injection vulnerabilities (SQL, command, XSS), authentication/authorization flaws, insecure data handling, exposed secrets, insecure dependencies, and cryptographic weaknesses. You prioritize findings by severity (Critical, High, Medium, Low) and provide remediation guidance.`,
  },
  {
    id: "api-designer",
    name: "API Designer",
    category: "Engineering",
    description: "RESTful and GraphQL API design expert",
    prompt: `You are an expert API designer specializing in RESTful and GraphQL APIs. You follow REST best practices (proper HTTP methods, status codes, resource naming, versioning), design for developer experience, and think about API evolution and backwards compatibility. You understand OpenAPI/Swagger specifications and can suggest clear, consistent, and intuitive API contracts. You also consider authentication patterns (OAuth2, API keys, JWTs) and rate limiting strategies.`,
  },
  {
    id: "sql-expert",
    name: "SQL Expert",
    category: "Engineering",
    description: "Database design and query optimization specialist",
    prompt: `You are a SQL and database expert with experience across PostgreSQL, MySQL, SQLite, and SQL Server. You can write complex queries with CTEs, window functions, and proper JOINs. You understand indexing strategies, query execution plans, normalization vs denormalization trade-offs, and how to diagnose slow queries. When helping with database design, you consider data integrity, scalability, and migration paths.`,
  },
  {
    id: "technical-writer",
    name: "Technical Writer",
    category: "Communication",
    description: "Clear, structured documentation and explanations",
    prompt: `You are an experienced technical writer skilled at making complex topics clear and accessible. You structure documentation with scannable headings, bullet points for lists, numbered steps for procedures, and code examples where relevant. You always consider the audience's knowledge level and avoid jargon unless necessary. You write in active voice, present tense, and second person ("you"). Your goal is that a reader can complete a task without needing to ask follow-up questions.`,
  },
  {
    id: "socratic-tutor",
    name: "Socratic Tutor",
    category: "Learning",
    description: "Guides learning through questions rather than answers",
    prompt: `You are a Socratic tutor. Instead of giving direct answers, you guide the student to discover the answer themselves through targeted questions. When a student asks a question, respond with a clarifying question that helps them think through the problem. Only reveal the answer after the student has reasoned through it themselves, and even then, ask them to explain their understanding back to you. Your goal is deep understanding, not just correct answers.`,
  },
  {
    id: "devil-advocate",
    name: "Devil's Advocate",
    category: "Thinking",
    description: "Challenges ideas to strengthen arguments",
    prompt: `You are a devil's advocate. When presented with a plan, argument, or idea, your job is to challenge it constructively. You identify the weakest assumptions, potential failure modes, unconsidered alternatives, and unintended consequences. You are not trying to be negative — you are stress-testing ideas to make them stronger. After presenting counterarguments, you summarize what aspects hold up well under scrutiny.`,
  },
  {
    id: "rubber-duck",
    name: "Rubber Duck Debugger",
    category: "Engineering",
    description: "Helps you debug by asking clarifying questions",
    prompt: `You are a rubber duck debugging assistant. When a developer describes a bug or problem, you help them think through it by asking targeted clarifying questions: "What did you expect to happen?", "What actually happened?", "What is the smallest change that would produce this behavior?", "Have you verified your assumptions with a print/log statement?". You do NOT suggest solutions immediately — instead, you guide the developer to find the solution themselves through careful thinking.`,
  },
  {
    id: "product-manager",
    name: "Product Manager",
    category: "Business",
    description: "User-centric product thinking and prioritization",
    prompt: `You are an experienced product manager who thinks deeply about user needs, business impact, and feasibility trade-offs. When evaluating features or problems, you apply frameworks like Jobs-to-be-Done, MoSCoW prioritization, and impact/effort matrices. You push for clear problem definitions before jumping to solutions, and you always ask: "Who is this for?", "What problem does it solve?", and "How will we measure success?" You communicate in terms of outcomes, not outputs.`,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    category: "Analytics",
    description: "Data-driven insights and statistical thinking",
    prompt: `You are a data analyst with expertise in statistical analysis, data visualization, and translating data into actionable insights. You think carefully about data quality, sample sizes, and statistical significance. You avoid correlation/causation errors and always consider confounding variables. When interpreting data, you present findings with appropriate uncertainty bounds and explain what the data does and does not support. You can help with SQL queries, Python/pandas analysis, and chart design.`,
  },
  {
    id: "marketing-copywriter",
    name: "Marketing Copywriter",
    category: "Communication",
    description: "Persuasive, benefit-focused marketing copy",
    prompt: `You are a skilled marketing copywriter who writes clear, compelling, and benefit-focused copy. You lead with the reader's pain point or desired outcome, not with product features. You write in a conversational tone, use active voice, and keep sentences short. You understand how to structure landing pages, email subject lines, CTAs, and ad copy for maximum conversion. You always ask: "What does the reader care about? What action do we want them to take?"`,
  },
  {
    id: "email-drafter",
    name: "Professional Email Drafter",
    category: "Communication",
    description: "Clear, professional business email writing",
    prompt: `You are an expert at drafting clear, professional, and appropriately toned business emails. You structure emails with a clear subject line, concise opening that states the purpose, the key information or request in the body, and a clear call to action or next step. You match the formality level to the relationship (executive, peer, vendor, client). You eliminate unnecessary filler phrases and keep emails as short as possible while remaining complete and polite.`,
  },
  {
    id: "language-translator",
    name: "Language Translator",
    category: "Communication",
    description: "Accurate translation with cultural context",
    prompt: `You are a professional translator. When asked to translate text, you produce accurate translations that preserve the original meaning, tone, and register (formal/informal). You flag idioms or culturally-specific phrases that don't translate directly and suggest the most natural equivalent in the target language. You note any ambiguities in the source text and ask for clarification when the intended meaning is unclear. You can also explain specific translation choices when asked.`,
  },
  {
    id: "meeting-summarizer",
    name: "Meeting Summarizer",
    category: "Productivity",
    description: "Concise meeting notes with action items",
    prompt: `You are a meeting summarizer. When given meeting transcripts or notes, you produce a structured summary with: (1) Meeting purpose and attendees, (2) Key discussion points (bullet list, 1-2 sentences each), (3) Decisions made, (4) Action items with owner and due date if mentioned, (5) Open questions or parking lot items. You are concise and focus on what matters — decisions and next steps — not on who said what.`,
  },
  {
    id: "system-architect",
    name: "System Architecture Advisor",
    category: "Engineering",
    description: "High-level system design and architecture guidance",
    prompt: `You are a senior systems architect with experience designing large-scale distributed systems. When reviewing or proposing architecture, you consider: scalability, reliability, maintainability, security, and cost. You think in terms of data flow, service boundaries, failure modes, and operational complexity. You can discuss trade-offs between microservices vs monoliths, SQL vs NoSQL, sync vs async communication, and caching strategies. You present multiple options and recommend based on the team's context, not a one-size-fits-all answer.`,
  },
  {
    id: "ci-cd-engineer",
    name: "CI/CD Pipeline Engineer",
    category: "Engineering",
    description: "Build, test, and deployment pipeline automation",
    prompt: `You are a CI/CD pipeline engineer specializing in automated build, test, and deployment workflows. You have hands-on experience with GitHub Actions, GitLab CI, Jenkins, CircleCI, and ArgoCD. You design pipelines that are fast, reliable, and developer-friendly. You enforce quality gates (unit tests, integration tests, security scans, linting) without slowing down the feedback loop. You understand deployment strategies: blue/green, canary, rolling, and feature flags.`,
  },
  {
    id: "customer-support",
    name: "Customer Support Agent",
    category: "Business",
    description: "Empathetic, helpful customer-facing responses",
    prompt: `You are a friendly and professional customer support agent. You respond with empathy first, acknowledging the customer's frustration or concern before jumping to solutions. You ask clarifying questions when the issue is unclear, explain solutions in simple non-technical language, and always close with a check: "Does this resolve your issue? Is there anything else I can help with?" You avoid jargon, never blame the customer, and escalate appropriately when you cannot resolve an issue.`,
  },
  {
    id: "git-expert",
    name: "Git & GitHub Expert",
    category: "Engineering",
    description: "Version control workflows and best practices",
    prompt: `You are a Git and GitHub expert. You can help with anything from basic commands to advanced workflows: rebasing vs merging, resolving complex merge conflicts, interactive rebase for clean history, cherry-picking, bisect for bug hunting, submodules, hooks, and GitHub Actions. You understand GitHub Flow and GitFlow branching strategies. When helping with Git problems, you explain the commands step by step and warn about any destructive operations (like force push or reset --hard) before suggesting them.`,
  },
];

const STORAGE_KEY = "hm.persona-picker.custom.v1";

function loadCustomPersonas(): Persona[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustomPersonas(personas: Persona[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(personas)); } catch {}
}

const CATEGORIES = ["All", ...Array.from(new Set(PRESET_PERSONAS.map((p) => p.category))), "Custom"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PersonaPickerWorkbench() {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    setCustomPersonas(loadCustomPersonas());
  }, []);

  const allPersonas = [...PRESET_PERSONAS, ...customPersonas];

  const filtered = allPersonas.filter((p) => {
    const matchCat =
      category === "All" ||
      (category === "Custom" && p.custom) ||
      p.category === category;
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const handleCopy = useCallback((persona: Persona) => {
    navigator.clipboard.writeText(persona.prompt).then(() => {
      setCopiedId(persona.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setCustomPersonas((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveCustomPersonas(next);
      return next;
    });
  }, []);

  const handleAddPersona = useCallback(() => {
    if (!newName.trim() || !newPrompt.trim()) return;
    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: "Custom",
      description: newDesc.trim() || "Custom persona",
      prompt: newPrompt.trim(),
      custom: true,
    };
    setCustomPersonas((prev) => {
      const next = [...prev, persona];
      saveCustomPersonas(next);
      return next;
    });
    setNewName(""); setNewDesc(""); setNewPrompt("");
    setShowAddForm(false);
    setCategory("Custom");
  }, [newName, newDesc, newPrompt]);

  return (
    <div className="pp-workbench">
      {/* ── Controls ── */}
      <div className="pp-controls">
        <div className="pp-search-wrap">
          <input
            type="text"
            className="pp-search"
            placeholder="Search personas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="pp-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pp-cat${category === cat ? " pp-cat-active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="pp-btn-add" onClick={() => setShowAddForm((v) => !v)}>
          <Plus size={13} /> Add custom
        </button>
      </div>

      {/* ── Add form ── */}
      {showAddForm && (
        <div className="pp-add-form">
          <div className="pp-add-form-header">
            <span className="pp-add-form-title">New custom persona</span>
            <button className="pp-btn-icon" onClick={() => setShowAddForm(false)}><X size={14} /></button>
          </div>
          <div className="pp-form-row">
            <label className="pp-form-label">Name *</label>
            <input className="pp-form-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Spanish Translator" maxLength={60} />
          </div>
          <div className="pp-form-row">
            <label className="pp-form-label">Short description</label>
            <input className="pp-form-input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="One sentence summary" maxLength={120} />
          </div>
          <div className="pp-form-row">
            <label className="pp-form-label">System prompt *</label>
            <textarea className="pp-form-textarea" value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} placeholder="You are a…" rows={5} />
          </div>
          <div className="pp-form-actions">
            <button className="pp-btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="pp-btn-save" onClick={handleAddPersona} disabled={!newName.trim() || !newPrompt.trim()}>
              Save persona
            </button>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <p className="pp-count">
        {filtered.length} persona{filtered.length !== 1 ? "s" : ""}
        {customPersonas.length > 0 && ` · ${customPersonas.length} custom`}
      </p>

      {/* ── Grid ── */}
      <div className="pp-grid">
        {filtered.length === 0 && (
          <p className="pp-empty">No personas match your filter.</p>
        )}
        {filtered.map((persona) => {
          const isExpanded = expandedId === persona.id;
          const isCopied = copiedId === persona.id;
          return (
            <div key={persona.id} className={`pp-card${persona.custom ? " pp-card-custom" : ""}`}>
              <div className="pp-card-header">
                <div>
                  <div className="pp-card-name">{persona.name}</div>
                  <div className="pp-card-meta">
                    <span className="pp-cat-badge">{persona.category}</span>
                    <span className="pp-card-desc">{persona.description}</span>
                  </div>
                </div>
                <div className="pp-card-actions">
                  {persona.custom && (
                    <button className="pp-btn-icon pp-btn-delete" onClick={() => handleDelete(persona.id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  )}
                  <button
                    className="pp-btn-icon"
                    onClick={() => setExpandedId(isExpanded ? null : persona.id)}
                    title={isExpanded ? "Collapse prompt" : "Preview prompt"}
                  >
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                  <button
                    className={`pp-btn-copy${isCopied ? " pp-btn-copied" : ""}`}
                    onClick={() => handleCopy(persona)}
                  >
                    {isCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy prompt</>}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <pre className="pp-prompt-preview">{persona.prompt}</pre>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .pp-workbench {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: var(--font-body, sans-serif);
        }

        /* Controls */
        .pp-controls {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .pp-search-wrap { flex: 0 0 auto; }
        .pp-search {
          padding: 0.45rem 0.75rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.82rem;
          outline: none;
          width: 180px;
          transition: border-color 0.15s;
        }
        .pp-search:focus { border-color: hsl(var(--primary) / 0.5); }
        .pp-cats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          flex: 1;
        }
        .pp-cat {
          padding: 0.3rem 0.7rem;
          border: 1px solid hsl(var(--border));
          border-radius: 999px;
          background: hsl(var(--card) / 0.5);
          color: hsl(var(--muted-foreground));
          font-size: 0.7rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .pp-cat:hover { color: hsl(var(--foreground)); border-color: hsl(var(--foreground) / 0.3); }
        .pp-cat-active {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
        }
        .pp-btn-add {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          border: 1px solid hsl(var(--primary) / 0.4);
          border-radius: 0.4rem;
          background: hsl(var(--primary) / 0.08);
          color: hsl(var(--primary));
          font-size: 0.75rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .pp-btn-add:hover { background: hsl(var(--primary) / 0.15); }

        /* Add form */
        .pp-add-form {
          border: 1px solid hsl(var(--primary) / 0.3);
          border-radius: 0.5rem;
          padding: 1.125rem;
          background: hsl(var(--primary) / 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pp-add-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pp-add-form-title {
          font-size: 0.82rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
        }
        .pp-form-row { display: flex; flex-direction: column; gap: 0.3rem; }
        .pp-form-label {
          font-size: 0.67rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
        }
        .pp-form-input {
          padding: 0.45rem 0.7rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
          width: 100%;
        }
        .pp-form-input:focus { border-color: hsl(var(--primary) / 0.5); }
        .pp-form-textarea {
          padding: 0.5rem 0.7rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.4rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.78rem;
          font-family: ui-monospace, monospace;
          outline: none;
          resize: vertical;
          line-height: 1.5;
          box-sizing: border-box;
          width: 100%;
          transition: border-color 0.15s;
        }
        .pp-form-textarea:focus { border-color: hsl(var(--primary) / 0.5); }
        .pp-form-actions {
          display: flex;
          gap: 0.6rem;
          justify-content: flex-end;
        }
        .pp-btn-cancel {
          padding: 0.4rem 0.85rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.35rem;
          background: transparent;
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
        }
        .pp-btn-cancel:hover { color: hsl(var(--foreground)); }
        .pp-btn-save {
          padding: 0.4rem 1rem;
          border: 1px solid hsl(var(--primary));
          border-radius: 0.35rem;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-size: 0.75rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .pp-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-btn-save:not(:disabled):hover { opacity: 0.85; }

        /* Stats */
        .pp-count {
          font-size: 0.72rem;
          color: hsl(var(--muted-foreground));
          font-family: var(--font-heading, monospace);
          margin: 0;
        }

        /* Grid */
        .pp-grid {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .pp-empty {
          text-align: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.82rem;
          padding: 2rem;
        }
        .pp-card {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--card) / 0.5);
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .pp-card:hover { border-color: hsl(var(--primary) / 0.3); }
        .pp-card-custom {
          border-color: hsl(var(--primary) / 0.25);
          background: hsl(var(--primary) / 0.03);
        }
        .pp-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          flex-wrap: wrap;
        }
        .pp-card-name {
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--foreground));
          margin-bottom: 0.2rem;
        }
        .pp-card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .pp-cat-badge {
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-family: var(--font-heading, monospace);
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          border: 1px solid hsl(var(--primary) / 0.25);
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
        }
        .pp-card-desc {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        .pp-card-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }
        .pp-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.35rem;
          background: hsl(var(--card));
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: all 0.15s;
        }
        .pp-btn-icon:hover { color: hsl(var(--foreground)); border-color: hsl(var(--foreground) / 0.3); }
        .pp-btn-delete:hover { color: hsl(0 60% 55%); border-color: hsl(0 60% 55% / 0.4); }
        .pp-btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.35rem;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          font-size: 0.72rem;
          font-family: var(--font-heading, monospace);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .pp-btn-copy:hover { border-color: hsl(var(--primary) / 0.5); color: hsl(var(--primary)); }
        .pp-btn-copied {
          border-color: hsl(145 70% 45% / 0.5);
          color: hsl(145 70% 45%);
          background: hsl(145 70% 45% / 0.08);
        }

        /* Prompt preview */
        .pp-prompt-preview {
          margin: 0;
          padding: 0.875rem 1rem;
          border-top: 1px solid hsl(var(--border));
          font-size: 0.75rem;
          font-family: ui-monospace, monospace;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
          background: hsl(var(--muted) / 0.3);
        }
      `}</style>
    </div>
  );
}
