/**
 * HCS Scoring Engine
 * Source: Mécanique de calculs HCS pour front HCM
 *
 * Three score dimensions:
 *   1. Image Completion  — counts images vs. per-category targets
 *   2. Text Completion   — measures fill ratio of text fields (75% rule)
 *   3. Photo Quality     — AI + human validation (provided externally)
 *
 * Global score = average(content, photos, quality)
 */

// ─── 1. Image Completion ───────────────────────────────────────────────────────

/**
 * Category types and their target image counts:
 *   main      → Mandatory carousels (Hôtel, Petit-déjeuner, Destination, Chambre) — target 6
 *   sub       → Sub-categories (Chambre, Restaurant, Bar, Salle de réunion, Hôtel) — target 4
 *   chef      → Chef only — target 1 image (not scored in HCM per current spec)
 *   optional  → Optional services (Spa, Fitness, etc.) — 0 images = no impact, ≥1 → target 6
 */
export type ImageCategoryType = 'main' | 'sub' | 'chef' | 'optional'

const IMAGE_TARGETS: Record<ImageCategoryType, number> = {
  main:     6,
  sub:      4,
  chef:     1,
  optional: 6,
}

/**
 * Score for a single image category (null = excluded from score calculation).
 * - optional with 0 images  → null  (no engagement = no impact)
 * - chef                    → null  (not scored in HCM)
 * - all others              → min(100, round(count / target × 100))
 */
export function calcImageScore(count: number, type: ImageCategoryType): number | null {
  if (type === 'chef') return null
  if (type === 'optional' && count === 0) return null
  return Math.min(100, Math.round((count / IMAGE_TARGETS[type]) * 100))
}

// ─── 2. Text Completion ────────────────────────────────────────────────────────

/**
 * Character targets per field.
 * A field is "complete" when it reaches ≥ 75 % of this target.
 */
export const TEXT_FIELD_TARGETS = {
  mainDescription:        400, // Hotel overview / main description
  seoDescription:         231, // SEO description
  directorMessage:        118, // Hotel manager message
  roomDescription:        111, // Room type description
  destinationDescription: 111, // Destination / local-area description
  globalRoomDescription:  111, // Global room description
} as const

/**
 * Coarse score for a single text field based on fill ratio:
 *   ≥ 75 % of target  →  100  ✅
 *   50–74 % of target →   75  ⚠️
 *   < 50 % of target  →   50  ❌
 */
export function calcTextScore(chars: number, target: number): 50 | 75 | 100 {
  const ratio = chars / target
  if (ratio >= 0.75) return 100
  if (ratio >= 0.50) return 75
  return 50
}

// ─── 3. Aggregation ───────────────────────────────────────────────────────────

/**
 * Average of an array of scores, ignoring null values.
 * null = category excluded from calculation (optional with 0 images, chef…).
 * Returns 0 if all values are null.
 */
export function avgScores(scores: (number | null)[]): number {
  const valid = scores.filter((s): s is number => s !== null)
  if (!valid.length) return 0
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
}

// ─── 4. Global Score ──────────────────────────────────────────────────────────

/**
 * Hotel global content score = average of the three dimensions.
 * @param content  Text completion score (0–100)
 * @param photos   Image completion score (0–100)
 * @param quality  Photo quality score — AI + human validation (0–100)
 */
export function calcGlobalScore(content: number, photos: number, quality: number): number {
  return Math.round((content + photos + quality) / 3)
}
