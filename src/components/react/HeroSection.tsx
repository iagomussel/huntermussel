import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal, ArrowRight, Crosshair, Fingerprint, LockKeyhole, Radio, ScanLine } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useLang } from "@/context/LangContext";
import { heroT } from "@/data/translations";

const ease = [0.25, 0.1, 0.25, 1] as const;

const CyberMissionConsole = ({ reduced }: { reduced?: boolean }) => {
  const lang = useLang();
  const [stage, setStage] = useState(0);
  const [seconds, setSeconds] = useState(147);
  const complete = stage === 3;
  const copy = lang === "pt"
    ? {
        caseId: "CASO #HM-041", objective: "Objetivo: localizar a falha antes que ela escale.",
        stages: ["Mapear superfície", "Isolar sinal", "Validar evidência"],
        action: "ANALISAR EVIDÊNCIA", next: "PRÓXIMA PISTA", secured: "Cadeia de custódia assegurada",
        waiting: "Aguardando análise", found: "EVIDÊNCIA ENCONTRADA", trace: "RASTRO ATIVO",
      }
    : {
        caseId: "CASE #HM-041", objective: "Objective: locate the failure before it escalates.",
        stages: ["Map attack surface", "Isolate signal", "Validate evidence"],
        action: "ANALYZE EVIDENCE", next: "NEXT CLUE", secured: "Chain of custody secured",
        waiting: "Awaiting analysis", found: "EVIDENCE FOUND", trace: "LIVE TRACE",
      };

  useEffect(() => {
    if (reduced || complete) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [complete, reduced]);

  const advance = () => setStage((current) => Math.min(3, current + 1));
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <motion.aside
      initial={reduced ? false : { opacity: 0, y: 20, rotateX: -8 }}
      animate={reduced ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: 0.42, ease }}
      className="relative mx-auto mt-14 max-w-3xl overflow-hidden border border-primary/30 bg-[#07110f]/90 text-left font-heading shadow-[0_0_0_1px_hsl(145_80%_50%/0.06),0_24px_80px_hsl(145_80%_18%/0.18)] backdrop-blur-md"
    >
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(hsl(145_80%_50%/.28)_1px,transparent_1px),linear-gradient(90deg,hsl(145_80%_50%/.28)_1px,transparent_1px)] [background-size:24px_24px]" />
      {!reduced && <div className="absolute inset-x-0 top-0 h-px bg-primary shadow-[0_0_14px_3px_hsl(145_80%_50%)] animate-[scan_3.5s_linear_infinite]" />}
      <div className="relative flex items-center justify-between border-b border-primary/20 px-4 py-3 text-[10px] tracking-[0.16em] text-primary/80 sm:px-5">
        <span className="flex items-center gap-2"><Fingerprint size={13} /> {copy.caseId}</span>
        <span className="flex items-center gap-2 text-amber-300"><Radio size={12} className={!reduced ? "animate-pulse" : ""} /> {copy.trace} · {time}</span>
      </div>
      <div className="relative grid gap-5 p-4 sm:grid-cols-[1.2fr_.8fr] sm:p-5">
        <div>
          <p className="mb-4 text-xs leading-relaxed text-emerald-100/70">{copy.objective}</p>
          <div className="space-y-2">
            {copy.stages.map((label, index) => {
              const resolved = stage > index;
              const active = stage === index;
              return <div key={label} className={`flex items-center gap-3 border px-3 py-2.5 text-[11px] tracking-[0.08em] transition-colors ${resolved ? "border-primary/40 bg-primary/10 text-primary" : active ? "border-amber-300/60 bg-amber-300/10 text-amber-200" : "border-white/10 text-white/30"}`}>
                <span className={`grid h-5 w-5 place-items-center border text-[9px] ${resolved ? "border-primary bg-primary text-[#07110f]" : "border-current"}`}>{resolved ? "✓" : `0${index + 1}`}</span>
                {label}
                {active && <ScanLine size={13} className={!reduced ? "ml-auto animate-pulse" : "ml-auto"} />}
              </div>;
            })}
          </div>
          <button type="button" onClick={advance} disabled={complete} className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-[#07110f] transition hover:bg-primary/85 disabled:cursor-default disabled:border-primary/50 disabled:bg-primary/15 disabled:text-primary">
            {complete ? <LockKeyhole size={14} /> : <Crosshair size={14} />}
            {complete ? copy.secured : stage === 0 ? copy.action : copy.next}
          </button>
        </div>
        <div className="border border-white/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between text-[9px] tracking-[0.16em] text-white/45"><span>{copy.waiting}</span><span>{stage * 33 + 1}%</span></div>
          <div className="relative mx-auto grid aspect-square max-w-[170px] place-items-center overflow-hidden rounded-full border border-primary/25 bg-[radial-gradient(circle,hsl(145_80%_50%/.16)_0,transparent_55%)]">
            <div className={`absolute inset-[15%] rounded-full border border-dashed border-primary/40 ${!reduced ? "animate-[spin_9s_linear_infinite]" : ""}`} />
            <div className={`absolute inset-[32%] rounded-full border border-amber-300/50 ${!reduced ? "animate-pulse" : ""}`} />
            <span className="z-10 text-2xl font-bold text-primary">{stage}/3</span>
          </div>
          <p className={`mt-4 text-center text-[10px] tracking-[0.14em] ${complete ? "text-primary" : "text-white/45"}`}>{complete ? copy.found : "◌  ENCRYPTED ARTIFACT"}</p>
        </div>
      </div>
    </motion.aside>
  );
};

const HeroSection = () => {
  const T = heroT[useLang()];
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section
        data-analytics-section="hero"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        <div className="absolute inset-0 grid-bg opacity-10" />

        <div className="container relative z-10 px-6 py-32 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur-sm">
              <Terminal size={14} className="text-primary" />
              <span className="font-heading text-xs text-muted-foreground">{T.badge}</span>
            </div>
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              {T.h1a}
              <br />
              <span className="gradient-text text-glow">{T.h1b}</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
              {T.subtitle}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                data-analytics-event="lead_cta_click"
                data-analytics-label="start_project"
                data-analytics-location="hero_primary"
                data-analytics-destination="#contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
              >
                {T.cta1}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/cases/"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-8 py-3.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
              >
                {T.cta2}
              </a>
            </div>
          </div>
          <CyberMissionConsole reduced />
        </div>
      </section>
    );
  }

  return (
    <section
      data-analytics-section="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg.src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="container relative z-10 px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur-sm"
          >
            <Terminal size={14} className="text-primary" />
            <span className="font-heading text-xs text-muted-foreground">{T.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease }}
            className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            {T.h1a}
            <br />
            <span className="gradient-text text-glow">{T.h1b}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22, ease }}
            className="mx-auto mb-10 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {T.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28, ease }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#contact"
              data-analytics-event="lead_cta_click"
              data-analytics-label="start_project"
              data-analytics-location="hero_primary"
              data-analytics-destination="#contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
            >
              {T.cta1}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/cases/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-8 py-3.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
            >
              {T.cta2}
            </a>
          </motion.div>
        </motion.div>

        <CyberMissionConsole />
      </div>
    </section>
  );
};

export default HeroSection;
