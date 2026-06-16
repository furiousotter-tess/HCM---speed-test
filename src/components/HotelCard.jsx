import { useState } from 'react'

const NAVY = '#050033'

function CircularGauge({ pct, size = 48 }) {
  const r    = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const fill = circ * (pct / 100)
  const cx   = size / 2
  const cy   = size / 2

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="white" strokeWidth={3}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx} y={cy + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={10} fontWeight={700}
        fontFamily="Roboto, sans-serif"
      >
        {pct}%
      </text>
    </svg>
  )
}

export default function HotelCard({ hotel, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const imgW = 265
  const imgH = Math.round(imgW * 3 / 4)

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 297,
        background: 'white',
        borderRadius: 6,
        border: `1px solid ${selected ? '#2D4CD5' : hovered ? '#A9A8BB' : '#DADADD'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
        flexShrink: 0,
        boxShadow: hovered ? '0 6px 20px rgba(5,0,51,0.09)' : '0 1px 3px rgba(5,0,51,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      <div style={{ padding: '16px 16px 0 16px', position: 'relative' }}>
        <div style={{
          width: imgW,
          height: imgH,
          background: hotel.img,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#EBEBF5',
          borderRadius: '6px 6px 24px 0px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 85% 85%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)',
            borderRadius: 'inherit',
          }} />

          {/* Selected badge */}
          {selected && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: '#2D4CD5', color: 'white',
              fontSize: 12, fontWeight: 500,
              padding: '3px 10px', borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'Roboto, sans-serif',
            }}>
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Selected
            </div>
          )}

          {/* Gauge */}
          <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <CircularGauge pct={hotel.score} size={48} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px 16px 16px' }}>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 16, fontWeight: 400, color: '#38364D', margin: 0, marginBottom: 4 }}>
          {hotel.brand}
        </p>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 16, fontWeight: 500, color: '#232136', margin: 0, marginBottom: 8, lineHeight: 1.3 }}>
          {hotel.code} {hotel.name}
        </p>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, fontWeight: 400, color: '#5E5B73', margin: 0 }}>
          {hotel.updated}
        </p>
      </div>
    </div>
  )
}
