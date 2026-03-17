/**
 * Proposed tests for the estimators business logic.
 *
 * PREREQUISITE: The pure calculation logic in estimators.js (estimate(),
 * throughputLabel(), money(), WORKLOADS, PRICE, PEAK, DATA constants) must be
 * extracted into a separate module (e.g. src/lib/estimators.ts) that can be
 * imported without side-effects (DOM event bindings, querySelector calls).
 *
 * Once extracted, delete the .todo() calls below and implement each test.
 */
import { describe, it } from "vitest";

describe("estimate() – traffic calculations", () => {
  it.todo("computes originRequestsMonth correctly given mau, requestsPerUser, and cacheHit");
  it.todo("clamps cacheHit between 0 and 95 before applying it");
  it.todo("uses workload.requestsPerUser when reqPerUserOverride is null");
  it.todo("uses reqPerUserOverride when it is set");
  it.todo("peakRps equals avgRpsOrigin * peak.multiplier");
  it.todo("egressGbMonth accounts for payloadFactor and egressFactor from DATA config");
  it.todo("logGbMonth uses staticFriendly flag to choose 90 vs 260 bytes per request");
});

describe("estimate() – scenario selection", () => {
  it.todo("selects static scenario for content workload with low MAU and low peak");
  it.todo("selects aws scenario when cpuMs > 85 regardless of priority");
  it.todo("selects aws scenario when data is heavy regardless of priority");
  it.todo("selects edge scenario when priority is latency and edge is compatible");
  it.todo("falls back to aws when the preferred scenario is unavailable");
  it.todo("selects cheapest available scenario when priority is cost");
  it.todo("static scenario is unavailable when MAU > 120,000");
  it.todo("static scenario is unavailable when workload.staticFriendly is false");
});

describe("estimate() – cost breakdowns", () => {
  it.todo("awsBreakdown.compute scales with cpuEquivalent and ramEquivalentGb");
  it.todo("awsBreakdown.database uses dbLite when statePressure < 0.6 and workload is not wordpress");
  it.todo("awsBreakdown.redisCache is 0 when cacheHitPct is 0");
  it.todo("edgeBreakdown.loadBalancer and redisCache are always 0");
  it.todo("staticBreakdown.compute is always 0 (free hosting base)");
  it.todo("priorityFactors are applied correctly to each scenario total");
});

describe("estimate() – risk flags", () => {
  it.todo("flags high egress risk when egressGbMonth > 1200");
  it.todo("flags stateful workload at edge when selected is edge and statePressure > 0.7");
  it.todo('shows "No critical red flags" when no conditions are met');
});

describe("money()", () => {
  it.todo("formats 0 as '$0'");
  it.todo("formats 1234.6 as '$1,235' (rounds to nearest integer)");
  it.todo("formats large values with locale comma separators");
});

describe("throughputLabel()", () => {
  it.todo("returns 'X req/s' when rps >= 1");
  it.todo("returns 'X req/min' when rps < 1 but rps*60 >= 1");
  it.todo("returns 'X req/hour' for very low rps values");
});

describe("WORKLOADS constants", () => {
  it.todo("each workload has required fields: requestsPerUser, payloadKb, cpuMs, statePressure");
  it.todo("content workload has staticFriendly: true and edgeCompatible: true");
  it.todo("wordpress workload has edgeCompatible: false");
});
