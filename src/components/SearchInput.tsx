import { useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  /** explicit pixel width; omit to let the parent control width */
  width?: number | string
  /** compact = tighter padding + smaller font, for constrained spaces like the dashboard */
  compact?: boolean
}

function SearchIcon({ size }: { size: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#8B8A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#8B8A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  width,
  compact = false,
}: SearchInputProps) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const iconSize  = compact ? 14 : 16
  const fontSize  = compact ? 13 : 14
  const padV      = compact ? 6  : 10
  const padH      = 12

  const borderColor = focused ? '#2D4CD5' : hovered ? '#6B6A99' : '#8B8A93'
  const boxShadow   = focused ? '0 0 0 3px rgba(45,76,213,0.07)' : 'none'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'white',
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        padding: `${padV}px ${padH}px`,
        width: width ?? '100%',
        boxSizing: 'border-box',
        boxShadow,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
      <SearchIcon size={iconSize} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize,
          color: '#3E3D48',
          width: '100%',
          fontFamily: 'Roboto, sans-serif',
          lineHeight: 1.4,
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            border: 'none', background: 'none', cursor: 'pointer',
            padding: 0, display: 'flex', flexShrink: 0,
          }}
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}
