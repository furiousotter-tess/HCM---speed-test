import { getScoreLevel } from '../lib/scoreColors'

interface ScoreGaugeProps {
  pct: number
  height?: number
}

/**
 * Horizontal progress bar whose fill color is derived from the score level.
 * Replaces any hardcoded color logic — just pass the score percentage.
 */
export function ScoreGauge({ pct, height = 6 }: ScoreGaugeProps) {
  const level = getScoreLevel(pct)

  return (
    <div
      style={{
        height,
        background: '#EEF0F8',
        borderRadius: 4,
        overflow: 'hidden',
        flex: 1,
        width: '100%',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          height: '100%',
          background: level.main,
          borderRadius: 4,
          transition: 'width 0.3s',
        }}
      />
    </div>
  )
}
