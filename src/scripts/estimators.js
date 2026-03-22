  const $ = (id) => document.getElementById(id);
  const safeSetText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value ?? "";
  };
  const safeSetHTML = (id, value) => {
    const el = $(id);
    if (el) el.innerHTML = value ?? "";
  };
  const safeSetHidden = (id, hidden) => {
    const el = $(id);
    if (el) el.hidden = hidden;
  };
  const safeOn = (id, eventName, handler) => {
    const el = $(id);
    if (el) el.addEventListener(eventName, handler);
  };
  const safeValue = (id, fallback = "") => {
    const el = $(id);
    return el ? el.value : fallback;
  };
  const safeSetValue = (id, value) => {
    const el = $(id);
    if (el) el.value = String(value);
  };

  const WORKLOADS = {
    saas: {
      name: "SaaS Dashboard",
      description: "Users login, navigate pages, and perform actions.",
      stackPreset: "Stack preset: Next.js + Postgres",
      requestsPerUser: 180,
      payloadKb: 16,
      cpuMs: 42,
      statePressure: 0.55,
      staticFriendly: false,
      icon: "SD",
    },
    api: {
      name: "Public API",
      description: "External calls with integration bursts.",
      stackPreset: "Stack preset: Node API + Redis",
      requestsPerUser: 320,
      payloadKb: 9,
      cpuMs: 38,
      statePressure: 0.45,
      staticFriendly: false,
      icon: "AP",
    },
    ecommerce: {
      name: "E-commerce",
      description: "Read-heavy with critical checkout flow.",
      stackPreset: "Stack preset: Headless shop + managed DB",
      requestsPerUser: 240,
      payloadKb: 22,
      cpuMs: 56,
      statePressure: 0.82,
      staticFriendly: false,
      icon: "EC",
    },
    uploads: {
      name: "Uploads / Processing",
      description: "Files are uploaded and processed.",
      stackPreset: "Stack preset: API + workers + object storage",
      requestsPerUser: 120,
      payloadKb: 220,
      cpuMs: 95,
      statePressure: 0.92,
      staticFriendly: false,
      icon: "UP",
    },
    content: {
      name: "Static Blog (Jekyll/Hugo)",
      description: "Cache dominates and dynamic compute is near zero.",
      stackPreset: "Stack preset: Jekyll/Hugo + Pages/CDN",
      requestsPerUser: 150,
      payloadKb: 35,
      cpuMs: 22,
      statePressure: 0.2,
      staticFriendly: true,
      edgeCompatible: true,
      icon: "CB",
    },
    wordpress: {
      name: "WordPress Blog",
      description: "Dynamic CMS + plugins + database-backed rendering.",
      stackPreset: "Stack preset: WordPress + MySQL + CDN",
      requestsPerUser: 190,
      payloadKb: 42,
      cpuMs: 48,
      statePressure: 0.68,
      staticFriendly: false,
      edgeCompatible: false,
      icon: "WP",
    },
    chat: {
      name: "Chat / Realtime",
      description: "Many active sessions, messages, and state.",
      stackPreset: "Stack preset: Realtime gateway + state store",
      requestsPerUser: 480,
      payloadKb: 8,
      cpuMs: 34,
      statePressure: 1,
      staticFriendly: false,
      edgeCompatible: true,
      icon: "CH",
    },
  };

  const PEAK = {
    low: { label: "Low", multiplier: 3 },
    medium: { label: "Medium", multiplier: 6 },
    high: { label: "High", multiplier: 10 },
  };

  const DATA = {
    light: { label: "Light", payloadFactor: 0.7, egressFactor: 0.55 },
    normal: { label: "Normal", payloadFactor: 1, egressFactor: 0.8 },
    heavy: { label: "Heavy", payloadFactor: 2.4, egressFactor: 1.2 },
  };

  const LOG_FACTOR = {
    basic: 0.6,
    standard: 1,
    high: 1.8,
  };

  const PRIORITY_COST_FACTOR = {
    cost: { static: 1, edge: 1, aws: 1 },
    latency: { static: 1.22, edge: 1.08, aws: 1.34 },
    ops: { static: 1.06, edge: 1.14, aws: 1.2 },
  };

  const PRICE = {
    aws: {
      computeVcpuMonth: 31,
      computeMemGbMonth: 4,
      dbSmall: 110,
      dbMedium: 270,
      dbLarge: 620,
      dbLite: 45,
      egressGb: 0.09,
      natNetwork: 48,
      albBaseMonth: 22,
      albVarPerRps: 0.08,
      redisSmall: 25,
      redisMedium: 85,
      redisLarge: 220,
      storageGbMonth: 0.1,
      logGb: 0.5,
      monitorBase: 16,
      ciMinute: 0.008,
      fixedBase: 3,
    },
    edge: {
      reqPerMillion: 0.35,
      durationPerMillionMs: 0.00002,
      stateBase: 20,
      objectGbMonth: 0.02,
      egressGb: 0.015,
      logGb: 0.2,
      monitorBase: 8,
      ciMinute: 0.008,
      fixedBase: 2,
      platformBase: 8,
    },
    static: {
      hostingBase: 0,
      cdnEgressGb: 0.02,
      buildMinute: 0.008,
      monitorBase: 2,
      storageGbMonth: 0.023,
      fixedBase: 2,
    },
  };

  const state = {
    workload: "saas",
    mau: 20000,
    peak: "low",
    data: "light",
    priority: "cost",
    assumptions: {
      reqPerUserOverride: null,
      cacheHit: 60,
      durationMultiplier: 1,
      storageGrowthGb: 12,
      deploysPerMonth: 24,
      logsLevel: "basic",
    },
  };

  const setSegmentedState = (rootId, selectedValue) => {
    const root = $(rootId);
    if (!root) return;
    root.querySelectorAll("button[data-value]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.value === selectedValue);
    });
  };

  const syncPresetButtons = () => {
    const presetButtons = {
      conservative: $("scenarioConservative"),
      realistic: $("scenarioRealistic"),
      aggressive: $("scenarioAggressive"),
    };

    Object.values(presetButtons).forEach((btn) => btn && btn.classList.remove("is-active"));

    if (state.peak === "low" && state.data === "light") {
      presetButtons.conservative && presetButtons.conservative.classList.add("is-active");
      return;
    }
    if (state.peak === "medium" && state.data === "normal") {
      presetButtons.realistic && presetButtons.realistic.classList.add("is-active");
      return;
    }
    if (state.peak === "high" && state.data === "heavy") {
      presetButtons.aggressive && presetButtons.aggressive.classList.add("is-active");
    }
  };

  const bindSegmented = (rootId, key) => {
    const root = $(rootId);
    if (!root) return;
    root.querySelectorAll("button[data-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state[key] = btn.dataset.value;
        setSegmentedState(rootId, state[key]);
        render();
      });
    });
  };

  const setupWorkloadCards = () => {
    const root = $("workloadCards");
    if (!root) return;
    root.innerHTML = Object.entries(WORKLOADS)
      .map(
        ([id, item]) => `
          <button type="button" class="workload-card ${state.workload === id ? "is-active" : ""}" data-workload="${id}">
            <span class="workload-icon">${item.icon}</span>
            <div>
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <span class="workload-stack">${item.stackPreset}</span>
            </div>
          </button>
        `,
      )
      .join("");

    root.querySelectorAll("[data-workload]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.workload = btn.dataset.workload;
        const presetReq = WORKLOADS[state.workload].requestsPerUser;
        state.assumptions.reqPerUserOverride = null;
        safeSetValue("assumeReqPerUser", presetReq);
        setupWorkloadCards();
        render();
      });
    });
  };

  const money = (value) => `$${Math.round(value).toLocaleString()}`;

  const throughputLabel = (rps, monthly) => {
    if (rps >= 1) return `${rps.toFixed(1)} req/s`;
    const perMin = rps * 60;
    if (perMin >= 1) return `${perMin.toFixed(1)} req/min (≈ ${Math.round(monthly).toLocaleString()} req/month)`;
    return `${(rps * 3600).toFixed(1)} req/hour (≈ ${Math.round(monthly).toLocaleString()} req/month)`;
  };

  const normalizeAssumptions = () => {
    const reqPerUser = Math.max(10, Number(safeValue("assumeReqPerUser", WORKLOADS[state.workload].requestsPerUser) || WORKLOADS[state.workload].requestsPerUser));
    const cacheHit = Math.max(0, Math.min(95, Number(safeValue("assumeCacheHit", 60) || 60)));
    const durationMultiplier = Math.max(0.5, Math.min(3, Number(safeValue("assumeDurationMult", 1) || 1)));
    const storageGrowthGb = Math.max(1, Number(safeValue("assumeStorageGrowth", 12) || 12));
    const deploysPerMonth = Math.max(1, Number(safeValue("assumeDeploys", 24) || 24));
    const logsLevel = safeValue("assumeLogsLevel", "basic");

    state.assumptions.reqPerUserOverride = reqPerUser;
    state.assumptions.cacheHit = cacheHit;
    state.assumptions.durationMultiplier = durationMultiplier;
    state.assumptions.storageGrowthGb = storageGrowthGb;
    state.assumptions.deploysPerMonth = deploysPerMonth;
    state.assumptions.logsLevel = logsLevel in LOG_FACTOR ? logsLevel : "basic";
  };

  const estimate = () => {
    const w = WORKLOADS[state.workload];
    const peak = PEAK[state.peak];
    const data = DATA[state.data];
    const requestsPerUser = state.assumptions.reqPerUserOverride ?? w.requestsPerUser;
    const cacheHitPct = Math.max(0, Math.min(95, Number(state.assumptions.cacheHit || 0)));
    const cacheHit = cacheHitPct / 100;
    const priorityFactors = PRIORITY_COST_FACTOR[state.priority] ?? PRIORITY_COST_FACTOR.cost;

    const totalRequestsMonth = state.mau * requestsPerUser;
    const originRequestShare = Math.max(0.05, 1 - cacheHit);
    const originRequestsMonth = totalRequestsMonth * originRequestShare;

    const avgRpsTotal = totalRequestsMonth / (30.4 * 24 * 3600);
    const avgRpsOrigin = originRequestsMonth / (30.4 * 24 * 3600);
    const peakRps = avgRpsOrigin * peak.multiplier;

    const avgPayloadKb = w.payloadKb * data.payloadFactor;
    const egressGbMonth = (totalRequestsMonth * avgPayloadKb * data.egressFactor) / 1024 / 1024;

    const logLevel = state.assumptions.logsLevel || "basic";
    const logLevelFactor = logLevel === "high" ? 1.8 : logLevel === "standard" ? 1.2 : 1.0;
    const logBytesPerOriginReq = w.staticFriendly ? 90 : 260;
    const logGbMonth = (originRequestsMonth * logBytesPerOriginReq * logLevelFactor) / 1024 / 1024 / 1024;

    const avgRequestMs = Math.max(18, w.cpuMs * 1.8 * state.assumptions.durationMultiplier);
    const cpuEquivalent = peakRps * (w.cpuMs / 1000) * 1.3;
    const ramEquivalentGb = Math.max(1, cpuEquivalent * 2.2);
    const nodeEquivalent = Math.max(1, Math.ceil((peakRps / 120) * 1.3));

    const dbTier = peakRps * (1 + w.statePressure) > 400 ? "large" : peakRps > 120 ? "medium" : "small";
    const redisTier = peakRps < 80 ? "small" : peakRps < 250 ? "medium" : "large";
    const buildMinutes = w.staticFriendly ? 2 : 6;
    const ciCdCost = state.assumptions.deploysPerMonth * buildMinutes * PRICE.aws.ciMinute;

    const dbRequired = state.workload === "wordpress" || w.statePressure >= 0.6;
    const awsDb = dbRequired
      ? (dbTier === "large" ? PRICE.aws.dbLarge : dbTier === "medium" ? PRICE.aws.dbMedium : PRICE.aws.dbSmall)
      : PRICE.aws.dbLite;
    const awsAlb = PRICE.aws.albBaseMonth + peakRps * PRICE.aws.albVarPerRps;
    const awsRedisEnabled = cacheHitPct > 0;
    const awsRedis = awsRedisEnabled
      ? (redisTier === "large" ? PRICE.aws.redisLarge : redisTier === "medium" ? PRICE.aws.redisMedium : PRICE.aws.redisSmall)
      : 0;

    const awsBreakdown = {
      compute: cpuEquivalent * PRICE.aws.computeVcpuMonth + ramEquivalentGb * PRICE.aws.computeMemGbMonth,
      database: awsDb,
      loadBalancer: awsAlb,
      redisCache: awsRedis,
      dataTransfer: egressGbMonth * PRICE.aws.egressGb,
      storage: state.assumptions.storageGrowthGb * PRICE.aws.storageGbMonth,
      logs: logGbMonth * PRICE.aws.logGb,
      monitoring: PRICE.aws.monitorBase,
      cicd: ciCdCost,
      fixed: PRICE.aws.fixedBase,
    };

    const edgeBreakdown = {
      compute:
        (originRequestsMonth / 1e6) * PRICE.edge.reqPerMillion +
        (originRequestsMonth / 1e6) * avgRequestMs * PRICE.edge.durationPerMillionMs +
        PRICE.edge.platformBase,
      database: w.statePressure > 0.7 ? PRICE.edge.stateBase + peakRps * 0.1 : PRICE.edge.stateBase,
      loadBalancer: 0,
      redisCache: 0,
      dataTransfer: egressGbMonth * PRICE.edge.egressGb,
      storage: state.assumptions.storageGrowthGb * PRICE.edge.objectGbMonth,
      logs: logGbMonth * PRICE.edge.logGb,
      monitoring: PRICE.edge.monitorBase,
      cicd: state.assumptions.deploysPerMonth * buildMinutes * PRICE.edge.ciMinute,
      fixed: PRICE.edge.fixedBase,
    };

    const staticBreakdown = {
      compute: PRICE.static.hostingBase,
      database: 0,
      loadBalancer: 0,
      redisCache: 0,
      dataTransfer: egressGbMonth * PRICE.static.cdnEgressGb,
      storage: state.assumptions.storageGrowthGb * PRICE.static.storageGbMonth,
      logs: logGbMonth * 0.08,
      monitoring: PRICE.static.monitorBase,
      cicd: state.assumptions.deploysPerMonth * 5 * PRICE.static.buildMinute,
      fixed: PRICE.static.fixedBase,
    };

    const totalFromBreakdown = (b) => Object.values(b).reduce((a, n) => a + n, 0);
    const awsBaseTotal = totalFromBreakdown(awsBreakdown);
    const edgeBaseTotal = totalFromBreakdown(edgeBreakdown);
    const staticBaseTotal = totalFromBreakdown(staticBreakdown);

    const awsTotal = awsBaseTotal * priorityFactors.aws;
    const edgeTotal = edgeBaseTotal * priorityFactors.edge;
    const staticTotal = staticBaseTotal * priorityFactors.static;

    const scenarioAvailability = {
      static:
        w.staticFriendly &&
        state.data !== "heavy" &&
        state.mau <= 120000 &&
        state.peak !== "high" &&
        avgRequestMs <= 70,
      edge: w.edgeCompatible !== false,
      aws: true,
    };

    const scenarios = {
      static: {
        key: "static",
        title: "Scenario A - Static-first",
        stack: "Cloudflare Pages (or S3 + CloudFront) + optional tiny edge/API",
        total: staticTotal,
        baseTotal: staticBaseTotal,
        range: [Math.max(0, staticTotal * 0.65), staticTotal * 1.25],
        complexity: 1,
        available: scenarioAvailability.static,
        unavailableReason: scenarioAvailability.static ? "" : "Not eligible with current workload/traffic profile.",
        breakdown: staticBreakdown,
        bestFor: "Mostly static sites, docs, blogs",
        tradeoff: "Limited backend/state complexity",
      },
      edge: {
        key: "edge",
        title: "Scenario B - Edge-first",
        stack: "Edge functions + KV/DO + object storage + edge cache",
        total: edgeTotal,
        baseTotal: edgeBaseTotal,
        range: [edgeTotal * 0.78, edgeTotal * 1.32],
        complexity: 3,
        available: scenarioAvailability.edge,
        unavailableReason: scenarioAvailability.edge ? "" : "Not compatible with this stack (monolithic/stateful CMS).",
        breakdown: edgeBreakdown,
        bestFor: "Global low latency + bursty traffic",
        tradeoff: "Stateful/transactional complexity",
      },
      aws: {
        key: "aws",
        title: "Scenario C - AWS region",
        stack: "ALB + ECS/Fargate + DB + Redis + S3 + CloudFront + CloudWatch",
        total: awsTotal,
        baseTotal: awsBaseTotal,
        range: [awsTotal * 0.82, awsTotal * 1.28],
        complexity: 6,
        available: true,
        unavailableReason: "",
        breakdown: awsBreakdown,
        bestFor: "Heavier compute + robust stateful architecture",
        tradeoff: "Higher ops and network complexity",
      },
    };

    let selected = "aws";
    if (state.priority === "latency") selected = scenarioAvailability.edge ? "edge" : "aws";
    if (state.priority === "ops") {
      if (scenarioAvailability.static) selected = "static";
      else selected = scenarioAvailability.edge && w.statePressure < 0.75 ? "edge" : "aws";
    }
    if (state.priority === "cost") {
      const available = Object.values(scenarios).filter((s) => s.available);
      selected = [...available].sort((a, b) => a.total - b.total)[0].key;
    }

    if (w.cpuMs > 85 || state.data === "heavy") selected = "aws";
    if (!scenarios[selected].available) selected = "aws";

    const selectedScenario = scenarios[selected];
    const breakdownOrder = [
      ["compute", "Compute"],
      ["database", "Database / state"],
      ["loadBalancer", "Load balancer"],
      ["redisCache", "Redis cache"],
      ["dataTransfer", "Data transfer"],
      ["storage", "Storage"],
      ["logs", "Logs"],
      ["monitoring", "Monitoring"],
      ["cicd", "CI/CD"],
      ["fixed", "Fixed (domain/secrets)"],
    ];
    const breakdownSum = breakdownOrder.reduce((acc, [k]) => acc + (selectedScenario.breakdown[k] || 0), 0) || 1;
    const costLines = breakdownOrder.map(([k, label]) => {
      const value = selectedScenario.breakdown[k] || 0;
      const pct = Math.max(0, Math.round((value / breakdownSum) * 100));
      return { key: k, label, value, pct };
    }).filter((line) => line.value > 0);

    const topDrivers = [...costLines].sort((a, b) => b.value - a.value).slice(0, 4);

    const riskFlags = [];
    if (egressGbMonth > 1200) riskFlags.push("High egress risk: data transfer can dominate spend.");
    if (selected === "edge" && w.statePressure > 0.7) riskFlags.push("Stateful workload at edge: validate KV/DO/DB strategy.");
    if (selected === "aws" && awsRedisEnabled) riskFlags.push("AWS cache enabled: monitor Redis hit ratio and miss penalty.");
    if (w.statePressure > 0.8) riskFlags.push("Write-heavy profile: DB sizing likely dominant.");
    if (riskFlags.length === 0) riskFlags.push("No critical red flags from current inputs.");

    const nextStepsByScenario = {
      static: [
        "Keep the site static and route only auth/forms to minimal dynamic endpoints.",
        "Maximize CDN caching and optimize image delivery.",
        "Use lightweight monitoring and log sampling.",
      ],
      edge: [
        "Map state by pattern (KV read-heavy, DO coordination, DB for consistency).",
        "Define cache TTL + stale-while-revalidate policy.",
        "Set log retention and sampling early.",
      ],
      aws: [
        "Keep ALB + autoscaling policy explicit (CPU and latency targets).",
        "Size DB and Redis together and monitor cache-hit continuously.",
        "Reduce NAT/inter-AZ transfer and monitor egress drivers.",
      ],
    };

    const recommendationText = selected === "static" ? "Static-first (near-free)" : selected === "edge" ? "Edge-first" : "AWS region";
    const reasonText =
      selected === "static"
        ? "Mostly cacheable/static profile with low dynamic pressure."
        : selected === "edge"
        ? "Global latency and burst pattern favor edge runtime economics."
        : "State and/or heavier processing profile favors regional AWS control.";

    const architectureText =
      selected === "static"
        ? [
            "Static-first:",
            "- Hosting: Cloudflare Pages or S3 + CloudFront",
            "- Compute: optional tiny edge/API for auth/forms only",
            "- Data: object storage for assets",
            "- DB: none by default",
          ].join("\n")
        : selected === "edge"
        ? [
            "Edge-first:",
            "- Compute: Workers / Edge Functions",
            "- State: KV/DO + managed DB where strict consistency is required",
            "- Storage: object storage for assets/uploads",
            "- Caching: edge cache in front of dynamic endpoints",
          ].join("\n")
        : [
            "AWS region:",
            "- Entry: ALB in front of app services",
            "- Compute: ECS/Fargate (autoscaled by load)",
            "- Database: RDS/Aurora tiered by peak and state pressure",
            "- Cache: Redis (ElastiCache) enabled when cache is used",
            "- Storage/CDN: S3 + CloudFront",
            "- Observability: CloudWatch logs + metrics",
          ].join("\n");

    return {
      workload: w,
      requestsPerUser,
      cacheHit,
      cacheHitPct,
      requestsMonthRaw: totalRequestsMonth,
      requestsMonth: originRequestsMonth,
      originRequestsMonth,
      avgRps: avgRpsOrigin,
      avgRpsTotal,
      peakRps,
      avgPayloadKb,
      egressGbMonth,
      logGbMonth,
      avgRequestMs,
      nodeEquivalent,
      dbTier,
      redisTier,
      staticEligible: scenarioAvailability.static,
      scenarios,
      selected,
      selectedScenario,
      topDrivers,
      riskFlags,
      nextSteps: nextStepsByScenario[selected],
      recommendationText,
      reasonText,
      architectureText,
      costLines,
      baseTotals: {
        static: staticBaseTotal,
        edge: edgeBaseTotal,
        aws: awsBaseTotal,
      },
    };
  };

  const renderScenarioCards = (result) => {
    const order = ["static", "edge", "aws"];
    const cards = order
      .map((key) => {
        const sc = result.scenarios[key];
        const active = result.selected === key && sc.available;
        const disabled = !sc.available;
        const status = sc.available ? "Available" : sc.unavailableReason;

        return `
          <article class="scenario-card ${active ? "is-active" : ""} ${disabled ? "is-disabled" : ""}">
            <h3>${sc.title}</h3>
            <p class="scenario-status">${status}</p>
            <p class="scenario-stack">${sc.stack}</p>
            <p class="scenario-cost">${sc.available ? `${money(sc.range[0])} - ${money(sc.range[1])} / month` : "N/A for current selection"}</p>
            <ul>
              <li><strong>Best for:</strong> ${sc.bestFor}</li>
              <li><strong>Trade-off:</strong> ${sc.tradeoff}</li>
              <li><strong>Ops complexity:</strong> ${sc.complexity}/10</li>
            </ul>
          </article>
        `;
      })
      .join("");

    safeSetHTML("scenarioCards", cards);

    if (result.staticEligible) {
      safeSetHidden("freePath", false);
      safeSetHTML("freePath",
        "<strong>Eligible for $0-$5 hosting path:</strong> Cloudflare Pages / GitHub Pages / S3+CloudFront can work here if backend needs stay minimal and traffic remains moderate."
      );
    } else {
      safeSetHidden("freePath", true);
      safeSetHTML("freePath", "");
    }
  };

  const render = () => {
    normalizeAssumptions();
    const r = estimate();
    const priorityFactors = PRIORITY_COST_FACTOR[state.priority] ?? PRIORITY_COST_FACTOR.cost;

    safeSetText("chipWorkload", `Workload: ${r.workload.name}`);
    safeSetText("chipStack", r.workload.stackPreset.replace("Stack preset: ", "Stack: "));
    safeSetText("chipMau", `MAU: ${state.mau.toLocaleString()}`);
    safeSetText("chipPeak", `Peak: ${PEAK[state.peak].label}`);
    safeSetText("chipData", `Data: ${DATA[state.data].label}`);
    safeSetText("chipPriority", `Priority: ${state.priority === "cost" ? "Lower cost" : state.priority === "latency" ? "Lower latency" : "Simpler ops"}`);

    safeSetText("recommendationMain", r.recommendationText);
    safeSetText("recommendationReason", r.reasonText);
    safeSetText("bestFit", `Best-fit architecture: ${r.selectedScenario.stack}`);
    safeSetText("costRange", `${money(r.selectedScenario.range[0])} - ${money(r.selectedScenario.range[1])} / month`);

    if (r.staticEligible) {
      safeSetHidden("almostFree", false);
      safeSetText("almostFree", "Can be $0-$5 if static-first constraints hold (minimal backend, moderate transfer, lean observability).");
    } else {
      safeSetHidden("almostFree", true);
      safeSetText("almostFree", "");
    }

    safeSetHTML("costDrivers", r.topDrivers
      .map(
        (d) => `<li>
          <div class="driver-row">
            <span>${d.label}</span>
            <strong>${money(d.value)} (${d.pct}%)</strong>
          </div>
          <div class="driver-track"><div class="driver-fill" style="width:${d.pct}%"></div></div>
        </li>`,
      )
      .join(""));

    safeSetHTML("riskFlags", r.riskFlags.map((risk) => `<li>${risk}</li>`).join(""));
    safeSetHTML("nextSteps", r.nextSteps.map((step) => `<li>${step}</li>`).join(""));

    safeSetText("trafficDetails", [
      `Average throughput: ${throughputLabel(r.avgRps, r.requestsMonth)}`,
      `Peak equivalent: ${r.peakRps.toFixed(2)} req/s (spike factor ${PEAK[state.peak].multiplier}x)`,
      `Total requests/month (before cache): ${Math.round(r.requestsMonthRaw).toLocaleString()}`,
      `Origin requests/month (after cache): ${Math.round(r.originRequestsMonth).toLocaleString()}`,
      `Cache hit ratio: ${r.cacheHitPct}%`,
      `Average payload: ${r.avgPayloadKb.toFixed(1)} KB`,
      `Estimated data transfer: ${r.egressGbMonth.toFixed(1)} GB/month`,
    ].join("\n"));

    safeSetText("blueprintDetails", [
      `Components:`,
      `- Compute: ${r.selected === "static" ? "Static hosting + optional edge/API" : r.selected === "edge" ? "Edge functions runtime" : "Regional containers (Fargate/ECS)"}`,
      `- Storage: object storage (${state.assumptions.storageGrowthGb} GB/month growth)`,
      `- DB/State: ${r.selected === "static" ? "minimal or external managed DB" : r.selected === "edge" ? "KV/DO/managed DB" : `RDS/Aurora (${r.dbTier})`}`,
      `- Cache/CDN: enabled`,
      `Sizing:`,
      `- Compute class: ${r.nodeEquivalent <= 2 ? "small" : r.nodeEquivalent <= 5 ? "medium" : "large"}`,
      `- DB class: ${r.dbTier}`,
      `- Cache hit assumption: ${state.assumptions.cacheHit}%`,
      `- Peak headroom: 30%`,
      `- Availability: ${r.selected === "aws" ? "multi-AZ recommended" : "single-region edge/global POP"}`,
    ].join("\n"));
    safeSetText("archDetails", r.architectureText);
    safeSetText("costDetails", r.costLines.map((line) => `${line.label}: ${money(line.value)} (${line.pct}%)`).join("\n"));

    const payloadDoubleDelta = r.selectedScenario.total * 0.18;
    const cacheDropDelta = r.selectedScenario.total * 0.22;
    const peakDelta = r.selectedScenario.total * 0.27;
    safeSetText("sensitivityDetails", [
      `If payload doubles -> +${money(payloadDoubleDelta)}/month`,
      `If cache hit drops from ${state.assumptions.cacheHit}% to 30% -> +${money(cacheDropDelta)}/month`,
      `If peak rises by 10x -> compute +${money(peakDelta)}/month`,
    ].join("\n"));

    safeSetText("decisionRules", [
      `Edge wins when: avg request <= 120ms, global audience, moderate egress, cacheable traffic.`,
      `AWS wins when: avg request >= 180ms, write-heavy state, complex VPC/network dependencies.`,
      `Static-first eligible when: static-friendly workload + MAU <= 120k + non-heavy data + non-high peak.`,
      `Priority impact: "${state.priority}" applies scenario cost factors (static ${priorityFactors.static}x, edge ${priorityFactors.edge}x, aws ${priorityFactors.aws}x).`,
    ].join("\n"));

    safeSetText("assumptionsDetails", [
      `MAU: ${state.mau.toLocaleString()}`,
      `Requests per user/month: ${r.requestsPerUser}`,
      `Peak factor: ${PEAK[state.peak].multiplier}x (${PEAK[state.peak].label})`,
      `Average response multiplier: ${state.assumptions.durationMultiplier}x`,
      `Payload profile: ${DATA[state.data].label}`,
      `Log volume estimate: ${r.logGbMonth.toFixed(2)} GB/month`,
      `Cache hit ratio: ${state.assumptions.cacheHit}%`,
      `Storage growth: ${state.assumptions.storageGrowthGb} GB/month`,
      `Logging level: ${state.assumptions.logsLevel}`,
      `Deploy frequency: ${state.assumptions.deploysPerMonth} deploys/month`,
    ].join("\n"));

    renderScenarioCards(r);
    syncPresetButtons();
  };

  const applyScenario = (peak, data) => {
    state.peak = peak;
    state.data = data;
    setSegmentedState("peakButtons", peak);
    setSegmentedState("dataButtons", data);
    render();
  };

  safeOn("mauRange", "input", (event) => {
    const value = Number(event.target.value || 500);
    state.mau = value;
    safeSetValue("mauInput", value);
    render();
  });

  safeOn("mauInput", "input", (event) => {
    const value = Math.max(500, Number(event.target.value || 500));
    state.mau = value;
    safeSetValue("mauRange", Math.min(1000000, value));
    render();
  });

  safeOn("scenarioConservative", "click", () => applyScenario("low", "light"));
  safeOn("scenarioRealistic", "click", () => applyScenario("medium", "normal"));
  safeOn("scenarioAggressive", "click", () => applyScenario("high", "heavy"));

  ["assumeReqPerUser", "assumeCacheHit", "assumeDurationMult", "assumeStorageGrowth", "assumeDeploys", "assumeLogsLevel"].forEach((id) => {
    safeOn(id, "input", render);
    safeOn(id, "change", render);
  });

  bindSegmented("peakButtons", "peak");
  bindSegmented("dataButtons", "data");
  bindSegmented("priorityButtons", "priority");
  setupWorkloadCards();
  render();
