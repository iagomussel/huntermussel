// Shared between calculate-metadata.ts (total duration budget) and BlogPromo.tsx
// (actual TransitionSeries overlap). These must match or the calculated
// composition length drifts from what's actually rendered, truncating the
// final scene.
export const TRANSITION_DURATION_FRAMES = 12;
