import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getScoreLevel, SCORE_LEVELS } from '../lib/scoreColors'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md'
}

function ScoreLegendTooltip({ anchorRef }: { anchorRef: React.RefObject<HTMLSpanElement> }) {
  const rect = anchorRef.current?.getBoundingClientRect()
  if (!rect) return null

  const TOOLTIP_W = 272
  const GAP = 8
  // Prefer showing above; if not enough room, show below
  const spaceAbove = rect.top
  const showAbove = spaceAbove > 160
  const top    = showAbove ? rect.top - GAP : rect.bottom + GAP
  const left   = Math.max(8, rect.left + rect.width / 2 - TOOLTIP_W / 2)

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 99999,
        width: TOOLTIP_W,
        background: 'white',
        border: '1px solid #EBEBF5',
        borderRadius: 8,
        boxShadow: '0 4px 24px rgba(5,0,51,0.12)',
        padding: '12px 14px',
        pointerEvents: 'none',
        transform: showAbove ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: '#232136', margin: '0 0 10px', fontFamily: 'Inter, sans-serif' }}>
        Score legend
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {SCORE_LEVELS.map(level => (
          <div key={level.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Badge pill */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '2px 10px', borderRadius: 100,
              background: level.bg, color: level.text,
              fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
              fontFamily: 'Roboto, sans-serif', flexShrink: 0,
            }}>
              {level.name}
            </span>
            {/* Range */}
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Roboto, sans-serif', flexShrink: 0 }}>
              {level.range[0]}–{level.range[1]}%
            </span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  )
}

/**
 * Displays the level name (e.g. "Excellence") as a pill badge.
 * Hovering shows the full score legend tooltip.
 */
export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const level = getScoreLevel(score)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const show = useCallback(() => setHovered(true),  [])
  const hide = useCallback(() => setHovered(false), [])

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: size === 'sm' ? '3px 10px' : '4px 14px',
          borderRadius: 100,
          background: level.bg,
          color: level.text,
          fontSize: size === 'sm' ? 12 : 14,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          fontFamily: 'Roboto, sans-serif',
          cursor: 'default',
        }}
      >
        {level.name}
      </span>
      {hovered && <ScoreLegendTooltip anchorRef={ref} />}
    </>
  )
}
