import type { Interest, InterestSubject } from "./schema/interest.js";
import type { Preference } from "./schema/preference.js";
import type { FetchedItem } from "./schema/item.js";

export interface SelectedItem {
  item: FetchedItem;
  reason: string;
  score: number;
}

export interface SelectOptions {
  /** Reference date recency is measured against, injected so selection is reproducible. */
  asOf: Date;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function activeSubjectsFor(item: FetchedItem, subjectById: Map<string, InterestSubject>): InterestSubject[] {
  return item.subjects
    .map((id) => subjectById.get(id))
    .filter((subject): subject is InterestSubject => subject !== undefined && subject.status === "active");
}

/**
 * Filters the candidate pool by interest (active subjects) and preference's
 * hard recency cutoff, then ranks what is left by interest weight, source
 * weight, depth preference, format preference, and recency preference - in
 * that order.
 *
 * Knowledge state never enters this function: per #3's design doc, knowledge
 * changes what an item's text says, never whether it is selected or where it ranks.
 */
export function selectAndRank(
  items: FetchedItem[],
  interest: Interest,
  preference: Preference,
  options: SelectOptions,
): SelectedItem[] {
  const subjectById = new Map(interest.subjects.map((subject) => [subject.id, subject]));

  const eligible = items.filter((item) => {
    if (activeSubjectsFor(item, subjectById).length === 0) return false;

    const ageDays = (options.asOf.getTime() - new Date(item.publishedAt).getTime()) / MS_PER_DAY;
    return ageDays <= preference.recency.min_recency_days;
  });

  const scored = eligible.map((item) => {
    const activeSubjects = activeSubjectsFor(item, subjectById);
    const topSubject = activeSubjects.reduce((best, subject) => (subject.weight > best.weight ? subject : best));
    const sourceWeight = preference.sources[item.sourceId] ?? 1;
    const reason = `matches interest subject '${topSubject.id}' (weight ${topSubject.weight})`;

    const publishedAtMs = new Date(item.publishedAt).getTime();
    const depthBonus =
      preference.depth === "deep" ? item.rawText.length : -item.rawText.length;
    // Earlier in `preference.formats` ranks higher; a format absent from the
    // list ranks below every listed one rather than being rejected.
    const formatRank = preference.formats.indexOf(item.format);
    const formatBonus = formatRank === -1 ? -1 : preference.formats.length - formatRank;
    const recencyBonus = preference.recency.prefer_recent ? publishedAtMs : -publishedAtMs;

    // Weighted so that a higher-priority factor never gets outweighed by a lower one.
    const score =
      topSubject.weight * 1_000_000 +
      sourceWeight * 10_000 +
      depthBonus / 1_000 +
      formatBonus / 100 +
      recencyBonus / 1e13;

    return { item, reason, score };
  });

  return scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.id.localeCompare(b.item.id);
  });
}
