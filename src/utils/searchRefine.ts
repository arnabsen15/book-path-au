/** Shared search noise reduction: token thresholds, dedupe, caps. */

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'of',
  'and',
  'or',
  'in',
  'on',
  'to',
  'for',
  'by',
  'with',
  'from',
  'at',
])

/** Max close matches shown after filtering. */
export const MAX_CLOSE_RESULTS = 8

/** Cap for the optional broader (noisier) list. */
export const MAX_BROADER_RESULTS = 20

export function normText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Significant query tokens (drop tiny stop words). */
export function significantTokens(query: string): string[] {
  return normText(query)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
}

/**
 * "Mostly present": for 1–2 tokens require all; otherwise ≥ 2/3 of tokens.
 */
export function mostlyPresent(tokens: string[], ...fields: string[]): boolean {
  if (tokens.length === 0) return true
  const haystacks = fields.map(normText)
  const hits = tokens.filter((t) => haystacks.some((h) => h.includes(t))).length
  const need = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * (2 / 3))
  return hits >= need
}

/** Collapse near-identical titles for dedupe keys. */
export function titleDedupeKey(title: string): string {
  return normText(title)
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function titlesNearlyIdentical(a: string, b: string): boolean {
  const ka = titleDedupeKey(a)
  const kb = titleDedupeKey(b)
  if (!ka || !kb) return false
  if (ka === kb) return true
  // One contains the other and lengths are close (edition / subtitle noise)
  const shorter = ka.length <= kb.length ? ka : kb
  const longer = ka.length <= kb.length ? kb : ka
  if (shorter.length >= 8 && longer.includes(shorter)) {
    const ratio = shorter.length / longer.length
    if (ratio >= 0.7) return true
  }
  return false
}

/** Keep first occurrence of near-identical titles (list should already be ranked). */
export function dedupeByTitle<T extends { title: string }>(items: T[]): T[] {
  const out: T[] = []
  for (const item of items) {
    if (out.some((kept) => titlesNearlyIdentical(kept.title, item.title))) continue
    out.push(item)
  }
  return out
}

export interface RefinedList<T> {
  /** Threshold-filtered, deduped, capped close matches. */
  close: T[]
  /** Ranked + deduped without threshold (still capped) — for “broader results”. */
  broader: T[]
  /** True when close is a strict subset / reduction of broader noise. */
  wasFiltered: boolean
  /** Raw ranked count before close filter (after soft dedupe). */
  rawCount: number
}

/**
 * Apply dedupe → close threshold → caps.
 * `isClose` decides minimum relevance; items should already be relevance-ranked.
 */
export function refineRankedResults<T extends { title: string }>(
  ranked: T[],
  isClose: (item: T) => boolean,
): RefinedList<T> {
  const deduped = dedupeByTitle(ranked)
  const closeAll = deduped.filter(isClose)
  const close = closeAll.slice(0, MAX_CLOSE_RESULTS)
  const broader = deduped.slice(0, MAX_BROADER_RESULTS)
  const wasFiltered =
    close.length < broader.length || closeAll.length < deduped.length || deduped.length > MAX_CLOSE_RESULTS

  return {
    close,
    broader,
    wasFiltered,
    rawCount: deduped.length,
  }
}
