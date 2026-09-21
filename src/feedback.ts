import type { Interest, InterestSubject } from "./schema/interest.js";
import type { Preference } from "./schema/preference.js";
import type { Knowledge, KnowledgeConcept, Familiarity } from "./schema/knowledge.js";

export interface FeedbackState {
  interest: Interest;
  preference: Preference;
  knowledge: Knowledge;
}

export type StateFile = "interest" | "preference" | "knowledge";

export type Signal =
  | { kind: "knowledge-familiarity"; conceptId: string; familiarity: Familiarity }
  | { kind: "preference-depth"; depth: "quick" | "deep" }
  | { kind: "preference-source-weight"; sourceId: string; direction: "more" | "less" }
  | { kind: "interest-status"; subjectId: string; status: "active" | "muted" }
  | { kind: "interest-boost"; subjectId: string };

const KNOWLEDGE_EXPERT_PATTERNS = [/\bi'?m an expert (?:in|on)\b/i, /\bexpert(?:ise)? (?:in|on)\b/i];
const KNOWLEDGE_FAMILIAR_PATTERNS = [
  /\bi (?:already )?know\b/i,
  /\bstop explaining\b/i,
  /\balready familiar with\b/i,
  /\bno need to explain\b/i,
];

const DEPTH_DEEP_PATTERNS = [/\bdeeper\b/i, /\bmore depth\b/i, /\bin-depth\b/i, /\bdeep dives?\b/i, /\blong-form\b/i];
const DEPTH_QUICK_PATTERNS = [/\bquicker\b/i, /\bshorter\b/i, /\bbriefer\b/i, /\bless detail\b/i, /\bquick summaries\b/i];

const SOURCE_MORE_PATTERN = /\bmore (?:from|of)\s+([a-z][a-z0-9-]*)/gi;
const SOURCE_LESS_PATTERN = /\b(?:less|fewer) (?:from|of)\s+([a-z][a-z0-9-]*)/gi;

const INTEREST_MUTE_PATTERNS = [
  /\bstop showing me\b/i,
  /\bmute\b/i,
  /\bnot interested in\b/i,
  /\bless interested in\b/i,
];
const INTEREST_BOOST_PATTERNS = [/\bmore (?:on|about)\b/i, /\bmore interested in\b/i, /\bdeeper pieces? on\b/i];

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

/** True if the comment names this entity, by its id (hyphens or spaces) or its label - never the reverse. */
function mentionsEntity(commentBody: string, id: string, label: string): boolean {
  const lower = commentBody.toLowerCase();
  const idAsWords = id.replace(/-/g, " ").toLowerCase();
  return lower.includes(id.toLowerCase()) || lower.includes(idAsWords) || lower.includes(label.toLowerCase());
}

/**
 * Splits a comment into clauses at sentence boundaries and at commas
 * introducing a contrasting or additional clause ("but", "while", ...), so a
 * pattern like "stop explaining" can be scoped to the entity it was written
 * next to rather than matched against the whole comment. See #6 review on
 * PR #16: without this, "I know X, but keep explaining Y" marked both X and
 * Y familiar.
 */
function splitClauses(commentBody: string): string[] {
  return commentBody
    .split(/[.!?;\n]+|,\s*(?:but|however|while|whereas|though|yet|and)\b/i)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

/** The clauses mentioning this entity, joined - the text a per-entity pattern test is scoped to. */
function entityScopedText(clauses: string[], id: string, label: string): string | undefined {
  const relevant = clauses.filter((clause) => mentionsEntity(clause, id, label));
  return relevant.length > 0 ? relevant.join(" ") : undefined;
}

function knowledgeSignals(commentBody: string, concepts: KnowledgeConcept[]): Signal[] {
  const clauses = splitClauses(commentBody);
  const signals: Signal[] = [];
  for (const concept of concepts) {
    const scoped = entityScopedText(clauses, concept.id, concept.label);
    if (scoped === undefined) continue;
    if (matchesAny(KNOWLEDGE_EXPERT_PATTERNS, scoped)) {
      signals.push({ kind: "knowledge-familiarity", conceptId: concept.id, familiarity: "expert" });
    } else if (matchesAny(KNOWLEDGE_FAMILIAR_PATTERNS, scoped)) {
      signals.push({ kind: "knowledge-familiarity", conceptId: concept.id, familiarity: "familiar" });
    }
  }
  return signals;
}

function interestSignals(commentBody: string, subjects: InterestSubject[]): Signal[] {
  const clauses = splitClauses(commentBody);
  const signals: Signal[] = [];
  for (const subject of subjects) {
    const scoped = entityScopedText(clauses, subject.id, subject.label);
    if (scoped === undefined) continue;
    if (matchesAny(INTEREST_MUTE_PATTERNS, scoped)) {
      signals.push({ kind: "interest-status", subjectId: subject.id, status: "muted" });
    } else if (matchesAny(INTEREST_BOOST_PATTERNS, scoped)) {
      signals.push({ kind: "interest-boost", subjectId: subject.id });
    }
  }
  return signals;
}

function depthSignal(commentBody: string): Signal[] {
  if (matchesAny(DEPTH_DEEP_PATTERNS, commentBody)) return [{ kind: "preference-depth", depth: "deep" }];
  if (matchesAny(DEPTH_QUICK_PATTERNS, commentBody)) return [{ kind: "preference-depth", depth: "quick" }];
  return [];
}

/**
 * Only fires for a source id already present in `preference.sources` -
 * adding a brand-new source is a `sources.yaml` edit (#3's design doc), not a
 * comment-driven one, so an unrecognised token here is not a source id, it is
 * noise, and is left alone.
 */
function sourceWeightSignals(commentBody: string, preference: Preference): Signal[] {
  const signals: Signal[] = [];
  const knownSourceIds = new Set(Object.keys(preference.sources));

  for (const match of commentBody.matchAll(SOURCE_MORE_PATTERN)) {
    const sourceId = match[1]?.toLowerCase();
    if (sourceId && knownSourceIds.has(sourceId)) {
      signals.push({ kind: "preference-source-weight", sourceId, direction: "more" });
    }
  }
  for (const match of commentBody.matchAll(SOURCE_LESS_PATTERN)) {
    const sourceId = match[1]?.toLowerCase();
    if (sourceId && knownSourceIds.has(sourceId)) {
      signals.push({ kind: "preference-source-weight", sourceId, direction: "less" });
    }
  }
  return signals;
}

/**
 * Reads a comment body purely as data: every signal below is found by
 * matching fixed keyword patterns and matching text against ids/labels the
 * state files already contain. Nothing from the comment is ever used as a
 * file path, a command, or a value outside a fixed, schema-valid enum - so
 * text shaped like an instruction has nothing to latch onto. See #6.
 */
export function extractSignals(commentBody: string, state: FeedbackState): Signal[] {
  return [
    ...knowledgeSignals(commentBody, state.knowledge.concepts),
    ...interestSignals(commentBody, state.interest.subjects),
    ...depthSignal(commentBody),
    ...sourceWeightSignals(commentBody, state.preference),
  ];
}

export interface ApplySignalsResult extends FeedbackState {
  changedFiles: Set<StateFile>;
}

/** Applies signals to cloned copies of state, never mutating the input. */
export function applySignals(state: FeedbackState, signals: Signal[]): ApplySignalsResult {
  const interest: Interest = { subjects: state.interest.subjects.map((subject) => ({ ...subject })) };
  const preference: Preference = {
    ...state.preference,
    recency: { ...state.preference.recency },
    sources: { ...state.preference.sources },
  };
  const knowledge: Knowledge = { concepts: state.knowledge.concepts.map((concept) => ({ ...concept })) };
  const changedFiles = new Set<StateFile>();

  for (const signal of signals) {
    switch (signal.kind) {
      case "knowledge-familiarity": {
        const concept = knowledge.concepts.find((c) => c.id === signal.conceptId);
        if (concept && concept.familiarity !== signal.familiarity) {
          concept.familiarity = signal.familiarity;
          changedFiles.add("knowledge");
        }
        break;
      }
      case "interest-status": {
        const subject = interest.subjects.find((s) => s.id === signal.subjectId);
        if (subject && subject.status !== signal.status) {
          subject.status = signal.status;
          changedFiles.add("interest");
        }
        break;
      }
      case "interest-boost": {
        const subject = interest.subjects.find((s) => s.id === signal.subjectId);
        if (subject) {
          if (subject.status === "muted") {
            subject.status = "active";
            changedFiles.add("interest");
          } else if (subject.weight < 5) {
            subject.weight += 1;
            changedFiles.add("interest");
          }
        }
        break;
      }
      case "preference-depth": {
        if (preference.depth !== signal.depth) {
          preference.depth = signal.depth;
          changedFiles.add("preference");
        }
        break;
      }
      case "preference-source-weight": {
        const current = preference.sources[signal.sourceId] ?? 1;
        const next = signal.direction === "more" ? current + 1 : Math.max(0, current - 1);
        if (next !== current) {
          preference.sources[signal.sourceId] = next;
          changedFiles.add("preference");
        }
        break;
      }
    }
  }

  return { interest, preference, knowledge, changedFiles };
}
