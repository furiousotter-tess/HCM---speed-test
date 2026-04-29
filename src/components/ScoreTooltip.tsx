import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export type ScoreType = 'global' | 'content' | 'media' | 'quality'
export type Placement = 'bottom-left' | 'bottom-right'

interface ScoreTooltipProps {
  scoreType: ScoreType
  placement?: Placement
}

// ─── Tooltip content definitions ──────────────────────────────────────────────
interface TooltipData {
  title: string
  description: string
  rules?: Array<{ condition: string; score: string }>
  thresholds?: string[]
  scale?: Array<{ label: string; pts: string }>
  note?: string
}

const CONTENT: Record<ScoreType, TooltipData> = {
  global: {
    title: 'Global Score',
    description:
      'Average of all scores: text content, photo completion, and photo quality.',
  },
  content: {
    title: 'Content Completion',
    description:
      'Measures how well text fields are filled relative to a character target, per language.',
    rules: [
      { condition: '> 75% filled', score: '100%' },
      { condition: '50–75% filled', score: '75%' },
      { condition: '0–50% filled', score: '50%' },
      { condition: 'Empty', score: '0%' },
    ],
  },
  media: {
    title: 'Media Completion',
    description:
      'Average of image scores across the main carousel and all subcategories.',
    thresholds: [
      'Hotel / Breakfast / Destination / Room → min 6 images',
      'Bedroom, Restaurant, Bar, Meeting room → min 4 images',
      'Chef category → min 1 image',
      'Format: JPG / PNG / TIFF · 4:3 landscape ratio',
    ],
  },
  quality: {
    title: 'Photo Quality',
    description:
      'An AI model rates each photo. Final score = probability-weighted sum.',
    scale: [
      { label: 'Excellent', pts: '10 pts' },
      { label: 'Good', pts: '7.5 pts' },
      { label: 'Fair', pts: '5 pts' },
      { label: 'Poor', pts: '2.5 pts' },
      { label: 'Bad', pts: '0 pt' },
    ],
    note: 'Min resolution: 3,700 px',
  },
}

// ─── InfoIcon ─────────────────────────────────────────────────────────────────
function InfoIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#232136" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ─── ScoreTooltip ─────────────────────────────────────────────────────────────
export function ScoreTooltip({ scoreType, placement = 'bottom-left' }: ScoreTooltipProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ bottom: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const data = CONTENT[scoreType]

  // Compute fixed coordinates from the trigger's bounding rect
  const computeCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const TOOLTIP_W = 284
    const GAP = 10
    const left =
      placement === 'bottom-right'
        ? rect.right - TOOLTIP_W
        : rect.left
    // anchor the tooltip's bottom edge just above the trigger
    setCoords({ bottom: window.innerHeight - rect.top + GAP, left })
  }, [placement])

  function show() {
    computeCoords()
    setOpen(true)
  }
  function hide() { setOpen(false) }

  // Close on outside click / tap and on scroll
  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        hide()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    window.addEventListener('scroll', hide, true)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      window.removeEventListener('scroll', hide, true)
    }
  }, [open])

  const arrowOffset = placement === 'bottom-right' ? 'auto' : '4px'
  const arrowRight  = placement === 'bottom-right' ? '4px'  : 'auto'

  return (
    <div
      ref={triggerRef}
      style={{ display: 'inline-flex', flexShrink: 0, cursor: 'default' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={e => { e.stopPropagation(); open ? hide() : show() }}
    >
      <InfoIcon />

      {open && coords && createPortal(
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            bottom: coords.bottom,
            left: coords.left,
            zIndex: 99999,
            width: 284,
            background: 'white',
            border: '1px solid #EBEBF5',
            borderRadius: 8,
            boxShadow: '0 4px 24px rgba(5, 0, 51, 0.12)',
            padding: '14px 16px',
            pointerEvents: 'none',
          }}
        >
          {/* Arrow — points downward toward the trigger */}
          <div style={{
            position: 'absolute',
            bottom: -5,
            left: arrowOffset,
            right: arrowRight,
            width: 9, height: 9,
            background: 'white',
            border: '1px solid #EBEBF5',
            borderLeft: 'none',
            borderTop: 'none',
            transform: 'rotate(45deg)',
          }} />

          {/* Title */}
          <p style={{ fontSize: 13, fontWeight: 600, color: '#232136', margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>
            {data.title}
          </p>

          {/* Description */}
          <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.55, fontFamily: 'Roboto, sans-serif' }}>
            {data.description}
          </p>

          {/* Fill-ratio rules */}
          {data.rules && (
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
              {data.rules.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: i < data.rules!.length - 1 ? 5 : 0, fontFamily: 'Roboto, sans-serif' }}>
                  <span style={{ color: '#6B7280' }}>{r.condition}</span>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{r.score}</span>
                </div>
              ))}
            </div>
          )}

          {/* Media thresholds */}
          {data.thresholds && (
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {data.thresholds.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: '#6B7280', lineHeight: 1.45, fontFamily: 'Roboto, sans-serif' }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quality scale */}
          {data.scale && (
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
              {data.scale.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: i < data.scale!.length - 1 ? 5 : 0, fontFamily: 'Roboto, sans-serif' }}>
                  <span style={{ color: '#6B7280' }}>{s.label}</span>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{s.pts}</span>
                </div>
              ))}
              {data.note && (
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: '8px 0 0', fontFamily: 'Roboto, sans-serif' }}>
                  {data.note}
                </p>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
