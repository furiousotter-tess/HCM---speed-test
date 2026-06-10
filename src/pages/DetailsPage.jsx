import { useState, useRef, useEffect } from 'react'
import { ScoreGauge } from '../components/ScoreGauge'
import { ScoreBadge } from '../components/ScoreBadge'

// ─── Sub-components ────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1264A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1264A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1264A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="#068484" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Figma 633:9275 — bg #F7F5FF, r:40, padding 0/8, h:24, gap:4, icon lightbulb 16px #2D4CD5, text Roboto 16 fw:500 #2D4CD5
function ImprovementBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#F7F5FF', borderRadius: 40,
      padding: '0 8px', height: 24, flexShrink: 0,
      fontSize: 16, fontWeight: 400, color: '#2D4CD5',
      fontFamily: 'Roboto, sans-serif',
    }}>
      {/* ads.bulb-s — lightbulb 16×16 */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D4CD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
      </svg>
      Improve it
    </span>
  )
}

// ─── Card block ───────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children, onEdit }) {
  return (
    <div style={{
      background: 'white', borderRadius: 8, border: '1px solid #EBEBF5',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F7F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#252339', fontFamily: 'Roboto, sans-serif' }}>{title}</span>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid #DDDDE8', borderRadius: 60, background: 'white',
            padding: '8px 14px', cursor: 'pointer', fontSize: 14, color: '#1E1852',
            fontFamily: 'Roboto, sans-serif', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F7F5FF'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          <EditIcon />
          Edit
        </button>
      </div>
      {/* Separator */}
      <div style={{ height: 1, background: '#D9D9D9', margin: '0 20px' }} />
      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Room description drawer — Figma 695:1219490 ──────────────────────────────
function RoomDescriptionDrawer({ open, onClose, onConfirm }) {
  const [roomName, setRoomName] = useState('Standard Room')
  const [description, setDescription] = useState('Choose comfort and space. 258 ft² fully equipped rooms. Queen bed, sofa, WIFI, 55" smart TV, wooden floor, mini-bar, free tea/coffee. Your choice if traveling for work or leisure.')
  const [isDirty, setIsDirty] = useState(false)

  function handleRoomName(v) { setRoomName(v); setIsDirty(true) }
  function handleDescription(v) { setDescription(v); setIsDirty(true) }
  function handleConfirm() { onConfirm(); setIsDirty(false); onClose() }

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5,0,51,0.32)', zIndex: 1000 }} />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 673,
        background: 'white', zIndex: 1001,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-4px 0 32px rgba(5,0,51,0.12)',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: '#252339', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
            Room descriptions
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#16141F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{ height: 1, background: '#DADADD', flexShrink: 0 }} />

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Room type name input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#3E3D48', fontFamily: 'Roboto, sans-serif' }}>Room type name</span>
                </div>
                <span style={{ fontSize: 14, color: '#6F6E77', fontFamily: 'Roboto, sans-serif' }}>Enter the room name - 55 max characters</span>
                <input
                  type="text"
                  value={roomName}
                  onChange={e => handleRoomName(e.target.value)}
                  maxLength={55}
                  style={{ width: '100%', height: 48, border: '1px solid #8B8A93', borderRadius: 6, padding: '12px 16px', fontSize: 16, color: '#3E3D48', fontFamily: 'Roboto, sans-serif', background: 'white', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#2D4CD5'}
                  onBlur={e => e.target.style.borderColor = '#8B8A93'}
                />
              </div>
              {/* Translation link */}
              <a href="#" onClick={e => e.preventDefault()} title="Validated translations"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#1264A3', fontSize: 16, textDecoration: 'none', fontFamily: 'Roboto, sans-serif' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g transform="translate(1,2)">
                    <path fillRule="nonzero" fill="#0051AE" d="M8.337 14.51 L11.786 5.51 L12.995 5.51 L16.444 14.51 L15.3 14.51 L14.415 12.156 L10.353 12.156 L9.468 14.51 Z M1.784 12.209 L1.091 11.492 L5.027 7.59 C4.514 7.038 4.017 6.446 3.536 5.816 C3.055 5.186 2.698 4.613 2.466 4.097 L3.682 4.097 C3.87 4.482 4.133 4.901 4.472 5.356 C4.811 5.811 5.22 6.305 5.699 6.841 C6.405 6.077 6.986 5.385 7.443 4.764 C7.9 4.143 8.26 3.448 8.524 2.679 L0 2.679 L0 1.68 L5.257 1.68 L5.257 0 L6.256 0 L6.256 1.68 L11.51 1.68 L11.51 2.679 L9.656 2.679 C9.368 3.603 8.954 4.422 8.415 5.138 C7.876 5.854 7.196 6.664 6.374 7.567 L8.198 9.378 L7.794 10.411 L5.699 8.32 L1.784 12.209 Z M10.723 11.174 L14.042 11.174 L12.424 6.883 Z"/>
                  </g>
                </svg>
                Validated translations
              </a>
            </div>

            {/* Room description textarea */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#3E3D48', fontFamily: 'Roboto, sans-serif' }}>Room description</span>
              </div>
              <span style={{ fontSize: 14, color: '#6F6E77', fontFamily: 'Roboto, sans-serif' }}>Enter the room description - 1200 max characters</span>
              <textarea
                value={description}
                onChange={e => handleDescription(e.target.value)}
                maxLength={1200}
                rows={5}
                style={{ width: '100%', border: '1px solid #8B8A93', borderRadius: 6, padding: '12px 16px', fontSize: 16, color: '#3E3D48', fontFamily: 'Roboto, sans-serif', background: 'white', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#2D4CD5'}
                onBlur={e => e.target.style.borderColor = '#8B8A93'}
              />
              {/* Char count */}
              <span style={{ fontSize: 14, color: '#2D4CD5', fontFamily: 'Roboto, sans-serif', textAlign: 'right', display: 'block' }}>
                {description.length} / 1200 chars · {Math.min(100, Math.round(description.length / 102 * 100))}% rule
              </span>
            </div>

            {/* Improve your description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 24, height: 24, borderRadius: 4, background: '#2D4CD5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                  </svg>
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif' }}>Improve your description</span>
              </div>

              {/* Opportunity card */}
              <div style={{ background: '#F7F5FF', borderRadius: 6, padding: '16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#002EB9', fontFamily: 'Roboto, sans-serif' }}>+ 2 %</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif' }}>Room description</span>
                <p style={{ fontSize: 16, fontWeight: 400, color: '#38364D', margin: 0, lineHeight: 1.6, fontFamily: 'Roboto, sans-serif' }}>
                  Your description is too short. Enter a score of at least 102 characters to achieve an excellent score in your referent language (English).
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ height: 1, background: '#DADADD' }} />
          <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="#" onClick={e => { e.preventDefault(); onClose() }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1264A3', fontSize: 16, textDecoration: 'none', fontFamily: 'Roboto, sans-serif' }}>
              Cancel
            </a>
            <button
              disabled={!isDirty}
              onClick={handleConfirm}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: isDirty ? '#2D4CD5' : '#DADADD',
                border: 'none', borderRadius: 60,
                color: isDirty ? 'white' : '#8B8A93',
                fontSize: 16, fontWeight: 400, fontFamily: 'Roboto, sans-serif',
                padding: '8px 20px',
                cursor: isDirty ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (isDirty) e.currentTarget.style.background = '#1E3AB8' }}
              onMouseLeave={e => { if (isDirty) e.currentTarget.style.background = '#2D4CD5' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDirty ? 'white' : '#8B8A93'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Confirm
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

// ─── Text row (label + value) ──────────────────────────────────────────────────
function DataRow({ label, value, translate }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#3E3D48', fontFamily: 'Roboto, sans-serif' }}>{label}</span>
        {translate && (
          <a href="#" onClick={e => e.preventDefault()}
            title="Translations"
            style={{ color: '#1264A3', textDecoration: 'none', display: 'flex', alignItems: 'center', lineHeight: 0 }}>
            {/* Translate icon — Figma 847:330502, filled #0051AE */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g transform="translate(1,2)">
                <path fillRule="nonzero" fill="#0051AE" d="M8.337 14.51 L11.786 5.51 L12.995 5.51 L16.444 14.51 L15.3 14.51 L14.415 12.156 L10.353 12.156 L9.468 14.51 Z M1.784 12.209 L1.091 11.492 L5.027 7.59 C4.514 7.038 4.017 6.446 3.536 5.816 C3.055 5.186 2.698 4.613 2.466 4.097 L3.682 4.097 C3.87 4.482 4.133 4.901 4.472 5.356 C4.811 5.811 5.22 6.305 5.699 6.841 C6.405 6.077 6.986 5.385 7.443 4.764 C7.9 4.143 8.26 3.448 8.524 2.679 L0 2.679 L0 1.68 L5.257 1.68 L5.257 0 L6.256 0 L6.256 1.68 L11.51 1.68 L11.51 2.679 L9.656 2.679 C9.368 3.603 8.954 4.422 8.415 5.138 C7.876 5.854 7.196 6.664 6.374 7.567 L8.198 9.378 L7.794 10.411 L5.699 8.32 L1.784 12.209 Z M10.723 11.174 L14.042 11.174 L12.424 6.883 Z"/>
              </g>
            </svg>
          </a>
        )}
      </div>
      <p style={{ fontSize: 16, fontWeight: 400, color: '#3E3D48', fontFamily: 'Roboto, sans-serif', margin: 0, lineHeight: 1.6 }}>
        {value}
      </p>
    </div>
  )
}

// ─── "New" badge (field à compléter) ─────────────────────────────────────────
function NewBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: '#EEF0FB', borderRadius: 20,
      padding: '0 7px', height: 18,
      fontSize: 12, fontWeight: 400, color: '#2D4CD5',
      fontFamily: 'Roboto, sans-serif', flexShrink: 0,
    }}>New</span>
  )
}

// ─── Checked item (occupancy, extra beds, etc.) ────────────────────────────────
function CheckItem({ label, value, isNew = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 240 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 3, background: 'white',
        border: `1.5px solid ${isNew ? '#C9C7DE' : '#068484'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
      }}>
        {!isNew && <CheckIcon />}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#3E3D48', fontFamily: 'Roboto, sans-serif' }}>{label}</p>
          {isNew && <NewBadge />}
        </div>
        <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 400, color: isNew ? '#9CA3AF' : '#3E3D48', fontFamily: 'Roboto, sans-serif' }}>{value}</p>
      </div>
    </div>
  )
}

// ─── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#252339', margin: '0 0 6px', fontFamily: 'Montserrat, sans-serif' }}>{title}</h2>
        <p style={{ fontSize: 14, color: '#252339', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{subtitle}</p>
      </div>
      <a href="#" onClick={e => e.preventDefault()}
        style={{ fontSize: 14, color: '#1264A3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        I need to update data that's not listed here. <ChevronRight />
      </a>
    </div>
  )
}

// ─── Section separator ─────────────────────────────────────────────────────────
function SectionSep() {
  return <div style={{ height: 1, background: '#DADADD', margin: '32px 0' }} />
}

// ─── Icons for section cards ───────────────────────────────────────────────────
function DocTextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function BedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 14h20"/>
      <path d="M6 8v6"/><path d="M18 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
    </svg>
  )
}

function RulerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3H3L3 21h18V3z" strokeLinejoin="round"/>
      <path d="M8 3v4M16 3v4M3 8h4M3 16h4M12 3v2M3 12h2"/>
    </svg>
  )
}

function ShowerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16v8H4z"/>
      <path d="M6 12V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7"/>
      <line x1="4" y1="20" x2="4" y2="22"/><line x1="20" y1="20" x2="20" y2="22"/>
    </svg>
  )
}

function TvIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
      <polyline points="17 2 12 7 7 2"/>
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  )
}

function AccessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1852" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3"/>
      <path d="M6 22v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"/>
    </svg>
  )
}

// ─── Description Page ──────────────────────────────────────────────────────────
const TABS = [
  { label: 'General information', count: 24 },
  { label: 'Bathroom', count: 24 },
  { label: 'Room services', count: 24 },
  { label: 'Other characteristics', count: 24 },
]

export default function DetailsPage({ element, onBack }) {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [hasPendingPublish, setHasPendingPublish] = useState(false)
  const [tabsSticky, setTabsSticky] = useState(false)
  const tabsRef = useRef(null)
  const sectionRefs = useRef([])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setTabsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-68px 0px 0px 0px' }
    )
    if (tabsRef.current) observer.observe(tabsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target)
            if (idx !== -1) setActiveTab(idx)
          }
        })
      },
      { rootMargin: '-68px 0px -60% 0px', threshold: 0 }
    )
    sectionRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const el = element ?? {
    name: 'Hotel - General',
    content: 64,
    photos: 88,
    quality: 70,
    img: '/photos/Hote_general.png',
  }

  return (
    <div style={{ background: '#F7F9FB', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sub-header (white) — Figma 629:23380 ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #D9DADC' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '24px 56px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Row 1: [Back + Title] left / [Status + date] right ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>

            {/* Left: back link stacked above title row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1264A3', fontSize: 16, fontFamily: 'Roboto, sans-serif' }}
              >
                <BackArrow /> Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {el.img && (
                  <div style={{ position: 'relative', width: 96, height: 72, flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.querySelector('.photo-overlay').style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.querySelector('.photo-overlay').style.opacity = 0}
                  >
                    <div style={{
                      width: 96, height: 72, borderRadius: 8,
                      backgroundImage: `url(${el.img})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      border: '1px solid #EBEBF5',
                    }} />
                    <div className="photo-overlay" style={{
                      position: 'absolute', inset: 0, borderRadius: 8,
                      background: 'rgba(5,0,51,0.48)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.18s',
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'white', fontFamily: 'Roboto, sans-serif', letterSpacing: '0.04em' }}>Media</span>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1E1852', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
                    {el.name}
                  </h1>
                  <a href="#" onClick={e => e.preventDefault()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#1264A3', fontSize: 14, textDecoration: 'none', fontFamily: 'Roboto, sans-serif' }}>
                    <ExternalLinkIcon />
                    View page on Accor.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right: published status + last updated + publish button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#117846', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 500, color: '#117846', fontFamily: 'Roboto, sans-serif' }}>Published</span>
              </div>
              <span style={{ fontSize: 14, color: '#6F6E77', fontFamily: 'Roboto, sans-serif' }}>Last updated 1 year ago</span>
              <button
                disabled={!hasPendingPublish}
                onClick={() => setHasPendingPublish(false)}
                style={{
                  display: 'flex', alignItems: 'center',
                  background: hasPendingPublish ? '#2D4CD5' : '#DADADD',
                  border: 'none', borderRadius: 100,
                  color: hasPendingPublish ? 'white' : '#8B8A93',
                  fontFamily: 'Roboto, sans-serif',
                  padding: '10px 20px', cursor: hasPendingPublish ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s', marginTop: 8,
                }}
                onMouseEnter={e => { if (hasPendingPublish) e.currentTarget.style.background = '#1E3AB8' }}
                onMouseLeave={e => { if (hasPendingPublish) e.currentTarget.style.background = '#2D4CD5' }}
              >
                <span style={{ fontSize: 15, fontWeight: 400 }}>Publish modifications</span>
              </button>
            </div>
          </div>

          {/* ── Row 2: Score block ── */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#9896A4', fontFamily: 'Roboto, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completion score</p>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#5E5B73', fontFamily: 'Roboto, sans-serif' }}>{el.content}%</span>
              <ScoreBadge score={el.content} size="sm" />
            </div>
            <div style={{ width: 280 }}>
              <ScoreGauge pct={el.content} height={6} />
            </div>
          </div>

          {/* ── Tabs + Search ── */}
          <div ref={tabsRef} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '0 -20px' }}>
            <div style={{ display: 'flex' }}>
              {TABS.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '12px 20px',
                    position: 'relative',
                    color: activeTab === i ? '#2D4CD5' : '#5E5B73',
                    fontFamily: 'Inter, sans-serif',
                    borderBottom: activeTab === i ? '2px solid #2D4CD5' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, visibility: 'hidden', display: 'block', height: 0, overflow: 'hidden' }}>
                    {tab.label}
                    <span style={{ marginLeft: 5, fontSize: 13 }}>({tab.count})</span>
                  </span>
                  <span style={{ fontSize: 14, fontWeight: activeTab === i ? 600 : 400 }}>{tab.label}</span>
                  <span style={{ marginLeft: 5, fontSize: 13, color: '#6F6E77' }}>({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Search in fields */}
            <div style={{ position: 'relative', marginBottom: 12, flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8" stroke="#38364D" strokeWidth="1.8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#38364D" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search in fields"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: 224, height: 40,
                  border: '1px solid #8B8A93', borderRadius: 6,
                  background: 'white',
                  padding: '10px 12px 10px 38px',
                  fontSize: 14, fontWeight: 400, color: '#3E3D48',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#2D4CD5'}
                onBlur={e => e.target.style.borderColor = '#8B8A93'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky tabs (visible only when original tabs scroll out of view) ── */}
      <div style={{
        position: 'fixed', top: 68, left: 68, right: 0, zIndex: 100,
        background: 'white', borderBottom: '1px solid #D9DADC',
        transform: tabsSticky ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.2s ease',
      }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 20px',
                  position: 'relative',
                  color: activeTab === i ? '#2D4CD5' : '#5E5B73',
                  fontFamily: 'Inter, sans-serif',
                  borderBottom: activeTab === i ? '2px solid #2D4CD5' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, visibility: 'hidden', display: 'block', height: 0, overflow: 'hidden' }}>
                  {tab.label}
                  <span style={{ marginLeft: 5, fontSize: 13 }}>({tab.count})</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: activeTab === i ? 600 : 400 }}>{tab.label}</span>
                <span style={{ marginLeft: 5, fontSize: 13, color: '#6F6E77' }}>({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '32px 40px 60px' }}>

        {/* ── Section 1: General informations ── */}
        <div ref={el => sectionRefs.current[0] = el}>
        <SectionTitle
          title="General informations"
          subtitle="Update your Room descriptions, Occupancy, Extra beds, Room size and other general informations"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <SectionCard icon={<DocTextIcon />} title="Room description" onEdit={() => setEditDrawerOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
              <DataRow label="Room type name" value="Standard Room" />
              <ImprovementBadge />
            </div>
            <div style={{ height: 1, background: '#D9D9D9', margin: '0 0 12px' }} />
            <DataRow label="Room description" translate
              value={'Choose comfort and space. 258 ft² fully equipped rooms. Queen bed, sofa, WIFI, 55" smart TV, wooden floor, mini-bar, free tea/coffee. Your choice if traveling for work or leisure.'}
            />
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Room descriptions for brand website">
            <div style={{ marginBottom: 12 }}>
              <DataRow label="Room type name" value="Standard Room" />
            </div>
            <div style={{ height: 1, background: '#D9D9D9', margin: '0 0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <DataRow label="Room description" translate
                value={'Choose comfort and space. 258 ft² fully equipped rooms. Queen bed, sofa, WIFI, 55" smart TV, wooden floor, mini-bar, free tea/coffee. Your choice if traveling for work or leisure.'}
              />
              <ImprovementBadge />
            </div>
          </SectionCard>

          <SectionCard icon={<PeopleIcon />} title="Occupancy">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CheckItem label="Max. number of persons" value="2" />
              <CheckItem label="Maximum number of adults" value="2" />
              <CheckItem label="Maximum number of children" value="1" />
              <CheckItem label="Maximum number of babies" value="1" />
            </div>
          </SectionCard>

          <SectionCard icon={<BedIcon />} title="Extra beds">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CheckItem label="Extra bed in room for adult on request" value="No" />
              <CheckItem label="Extra bed in room for child on request" value="No" />
              <CheckItem label="Extra bed in room for baby on request" value="No" />
            </div>
          </SectionCard>

          <SectionCard icon={<RulerIcon />} title="Room size">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CheckItem label="Room size from (m²)" value="24 m²" />
              <CheckItem label="Room size from (ft²)" value="258 ft²" />
            </div>
          </SectionCard>

          <SectionCard icon={<AccessIcon />} title="Other general informations">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CheckItem label="View" value="City View" />
              <CheckItem label="Accessible room" value="No" />
              <CheckItem label="Smoking room" value="To be completed" isNew />
              <CheckItem label="Turn down services" value="To be completed" isNew />
            </div>
          </SectionCard>

        </div>

        </div>{/* end section 1 */}

        <SectionSep />

        {/* ── Section 2: Bathroom ── */}
        <div ref={el => sectionRefs.current[1] = el}>
        <SectionTitle
          title="Bathroom"
          subtitle="Update your Bathroom structure and Bathrooms equipments"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <SectionCard icon={<ShowerIcon />} title="Bathroom structure">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <CheckItem label="Bathroom type" value="Private bathroom" />
              <CheckItem label="Bathtub" value="No" />
              <CheckItem label="Toilets" value="Yes" />
              <CheckItem label="Bathroom accessibility" value="To be completed" isNew />
              <CheckItem label="Bathing fixture type" value="To be completed" isNew />
              <CheckItem label="Separate closet" value="To be completed" isNew />
            </div>
          </SectionCard>

          <SectionCard icon={<ShowerIcon />} title="Bathroom equipments">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free bathroom facilities"
                value="Bathroom doors 32 inches wide, Accessible bathroom, Hair dryer in bathroom, Radio, Bathroom products"
              />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Charged bathroom facilities" value="No" />
            </div>
          </SectionCard>

        </div>

        </div>{/* end section 2 */}

        <SectionSep />

        {/* ── Section 3: Room services ── */}
        <div ref={el => sectionRefs.current[2] = el}>
        <SectionTitle
          title="Room services"
          subtitle="Update your Television facilities, Phone facilities, Internet facilities, Devices, Alarm, Food and beverage, Amenties and Working area"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <SectionCard icon={<TvIcon />} title="Television facilities">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="TV Technology" value="Flat screen" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Minimum size of TV" value="55'/140 cm screen" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Free TV facilities" value="Web TV, Children's TV Channels, Music TV channels, Satellite/cable colour TV" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Charged TV facilities" value="To be completed" />
                <NewBadge />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Phone facilities">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free phone facilities" value="Direct dial telephone" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Charged phone facilities" value="To be completed" />
                <NewBadge />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<WifiIcon />} title="Internet facilities">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free internet facilities" value="Wireless internet in your room, High speed internet" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Charged internet facilities" value="To be completed" />
                <NewBadge />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<TvIcon />} title="Devices">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free devices facilities" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Charged devices facilities" value="No" />
            </div>
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Alarm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free devices facilities" value="Operator wake up call" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Charged devices facilities" value="No" />
            </div>
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Food and beverage">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Hot drink machines in room" value="Coffee/tea making facilities" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Drink facilities" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Minibar" value="Minibar in room" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Breakfast in bed" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Room service full menu" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Bottled water" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Kettle" value="Yes" />
            </div>
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Amenties">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Free room amenities" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Charged room amenities" value="No" />
            </div>
          </SectionCard>

          <SectionCard icon={<RulerIcon />} title="Working area">
            <DataRow label="Desk information" value="Business Desk" />
          </SectionCard>

        </div>

        </div>{/* end section 3 */}

        <SectionSep />

        {/* ── Section 4: Others ── */}
        <div ref={el => sectionRefs.current[3] = el}>
        <SectionTitle
          title={'Others caracteristic for "Standard room"'}
          subtitle="Update the Accessibility and security, Room environement and Distribution"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <SectionCard icon={<AccessIcon />} title="Accebility and security">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Room security"
                value="Message alert, Safe deposit box in room, Sprinkler in room, Keycard-operated door locks, Emergency info in rooms, Smoke alarm in room, Security Peephole, Audible smoke alarms in rooms, Dead bolt in rooms"
              />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Room complementary accessibility" value="To be completed" />
                <NewBadge />
              </div>
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Room accessibility for hearing umpaired" value="To be completed" />
                <NewBadge />
              </div>
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <DataRow label="Bed accessibility disposition" value="To be completed" />
                <NewBadge />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<RulerIcon />} title="Room environement">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="Air Conditioning" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Temperature setting" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Room facilitites"
                value="Blackout curtain, Double Glazing, Soundproof doors, Hair dryer in Bathroom, Blackout Facilities, Opening windows, Soundproof room"
              />
            </div>
          </SectionCard>

          <SectionCard icon={<DocTextIcon />} title="Distribution">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DataRow label="TARS Code" value="1598" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Classification" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Standing type" value="No" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Distribution channels" value="All distribution channels" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Order of display on the web" value="3" />
              <div style={{ height: 1, background: '#D9D9D9' }} />
              <DataRow label="Room quantity" value="25" />
            </div>
          </SectionCard>

        </div>

        </div>{/* end section 4 */}

        {/* ── Can't find your data? ── */}
        <div style={{
          marginTop: 40,
          background: 'white', borderRadius: 8, border: '1px solid #EBEBF5',
          padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#252339', margin: '0 0 8px', fontFamily: 'Montserrat, sans-serif' }}>
              Can't find your data ?
            </h3>
            <p style={{ fontSize: 16, color: '#252339', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
              You can request an update from ACCOR Customer Service.
            </p>
          </div>
          <button style={{
            background: '#068484', border: 'none', borderRadius: 6,
            color: 'white', fontSize: 16, fontWeight: 400, fontFamily: 'Roboto, sans-serif',
            padding: '12px 24px', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#057070'}
            onMouseLeave={e => e.currentTarget.style.background = '#068484'}
          >
            ACCOR support
          </button>
        </div>

      </div>

      <RoomDescriptionDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onConfirm={() => setHasPendingPublish(true)}
      />

    </div>
  )
}
