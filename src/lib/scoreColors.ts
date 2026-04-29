/**
 * Score color system — 5 criticality levels
 *
 * CSS variable naming: --Score-{Level}-{shade}
 *   100 → light background  (bg)
 *   500 → main accent color (main)
 *   900 → dark text color   (text)
 *
 * Figma token path: Score/{Level}/100 | /500 | /900
 */

export interface ScoreLevel {
  /** Display name shown in badges */
  name: string
  /** Inclusive [min, max] percentage range */
  range: readonly [number, number]
  /** /500 — main accent color */
  main: string
  /** /100 — light background tint */
  bg: string
  /** /900 — dark text color */
  text: string
  /** CSS variable prefix, e.g. "Score-Excellence" */
  cssVarPrefix: string
}

export const SCORE_LEVELS = [
  {
    name: 'Excellence',
    range: [80, 100] as const,
    main: '#4ECDA8',
    bg: '#DCFCE7',
    text: '#14532D',
    cssVarPrefix: 'Score-Excellence',
  },
  {
    name: 'Advanced',
    range: [60, 79] as const,
    main: '#4EC2CD',
    bg: '#CFFAFE',
    text: '#164E63',
    cssVarPrefix: 'Score-Avance',
  },
  {
    name: 'Compliant',
    range: [40, 59] as const,
    main: '#F59E0B',
    bg: '#FEF3C7',
    text: '#78350F',
    cssVarPrefix: 'Score-Conforme',
  },
  {
    name: 'Essential',
    range: [20, 39] as const,
    main: '#EA580C',
    bg: '#FFEDD5',
    text: '#7C2D12',
    cssVarPrefix: 'Score-Essentiel',
  },
  {
    name: 'Non-compliant',
    range: [0, 19] as const,
    main: '#DC2626',
    bg: '#FEE2E2',
    text: '#7F1D1D',
    cssVarPrefix: 'Score-NonConforme',
  },
] as const satisfies readonly ScoreLevel[]

/**
 * Returns the matching ScoreLevel for a given score (0–100).
 * Falls back to "Non conforme" for out-of-range values.
 */
export function getScoreLevel(score: number): ScoreLevel {
  return (
    SCORE_LEVELS.find((l) => score >= l.range[0] && score <= l.range[1]) ??
    SCORE_LEVELS[SCORE_LEVELS.length - 1]
  )
}
