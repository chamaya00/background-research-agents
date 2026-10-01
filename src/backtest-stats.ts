/** Metrics and decision rule of docs/research/red-zone-backtest-plan.md section 4. Nothing here is tuned. */

export const BOOTSTRAP_RESAMPLES = 2000;
export const BOOTSTRAP_SEED = 20261001;
export const MIN_SCORED = 30;

export type Verdict = "beats" | "inconclusive" | "loses";

export interface Interval {
  lo: number;
  hi: number;
}

/** Average ranks (1-based), ties share the mean of their positions. */
export function ranks(xs: number[]): number[] {
  const order = xs.map((_, i) => i).sort((a, b) => xs[a]! - xs[b]!);
  const out = new Array<number>(xs.length).fill(0);
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && xs[order[j + 1]!] === xs[order[i]!]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) out[order[k]!] = avg;
    i = j + 1;
  }
  return out;
}

/** Spearman rank correlation with average ranks; `null` when either side is constant or n < 2. */
export function spearman(x: number[], y: number[]): number | null {
  if (x.length < 2) return null;
  const rx = ranks(x);
  const ry = ranks(y);
  const n = x.length;
  const mx = rx.reduce((a, b) => a + b, 0) / n;
  const my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (rx[i]! - mx) * (ry[i]! - my);
    sxx += (rx[i]! - mx) ** 2;
    syy += (ry[i]! - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? null : sxy / Math.sqrt(sxx * syy);
}

export function mae(proj: number[], actual: number[]): number | null {
  return proj.length === 0 ? null : proj.reduce((s, p, i) => s + Math.abs(p - actual[i]!), 0) / proj.length;
}

/** 95% Wilson score interval for `hits` of `n`. */
export function wilson(hits: number, n: number): Interval | null {
  if (n === 0) return null;
  const z = 1.96;
  const p = hits / n;
  const d = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / d;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return { lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

export interface ScoredItem {
  id: string;
  fold: number;
  team: string;
  actual: number;
  proj: number;
}

/**
 * Top-N hits in one fold: the N highest projections (ties broken by id ascending) that are
 * in the actual top N (ties at the Nth actual value all count as in). Returns hits and the
 * number of slots, which is N, or the fold's player count when it has fewer than N.
 */
export function topNHits(items: ScoredItem[], n: number): { hits: number; slots: number } {
  if (items.length === 0) return { hits: 0, slots: 0 };
  const slots = Math.min(n, items.length);
  const picked = [...items].sort((a, b) => b.proj - a.proj || a.id.localeCompare(b.id)).slice(0, slots);
  const cut = [...items].map((i) => i.actual).sort((a, b) => b - a)[slots - 1]!;
  return { hits: picked.filter((i) => i.actual >= cut).length, slots };
}

/** mulberry32: a small seeded generator, so a re-run reproduces the intervals. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface MethodScores {
  /** Per player-week, in the same order for every method. */
  actual: number[];
  /** Team-week key (`fold|team`) per player-week: the resampling unit. */
  groups: string[];
  proj: Record<string, number[]>;
}

export interface PairedBootstrap {
  spearman_diff: Interval | null;
  mae_diff: Interval | null;
}

const quantile = (sorted: number[], p: number): number =>
  sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)))]!;
const interval = (xs: number[]): Interval | null => {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  return { lo: quantile(s, 0.025), hi: quantile(s, 0.975) };
};

/** Paired bootstrap of model minus each baseline, resampling whole team-weeks. */
export function pairedBootstrap(
  scores: MethodScores,
  model: string,
  baselines: string[],
  resamples = BOOTSTRAP_RESAMPLES,
  seed = BOOTSTRAP_SEED,
): Record<string, PairedBootstrap> {
  const byGroup = new Map<string, number[]>();
  scores.groups.forEach((g, i) => byGroup.set(g, [...(byGroup.get(g) ?? []), i]));
  const keys = [...byGroup.keys()].sort();
  const next = rng(seed);
  const sp: Record<string, number[]> = Object.fromEntries(baselines.map((b) => [b, []]));
  const ma: Record<string, number[]> = Object.fromEntries(baselines.map((b) => [b, []]));
  if (keys.length === 0) return Object.fromEntries(baselines.map((b) => [b, { spearman_diff: null, mae_diff: null }]));
  for (let r = 0; r < resamples; r++) {
    const idx: number[] = [];
    for (let k = 0; k < keys.length; k++) idx.push(...byGroup.get(keys[Math.floor(next() * keys.length)]!)!);
    const actual = idx.map((i) => scores.actual[i]!);
    const pick = (m: string): number[] => idx.map((i) => scores.proj[m]![i]!);
    const modelProj = pick(model);
    const modelSp = spearman(modelProj, actual);
    const modelMae = mae(modelProj, actual)!;
    for (const b of baselines) {
      const bp = pick(b);
      const bs = spearman(bp, actual);
      if (modelSp !== null && bs !== null) sp[b]!.push(modelSp - bs);
      ma[b]!.push(modelMae - mae(bp, actual)!);
    }
  }
  return Object.fromEntries(baselines.map((b) => [b, { spearman_diff: interval(sp[b]!), mae_diff: interval(ma[b]!) }]));
}

/** Section 4 rule for one reading. Fewer than 30 scored player-weeks is inconclusive. */
export function verdict(
  n: number,
  boot: PairedBootstrap,
  modelHit: Interval | null,
  baselineHit: Interval | null,
): Verdict {
  if (n < MIN_SCORED || boot.spearman_diff === null || boot.mae_diff === null) return "inconclusive";
  const hitWorse = modelHit !== null && baselineHit !== null && baselineHit.lo > modelHit.hi;
  const hitBetter = modelHit !== null && baselineHit !== null && modelHit.lo > baselineHit.hi;
  if (boot.spearman_diff.lo > 0 && !(boot.mae_diff.lo > 0) && !hitWorse) return "beats";
  if (boot.spearman_diff.hi < 0 && !(boot.mae_diff.hi < 0) && !hitBetter) return "loses";
  return "inconclusive";
}

/** Both readings must give the same verdict; otherwise inconclusive. */
export const combine = (a: Verdict, b: Verdict): Verdict => (a === b ? a : "inconclusive");

/** Median; the mean of the two middle values when the count is even. Null for no values. */
export function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 === 1 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/** First week of each addendum block (section C of the 2025 addendum): block 1 is W = 2-5, and so on. */
export const BLOCK_STARTS = [2, 6, 10, 14] as const;
export const BLOCK_SIZE = 4;
/** Block number 1-4 for a target week, or null outside W = 2..17. */
export const blockOf = (week: number): number | null => {
  const b = Math.floor((week - 2) / BLOCK_SIZE) + 1;
  return week >= 2 && b <= BLOCK_STARTS.length ? b : null;
};

/**
 * Addendum section C: the first week of the earliest block from which the combined verdict is
 * "beats" in that block and every later one; "none" if there is no such block. `byBlock` is the
 * four blocks' combined verdicts in order.
 */
export function settlingWeek(byBlock: Verdict[]): number | "none" {
  let start = byBlock.length;
  while (start > 0 && byBlock[start - 1] === "beats") start--;
  return start === byBlock.length ? "none" : BLOCK_STARTS[start]!;
}

export const VOLUME_K = 3;

/**
 * Addendum section D: a volume threshold matters when the combined verdict is "beats" in the High
 * stratum and not "beats" in the Low stratum in at least `k` blocks. Both lists are per block, in order.
 */
export function volumeMatters(high: Verdict[], low: Verdict[], k = VOLUME_K): boolean {
  return high.filter((h, i) => h === "beats" && low[i] !== "beats").length >= k;
}
