import { describe, expect, it } from "vitest";
import {
  combine,
  mae,
  pairedBootstrap,
  ranks,
  rng,
  spearman,
  topNHits,
  verdict,
  wilson,
  type PairedBootstrap,
  type ScoredItem,
} from "../src/backtest-stats.js";

describe("rank metrics", () => {
  it("gives tied values their average rank", () => {
    expect(ranks([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
  });

  it("is 1 for a monotone relation, -1 for a reversed one, and null for a constant side", () => {
    expect(spearman([1, 2, 3, 4], [10, 20, 30, 45])).toBeCloseTo(1);
    expect(spearman([1, 2, 3, 4], [4, 3, 2, 1])).toBeCloseTo(-1);
    expect(spearman([2, 2, 2], [1, 2, 3])).toBeNull();
  });

  it("takes MAE in counts", () => {
    expect(mae([1, 2], [0, 4])).toBe(1.5);
  });

  it("gives a 95% Wilson interval", () => {
    const w = wilson(8, 10)!;
    expect(w.lo).toBeCloseTo(0.4902, 3);
    expect(w.hi).toBeCloseTo(0.9433, 3);
    expect(wilson(0, 0)).toBeNull();
  });
});

describe("top-N hit rate", () => {
  const item = (id: string, proj: number, actual: number): ScoredItem => ({ id, fold: 2, team: "T", proj, actual });

  it("breaks projection ties by id ascending and counts ties at the Nth actual value as in", () => {
    const items = [item("c", 5, 3), item("a", 5, 0), item("b", 5, 3), item("d", 1, 3)];
    // N = 2: picks a and b (ids ascending among the tied 5s); actual top 2 cut-off is 3, so b is in and a is not.
    expect(topNHits(items, 2)).toEqual({ hits: 1, slots: 2 });
  });

  it("has only as many slots as the fold has players", () => {
    expect(topNHits([item("a", 1, 1)], 6)).toEqual({ hits: 1, slots: 1 });
  });
});

describe("paired bootstrap and the decision rule", () => {
  const scores = {
    actual: [0, 1, 2, 3, 4, 5, 6, 7],
    groups: ["a", "a", "b", "b", "c", "c", "d", "d"],
    proj: { model: [0, 1, 2, 3, 4, 5, 6, 7], base: [3, 0, 5, 1, 7, 2, 4, 6] },
  };

  it("is reproducible from the seed", () => {
    expect(pairedBootstrap(scores, "model", ["base"], 200)).toEqual(pairedBootstrap(scores, "model", ["base"], 200));
  });

  it("resamples whole team-weeks", () => {
    // One group only: every resample is that group, so the interval collapses to a point.
    const one = { actual: [1, 2, 3], groups: ["g", "g", "g"], proj: { model: [1, 2, 3], base: [3, 2, 1] } };
    const { base } = pairedBootstrap(one, "model", ["base"], 50);
    expect(base!.spearman_diff!.lo).toBeCloseTo(2);
    expect(base!.spearman_diff!.hi).toBeCloseTo(2);
  });

  const boot = (lo: number, hi: number, maeLo = -1, maeHi = -0.1): PairedBootstrap => ({
    spearman_diff: { lo, hi },
    mae_diff: { lo: maeLo, hi: maeHi },
  });

  it("beats only when the Spearman interval sits entirely above 0", () => {
    expect(verdict(40, boot(0.05, 0.3), null, null)).toBe("beats");
    expect(verdict(40, boot(-0.01, 0.3), null, null)).toBe("inconclusive");
    expect(verdict(40, boot(-0.3, -0.05, 0.1, 0.5), null, null)).toBe("loses");
    // A model that is better on MAE is not a clear loser however the rank correlation reads.
    expect(verdict(40, boot(-0.3, -0.05), null, null)).toBe("inconclusive");
  });

  it("is blocked by a worse MAE interval or a baseline hit rate entirely above the model's", () => {
    expect(verdict(40, boot(0.05, 0.3, 0.1, 0.5), null, null)).toBe("inconclusive");
    expect(verdict(40, boot(0.05, 0.3), { lo: 0.1, hi: 0.3 }, { lo: 0.4, hi: 0.6 })).toBe("inconclusive");
  });

  it("is inconclusive under 30 scored player-weeks, and when the two readings disagree", () => {
    expect(verdict(29, boot(0.05, 0.3), null, null)).toBe("inconclusive");
    expect(combine("beats", "beats")).toBe("beats");
    expect(combine("beats", "inconclusive")).toBe("inconclusive");
    expect(combine("beats", "loses")).toBe("inconclusive");
  });

  it("has a generator that stays in [0, 1)", () => {
    const next = rng(20261001);
    for (let i = 0; i < 100; i++) expect(next()).toBeLessThan(1);
  });
});
