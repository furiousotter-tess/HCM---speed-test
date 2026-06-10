import { useState } from 'react'
import { toast } from 'sonner'
import { getScoreLevel } from '../lib/scoreColors'
import { ScoreBadge } from '../components/ScoreBadge'
import { ScoreGauge } from '../components/ScoreGauge'
import { SearchInput } from '../components/SearchInput'
import { ScoreTooltip } from '../components/ScoreTooltip'

const NAVY = '#050033'

// ─── Semi-circle segmented gauge (filled = score color, empty = gray) ────────
function SemiGauge({ pct, size = 260, trend = null }) {
  const level  = getScoreLevel(pct)
  const cx     = size / 2
  const r      = size * 0.43
  const cy     = r + 8
  const svgH   = cy + 32

  const N      = 44
  const segW   = 5
  const segH   = 14
  const filled = Math.round((pct / 100) * N)

  return (
    <svg width={size} height={svgH} style={{ display: 'block', flexShrink: 0 }}>
      {Array.from({ length: N }, (_, i) => {
        const angleRad = Math.PI + ((i + 0.5) / N) * Math.PI
        const x        = cx + r * Math.cos(angleRad)
        const y        = cy + r * Math.sin(angleRad)
        const rotDeg   = (180 + (i + 0.5) / N * 180) - 90
        return (
          <rect
            key={i}
            x={-segW / 2} y={-segH / 2}
            width={segW} height={segH} rx={2}
            fill={i < filled ? level.main : '#E2E5EF'}
            transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rotDeg.toFixed(1)})`}
          />
        )
      })}
      {/* Status badge above score */}
      {(() => {
        const badgeY  = cy - r * 0.5 + 38
        const pillW   = 96
        const pillH   = 22
        return (
          <g>
            <rect x={cx - pillW / 2} y={badgeY - pillH / 2} width={pillW} height={pillH} rx={11} fill={level.bg} />
            <circle cx={cx - pillW / 2 + 14} cy={badgeY} r={4} fill={level.main} />
            <text x={cx - pillW / 2 + 22} y={badgeY} dominantBaseline="central"
              fill={level.text} fontSize={12} fontWeight={500} fontFamily="Roboto,sans-serif">
              {level.name}
            </text>
          </g>
        )
      })()}
      <text
        x={cx} y={cy - r * 0.5}
        textAnchor="middle" dominantBaseline="central"
        fill="#232136" fontSize={32} fontWeight={700} fontFamily="Montserrat,sans-serif"
      >
        {String(pct).replace('.', ',')}%
      </text>
      {trend && (
        <text
          x={cx} y={cy - r * 0.35 + 50}
          textAnchor="middle" dominantBaseline="central"
          fill="#22C55E" fontSize={13} fontWeight={500} fontFamily="Inter,sans-serif"
        >
          ▲ {trend}
        </text>
      )}
    </svg>
  )
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ value = 2.5, max = 5, size = 22 }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i < value ? '#F59E0B' : '#E5E7EB'} stroke={i < value ? '#F59E0B' : '#E5E7EB'} strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}

// ─── Trend label ──────────────────────────────────────────────────────────────
function Trend({ label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 13, fontWeight: 500 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
      {label}
    </span>
  )
}

// ─── Info icon ────────────────────────────────────────────────────────────────
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#232136" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'white', borderRadius: 8, border: '1px solid #EBEBF5', padding: 24, ...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children, info = false, scoreType = null, tooltipPlacement = 'bottom-left' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 4px' }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#232136', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>{children}</h3>
      {scoreType
        ? <ScoreTooltip scoreType={scoreType} placement={tooltipPlacement} />
        : info && <InfoIcon />
      }
    </div>
  )
}

function SubLabel({ children }) {
  return <p style={{ fontSize: 14, fontWeight: 400, color: '#5E5B73', margin: '0 0 16px', fontFamily: 'Roboto, sans-serif' }}>{children}</p>
}

// ─── KPI Detail panel ─────────────────────────────────────────────────────────
function KpiDetail({ kpi, isQuality }) {
  if (!kpi) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', margin: 0 }}>Click a KPI</p>
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>to see details</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 18, fontWeight: 500, color: '#38364D', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{kpi.name}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#232136' }}>
          {isQuality ? `${(kpi.pct / 20).toFixed(1)} / 5` : `${kpi.pct}%`}
        </span>
        <ScoreBadge score={kpi.pct} size="sm" />
      </div>

      <Trend label={kpi.trend} />

      {/* Improvement block — Figma 632:25008 */}
      <div style={{ background: '#F9F9FF', borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Badge header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 4, background: '#2D4CD5',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
            </span>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif' }}>Improvement</span>
          </div>
          {/* Insight text */}
          <p style={{ fontSize: 16, fontWeight: 400, color: '#5E5B73', margin: 0, lineHeight: 1.6, fontFamily: 'Roboto, sans-serif' }}>
            {kpi.insight}
          </p>
        </div>
        {/* Enhance now link */}
        <a href="#" onClick={e => e.preventDefault()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0051AE', fontSize: 14, fontWeight: 400, textDecoration: 'none', transition: 'opacity 0.15s', fontFamily: 'Roboto, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Enhance now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0051AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const KPIS_BY_TAB = [
  // Tab 0 — Content completion
  [
    { name: 'Hotel advantage',    pct: 72, trend: '+3.1 pts vs n-1', objective: 'Ensure the hotel advantage content is complete to highlight the property\'s unique selling points.', insight: 'Several advantage fields are partially filled. Complete them to better differentiate the hotel offer.', sub: [] },
    { name: 'Guestrooms',         pct: 64, trend: '+2.4 pts vs n-1', objective: 'Verify that guestroom descriptions are detailed enough to set accurate guest expectations.',          insight: 'Type description and surface fields are below target. Completing them will push this category above 80%.',
      sub: [
        { name: 'Type description', pct: 58, trend: '+1.8 pts vs n-1', objective: 'Ensure each room type has a complete and engaging description for guests.',           insight: 'Description length is below the required minimum for 3 room types. Aim for at least 150 characters per type.' },
        { name: 'Type',             pct: 80, trend: '+2.0 pts vs n-1', objective: 'Verify that all room types are correctly categorised and labelled.',                  insight: '2 room types are missing their category tag. Adding it will immediately improve discoverability.' },
        { name: 'Surface',          pct: 50, trend: '+0.5 pts vs n-1', objective: 'Check that surface area is filled in for all room types.',                            insight: 'Surface data is missing for half the room types. This is a quick win — fill in m² and ft² for each.' },
        { name: 'Max occupancy',    pct: 75, trend: '+3.0 pts vs n-1', objective: 'Ensure maximum occupancy is set for every room type to support booking accuracy.',    insight: '1 room type is missing its max occupancy value. A single update will bring this sub-category to 100%.' },
      ] },
    { name: 'Hotel description',  pct: 53, trend: '+1.6 pts vs n-1', objective: 'Measure the completeness of all hotel description fields used across channels.',                     insight: 'SEO and destination description fields have the most impact. Prioritise these to boost your score quickly.',
      sub: [
        { name: 'SEO description',         pct: 45, trend: '+1.2 pts vs n-1', objective: 'Ensure the SEO description is complete and keyword-optimised for search visibility.',    insight: 'The SEO description is under the recommended character count. Extend it to at least 160 characters for full impact.' },
        { name: 'Main description',        pct: 68, trend: '+2.5 pts vs n-1', objective: 'Verify the main hotel description is engaging and covers the property\'s key highlights.', insight: 'The main description is 70% of the target length. Adding a paragraph about the hotel\'s unique atmosphere will complete it.' },
        { name: 'Hotel manager message',   pct: 38, trend: '-0.4 pts vs n-1', objective: 'Check that the hotel manager message is personalised and complete.',                     insight: 'Only the opening sentence has been filled in. A full manager message adds a personal touch that improves conversion.' },
        { name: 'Destination description', pct: 60, trend: '+1.8 pts vs n-1', objective: 'Ensure the destination description helps guests understand the local area and attractions.', insight: 'Local transport and nearby attractions sections are incomplete. These are high-value fields for first-time visitors.' },
      ] },
  ],
  // Tab 1 — Media completion
  [
    { name: 'Bar',           pct: 80, trend: '+3.0 pts vs n-1', objective: 'Ensure the bar area has enough photos to attract guests interested in on-site drinks and dining.', insight: 'Carrousel is complete. Marcel and Tori Café & Bar are each missing 2 photos — add evening ambiance shots to reach 100%.',
      sub: [
        { name: 'Carrousel',        pct: 100, trend: '+0.0 pts vs n-1', objective: 'Verify the main bar carousel has the required 6 images.',               insight: 'All 6 required images are present. No action needed.' },
        { name: 'Marcel',           pct: 67,  trend: '+2.1 pts vs n-1', objective: 'Ensure Marcel has enough photos to highlight its cocktail offering.',    insight: '2 photos missing. An interior wide-shot and an evening ambiance shot are the priority.' },
        { name: 'Tori café & Bar',  pct: 50,  trend: '-0.5 pts vs n-1', objective: 'Ensure Tori Café & Bar is visually represented with at least 4 images.', insight: '2 of 4 required photos are missing. A bar counter close-up and a seating area shot are recommended.' },
      ] },
    { name: 'Bedroom',       pct: 65, trend: '+2.0 pts vs n-1', objective: 'Verify that all room types have sufficient photo coverage for guest decision-making.', insight: 'Suite Junior is critically under-represented. Room Deluxe and Room Superior each need 1 additional photo.',
      sub: [
        { name: 'Carrousel',     pct: 100, trend: '+0.0 pts vs n-1', objective: 'Verify the main bedroom carousel meets the 6-image requirement.',                    insight: 'All 6 required images present. No action needed.' },
        { name: 'Room Deluxe',   pct: 83,  trend: '+1.5 pts vs n-1', objective: 'Ensure Room Deluxe has complete photo coverage of all key features.',               insight: '1 photo missing — a bathroom detail shot would complete this room type.' },
        { name: 'Room Superior', pct: 67,  trend: '+2.5 pts vs n-1', objective: 'Verify Room Superior has enough images to set accurate guest expectations.',         insight: '2 photos missing. A wide bedroom shot and a view-from-window photo are recommended.' },
        { name: 'Suite Junior',  pct: 33,  trend: '-1.0 pts vs n-1', objective: 'Ensure Suite Junior is fully documented with a minimum of 6 images.',               insight: '4 of 6 required photos are missing. Prioritise a full-suite layout shot, bathroom, and living area.' },
      ] },
    { name: 'Breakfast',     pct: 95, trend: '+2.1 pts vs n-1', objective: 'Verify that breakfast visuals convey the quality and variety of the morning offering.', insight: '1 photo missing from the Carrousel — a wide buffet setup shot would complete this category.',
      sub: [
        { name: 'Carrousel', pct: 95, trend: '+2.1 pts vs n-1', objective: 'Ensure the breakfast carousel covers the buffet display, dining room and a detail shot.', insight: '1 image missing. A wide-angle shot of the full buffet layout is recommended.' },
      ] },
    { name: 'Fitness',       pct: 88, trend: '+1.5 pts vs n-1', objective: 'Check that fitness facilities are fully and attractively photographed.', insight: '1 photo of the cardio area is blurred. Replace it with a sharp, well-lit shot for a perfect score.',
      sub: [
        { name: 'Carrousel', pct: 88, trend: '+1.5 pts vs n-1', objective: 'Ensure the fitness carousel covers equipment, open floor space and natural light.', insight: '1 cardio area photo is blurred. A sharp replacement will bring this to 100%.' },
      ] },
    { name: 'Hotel',         pct: 88, trend: '+4.2 pts vs n-1', objective: 'Assess whether hotel exterior, lobby and common area photos are complete.', insight: 'Rooftop terrace photos are incomplete — 2 more images are needed to fulfil the requirement.',
      sub: [
        { name: 'Carrousel', pct: 88, trend: '+4.2 pts vs n-1', objective: 'Ensure the hotel carousel has images covering the exterior, lobby, pool and signature spaces.', insight: '2 rooftop terrace photos are missing. Add a day and a dusk shot to complete the set.' },
      ] },
    { name: 'Meeting Room',  pct: 62, trend: '+1.8 pts vs n-1', objective: 'Check that all meeting rooms and conference spaces are documented with at least 4 images each.', insight: 'Ron Mulock AO 2 and John Farragher Boardroom are critically incomplete. Carrousel and Woodrow Room are at full coverage.',
      sub: [
        { name: 'Carrousel',                  pct: 100, trend: '+0.0 pts vs n-1', objective: 'Verify the main meeting room carousel is complete.',                              insight: 'All required images present. No action needed.' },
        { name: 'Hunter Room',                pct: 75,  trend: '+2.0 pts vs n-1', objective: 'Ensure Hunter Room has a full photo set covering setup options.',                  insight: '1 photo missing — a boardroom-style setup shot is recommended.' },
        { name: 'Jamison Room',               pct: 75,  trend: '+1.5 pts vs n-1', objective: 'Verify Jamison Room has at least 4 photos including layout variations.',           insight: '1 photo missing. A classroom-layout shot would complete the set.' },
        { name: 'John Farragher Boardroom',   pct: 50,  trend: '-0.8 pts vs n-1', objective: 'Ensure the boardroom has photos covering the table, AV equipment and natural light.',insight: '2 photos missing. A wide boardroom shot and a detail of the AV setup are priorities.' },
        { name: 'Ron Mulock AO 2',            pct: 25,  trend: '-2.2 pts vs n-1', objective: 'Verify this room has a minimum photo set to support bookings.',                    insight: '3 of 4 required photos are missing. Urgent: add a full-room, a detail and a natural-light shot.' },
        { name: 'Woodrow Room',               pct: 100, trend: '+3.0 pts vs n-1', objective: 'Confirm the Woodrow Room photo coverage is complete.',                             insight: 'All required images present. No action needed.' },
        { name: 'WSCC 3A',                    pct: 50,  trend: '+0.5 pts vs n-1', objective: 'Ensure WSCC 3A has adequate coverage to support event bookings.',                  insight: '2 photos missing. A full-room overview and a detail of the partition wall are recommended.' },
        { name: 'WSCC 3B',                    pct: 50,  trend: '+0.5 pts vs n-1', objective: 'Ensure WSCC 3B has adequate coverage to support event bookings.',                  insight: '2 photos missing — mirror the photo set used for WSCC 3A.' },
      ] },
    { name: 'Restaurant',    pct: 82, trend: '+2.8 pts vs n-1', objective: 'Ensure the restaurant and its outlets are visually documented for guest appetite appeal.', insight: 'Carrousel is complete. Marcel is missing 2 photos — plated dish and interior ambiance shots are recommended.',
      sub: [
        { name: 'Carrousel', pct: 100, trend: '+0.0 pts vs n-1', objective: 'Verify the main restaurant carousel meets the 6-image requirement.',                    insight: 'All 6 required images present. No action needed.' },
        { name: 'Marcel',    pct: 64,  trend: '+3.5 pts vs n-1', objective: 'Ensure Marcel restaurant has photos covering ambiance, plated dishes and bar counter.', insight: '2 photos missing. A hero dish plating shot and a dining-room ambiance photo are top priorities.' },
      ] },
    { name: 'Service',       pct: 90, trend: '+1.2 pts vs n-1', objective: 'Ensure service and amenity areas are visually represented.', insight: 'Almost complete — 1 image is missing from the Carrousel. A signature service moment shot is recommended.',
      sub: [
        { name: 'Carrousel', pct: 90, trend: '+1.2 pts vs n-1', objective: 'Verify the service carousel covers key guest-facing service moments.', insight: '1 image missing. A concierge or in-room service action shot would complete this category.' },
      ] },
    { name: 'Suite',         pct: 55, trend: '+0.8 pts vs n-1', objective: 'Verify that suite accommodations are fully documented for premium guests.', insight: '3 of 6 required Carrousel images are missing. Bathroom, living area and view shots are the priority.',
      sub: [
        { name: 'Carrousel', pct: 55, trend: '+0.8 pts vs n-1', objective: 'Ensure the suite carousel covers all key areas: bedroom, bathroom, living space and view.', insight: '3 photos missing. Prioritise bathroom, separate living area and a signature view shot.' },
      ] },
  ],
  // Tab 2 — Photo quality
  [
    { name: 'Bar',           pct: 88, trend: '+2.5 pts vs n-1', objective: 'Assess the visual quality and brand alignment of all bar photography.', insight: 'Carrousel and Marcel are strong. Tori Café & Bar has 2 underexposed images that need reshooting.',
      sub: [
        { name: 'Carrousel',        pct: 95, trend: '+3.0 pts vs n-1', objective: 'Verify that carousel images are sharp, well-lit and brand-compliant.',             insight: 'All images meet resolution and brand standards. No action needed.' },
        { name: 'Marcel',           pct: 88, trend: '+2.0 pts vs n-1', objective: 'Ensure Marcel photos are professionally styled and brand-aligned.',                 insight: '1 cocktail close-up is slightly overexposed — a minor correction will bring this to 95%+.' },
        { name: 'Tori café & Bar',  pct: 62, trend: '-0.5 pts vs n-1', objective: 'Check that Tori Café & Bar images meet resolution and brand framing standards.',    insight: '2 images are underexposed. Reshoot during peak hours with better ambient lighting.' },
      ] },
    { name: 'Bedroom',       pct: 65, trend: '+1.2 pts vs n-1', objective: 'Evaluate bedroom imagery for resolution, composition and brand compliance.', insight: 'Suite Junior photography is below brand standards. Room Superior needs minor colour correction.',
      sub: [
        { name: 'Carrousel',     pct: 90, trend: '+2.0 pts vs n-1', objective: 'Verify main carousel images are sharp, well-composed and brand-compliant.',             insight: 'Strong set overall. 1 image has a slight white-balance issue — a quick correction is recommended.' },
        { name: 'Room Deluxe',   pct: 78, trend: '+1.5 pts vs n-1', objective: 'Ensure Room Deluxe photos reflect brand identity and premium positioning.',             insight: '1 image is not brand-compliant. Consult brand guidelines for framing and lighting standards.' },
        { name: 'Room Superior', pct: 60, trend: '+0.8 pts vs n-1', objective: 'Verify Room Superior imagery meets minimum resolution and composition standards.',       insight: '2 images require colour correction. The window shot is overexposed — reshoot with exposure control.' },
        { name: 'Suite Junior',  pct: 30, trend: '-1.8 pts vs n-1', objective: 'Ensure Suite Junior photography is professionally styled and brand-aligned.',           insight: 'Most photos are below quality threshold. A dedicated professional reshoot is strongly recommended.' },
      ] },
    { name: 'Breakfast',     pct: 76, trend: '+1.8 pts vs n-1', objective: 'Evaluate whether breakfast photos meet brand identity and lighting standards.', insight: '2 images from the Carrousel are flagged as low-light. Retaking in natural morning light will improve quality.',
      sub: [
        { name: 'Carrousel', pct: 76, trend: '+1.8 pts vs n-1', objective: 'Ensure the breakfast carousel is bright, welcoming and aligned with brand standards.', insight: '2 low-light images identified. Retaking during morning service in natural light will push quality above 90%.' },
      ] },
    { name: 'Fitness',       pct: 82, trend: '+2.0 pts vs n-1', objective: 'Check that fitness area photos meet resolution and brand framing standards.', insight: '1 image of the locker room is too dark — a brighter, cleaner replacement is recommended.',
      sub: [
        { name: 'Carrousel', pct: 82, trend: '+2.0 pts vs n-1', objective: 'Ensure fitness carousel images are sharp, well-lit and match the brand active lifestyle identity.', insight: '1 locker room photo is too dark. A brighter replacement will push quality above 90%.' },
      ] },
    { name: 'Hotel',         pct: 70, trend: '+0.9 pts vs n-1', objective: 'Check overall hotel photography quality against brand positioning standards.', insight: 'Lobby photos are strong, but exterior night shots are underexposed. Consider a professional reshoot.',
      sub: [
        { name: 'Carrousel', pct: 70, trend: '+0.9 pts vs n-1', objective: 'Verify that hotel carousel images cover key spaces at the right quality level.', insight: 'Exterior night shots are underexposed. A professional reshoot with proper lighting will significantly improve the score.' },
      ] },
    { name: 'Meeting Room',  pct: 72, trend: '+2.2 pts vs n-1', objective: 'Verify that all meeting room photos convey a professional and welcoming environment.', insight: 'Ron Mulock AO 2 and WSCC rooms have quality issues. Carrousel, Woodrow Room and Hunter Room are strong.',
      sub: [
        { name: 'Carrousel',                  pct: 95, trend: '+1.0 pts vs n-1', objective: 'Ensure main carousel images are professionally shot and brand-compliant.',           insight: 'Excellent quality. No action needed.' },
        { name: 'Hunter Room',                pct: 82, trend: '+2.5 pts vs n-1', objective: 'Check Hunter Room photos for sharpness, lighting and brand alignment.',              insight: '1 image is slightly dark. A brighter replacement will bring this room to 90%+.' },
        { name: 'Jamison Room',               pct: 78, trend: '+1.8 pts vs n-1', objective: 'Verify Jamison Room photos meet resolution and staging standards.',                  insight: '1 wide shot shows an unmade table. Restage and reshoot for brand compliance.' },
        { name: 'John Farragher Boardroom',   pct: 68, trend: '-0.5 pts vs n-1', objective: 'Ensure the boardroom is photographed at a quality level that reflects its premium status.', insight: '2 photos have insufficient resolution. Reshoot with a minimum 3700px target.' },
        { name: 'Ron Mulock AO 2',            pct: 48, trend: '-1.5 pts vs n-1', objective: 'Verify Ron Mulock AO 2 photos are sharp, well-lit and brand-compliant.',             insight: 'Most images are below threshold. A professional reshoot covering full-room, detail and AV setup is recommended.' },
        { name: 'Woodrow Room',               pct: 88, trend: '+3.2 pts vs n-1', objective: 'Confirm Woodrow Room image quality meets brand standards.',                          insight: 'Strong set. 1 image has a slight exposure issue — a quick colour correction is all that is needed.' },
        { name: 'WSCC 3A',                    pct: 65, trend: '+0.8 pts vs n-1', objective: 'Check WSCC 3A photos for lighting quality and professional presentation.',           insight: '2 images are overexposed. Reshoot with controlled lighting to reach brand-compliance.' },
        { name: 'WSCC 3B',                    pct: 65, trend: '+0.8 pts vs n-1', objective: 'Check WSCC 3B photos for lighting quality and professional presentation.',           insight: '2 images are overexposed — same issue as WSCC 3A. A joint reshoot session is recommended.' },
      ] },
    { name: 'Restaurant',    pct: 80, trend: '+3.0 pts vs n-1', objective: 'Assess restaurant photography for brand alignment, food styling and ambiance.', insight: 'Carrousel is strong. Marcel has 1 dish photo that is overlit — a quick correction will improve the score.',
      sub: [
        { name: 'Carrousel', pct: 92, trend: '+2.0 pts vs n-1', objective: 'Verify the main restaurant carousel meets quality and brand standards.',           insight: 'Excellent quality. No action needed.' },
        { name: 'Marcel',    pct: 68, trend: '+4.0 pts vs n-1', objective: 'Ensure Marcel food and ambiance photography is brand-aligned and professionally styled.', insight: '1 hero dish photo is overlit and lacks depth. A professional food stylist reshoot is recommended.' },
      ] },
    { name: 'Service',       pct: 85, trend: '+1.5 pts vs n-1', objective: 'Verify that service area images are sharp, welcoming and brand-aligned.', insight: '1 image in the Carrousel shows a staff member out of uniform — replace with a brand-compliant alternative.',
      sub: [
        { name: 'Carrousel', pct: 85, trend: '+1.5 pts vs n-1', objective: 'Ensure service carousel photos convey a high-end, welcoming experience.', insight: '1 image shows a staff member out of uniform. Replace to ensure brand compliance.' },
      ] },
    { name: 'Suite',         pct: 62, trend: '+1.0 pts vs n-1', objective: 'Evaluate suite photography for premium positioning, resolution and brand compliance.', insight: '2 Carrousel images are below the 3700px minimum resolution. A professional reshoot is recommended.',
      sub: [
        { name: 'Carrousel', pct: 62, trend: '+1.0 pts vs n-1', objective: 'Ensure suite carousel images convey the premium experience at the required resolution.', insight: '2 images are below the 3700px minimum. Reshoot the bathroom and view angles at full resolution.' },
      ] },
  ],
]

// ─── Worst entities across all tabs ──────────────────────────────────────────
const TAB_LABELS = ['Content', 'Media', 'Quality']

const WORST_ENTITIES = (() => {
  const all = []
  KPIS_BY_TAB.forEach((tab, tabIdx) => {
    tab.forEach(kpi => {
      all.push({ name: kpi.name, pct: kpi.pct, tab: TAB_LABELS[tabIdx], parent: null, insight: kpi.insight })
      kpi.sub?.forEach(s => {
        all.push({ name: s.name, pct: s.pct, tab: TAB_LABELS[tabIdx], parent: kpi.name, insight: s.insight })
      })
    })
  })
  const seen = new Set()
  const deduped = []
  for (const item of all.sort((a, b) => a.pct - b.pct)) {
    const key = `${item.tab}|${item.parent ?? ''}|${item.name}`
    if (!seen.has(key)) { seen.add(key); deduped.push(item) }
  }
  return deduped.slice(0, 4)
})()

// ─── Drawer: entities per tab sorted by score asc ────────────────────────────
const DRAWER_TABS = [
  { label: 'Content completion', tabIdx: 0 },
  { label: 'Photos completion',  tabIdx: 1 },
  { label: 'Quality score',      tabIdx: 2 },
]

const DRAWER_ENTITIES_BY_TAB = KPIS_BY_TAB.map(tab => {
  const all = []
  tab.forEach(kpi => {
    all.push({ name: kpi.name, pct: kpi.pct, parent: null, insight: kpi.insight })
    kpi.sub?.forEach(s => {
      all.push({ name: s.name, pct: s.pct, parent: kpi.name, insight: s.insight })
    })
  })
  return all.sort((a, b) => a.pct - b.pct)
})

// ─── Attention Drawer ─────────────────────────────────────────────────────────
function ActivityDrawer({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const entities = DRAWER_ENTITIES_BY_TAB[activeTab]

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5, 0, 51, 0.32)', zIndex: 1000 }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 673, background: 'white', zIndex: 1001,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '-4px 0 32px rgba(5,0,51,0.12)',
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ padding: '24px 28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: '#232136', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
              Critical Gaps
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="#16141F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div style={{ height: 1, background: '#D9DADC' }} />
          <div style={{ display: 'flex', gap: 0, padding: '0 28px', borderBottom: '1px solid #DADADD' }}>
            {DRAWER_TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '10px 16px',
                  fontSize: 14, fontWeight: activeTab === i ? 600 : 400,
                  color: activeTab === i ? '#252339' : '#5E5B73',
                  fontFamily: 'Inter, sans-serif',
                  borderBottom: activeTab === i ? '2px solid #252339' : '2px solid transparent',
                  marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 0.15s',
                }}
              >
                {tab.label}
                <span style={{
                  marginLeft: 6,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: activeTab === i ? '#EEF0FB' : '#F3F4F6',
                  color: activeTab === i ? '#2D4CD5' : '#6B7280',
                  borderRadius: 10, padding: '1px 7px', fontSize: 12, fontWeight: 500,
                }}>
                  {DRAWER_ENTITIES_BY_TAB[i].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Entity list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px 28px' }}>
          {entities.map((e, i) => {
            const level = getScoreLevel(e.pct)
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 0',
                  borderBottom: i < entities.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}
              >
                {/* Score pill */}
                <span style={{
                  flexShrink: 0, minWidth: 44, textAlign: 'center',
                  fontSize: 12, fontWeight: 700, color: level.text,
                  background: level.bg, borderRadius: 4, padding: '3px 7px', marginTop: 1,
                }}>
                  {e.pct}%
                </span>

                {/* Name + insight */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#232136', fontFamily: 'Roboto, sans-serif', marginBottom: 4 }}>
                    {e.parent ? `${e.parent} › ${e.name}` : e.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#5E5B73', fontFamily: 'Roboto, sans-serif', lineHeight: 1.5 }}>
                    {e.insight}
                  </div>
                </div>

                {/* Warning icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={level.main} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// pct drives ScoreBadge + ScoreGauge automatically.
// Photo quality uses starValue (2.5/5) → pct = starValue * 20 for scoring.
const TABS_META = [
  { title: 'Content completion', scoreType: 'content', tooltipPlacement: 'bottom-left',  pct: 51, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo completion',   scoreType: 'media',   tooltipPlacement: 'bottom-left',  pct: 92, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo quality',      scoreType: 'quality', tooltipPlacement: 'bottom-right', pct: 50, trend: null, stars: true, starValue: 2.5 },
]


// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab]     = useState(0)
  const [selectedKpi, setSelectedKpi] = useState(null)
  const [expandedKpi, setExpandedKpi] = useState(null)
  const [search, setSearch]           = useState('')
  const [sortBy, setSortBy]           = useState('alpha')
  const [hoveredTab, setHoveredTab]   = useState(null)
  const [drawerOpen, setDrawerOpen]   = useState(false)

  // Filtered + sorted KPI list derived from active tab
  const kpis = [...KPIS_BY_TAB[activeTab]]
    .filter(k => k.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'alpha')       return a.name.localeCompare(b.name)
      if (sortBy === 'score-desc')  return (b.pct ?? 0) - (a.pct ?? 0)
      if (sortBy === 'score-asc')   return (a.pct ?? 0) - (b.pct ?? 0)
      return 0
    })

  function handleTabChange(i) {
    setActiveTab(i)
    setSelectedKpi(null)
    setExpandedKpi(null)
    setSearch('')
  }

  function fireNonConformeToast(kpi) {
    const level = getScoreLevel(kpi.pct ?? 0)
    if (level.name === 'Non-compliant') {
      toast.error(`"${kpi.name}" is non-compliant (${kpi.pct}%) — immediate action required.`, {
        duration: 6000,
      })
    }
  }

  function handleKpiClick(kpi) {
    const isSame = selectedKpi?.name === kpi.name
    setSelectedKpi(isSame ? null : kpi)
    setExpandedKpi(isSame ? null : (kpi.sub?.length > 0 ? kpi.name : null))
    if (!isSame) fireNonConformeToast(kpi)
  }

  return (
    <div style={{ padding: '36px 40px', background: '#F7F9FB', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>Stay on top of your text and photo content with live scores, gap analysis and improvement insights.</p>
      </div>

      {/* Row 1 : Score + Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20 }}>

        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <CardTitle scoreType="global">Your total Score</CardTitle>
            <p style={{ fontSize: 14, fontWeight: 400, color: '#5E5B73', margin: '0 0 0', fontFamily: 'Roboto, sans-serif' }}>Updated on 12/02/2026</p>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24 }}>
            <SemiGauge pct={77.5} trend="+ 0.2 pts vs last month" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1835', margin: 0 }}>Good progress!</p>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Your score is above average. A few quick actions can boost it</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Critical Gaps</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WORST_ENTITIES.map((e, i) => {
              const level = getScoreLevel(e.pct)
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0',
                  borderBottom: i < WORST_ENTITIES.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}>
                  {/* Score pill */}
                  <span style={{
                    flexShrink: 0, minWidth: 40, textAlign: 'center',
                    fontSize: 12, fontWeight: 700, color: level.text,
                    background: level.bg, borderRadius: 4, padding: '2px 6px',
                  }}>
                    {e.pct}%
                  </span>
                  {/* Name + category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#232136', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.parent ? `${e.parent} › ${e.name}` : e.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{e.tab}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#0051AE', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, padding: 0, transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            View more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0051AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </Card>

      </div>

      {/* ── Unified block: tabs + KPI table + detail panel ── */}
      <div style={{ border: '1px solid #EBEBF5', borderRadius: 8, background: 'white', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>

        {/* Tab headers — 1 col each */}
        {TABS_META.map((tab, i) => {
          const active = activeTab === i
          return (
            <div
              key={i}
              onClick={() => handleTabChange(i)}
              onMouseEnter={() => setHoveredTab(i)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                padding: 24, cursor: 'pointer',
                background: active ? 'white' : hoveredTab === i ? '#F0F2FC' : '#F7F9FB',
                borderTop: '3px solid transparent',
                borderRight: i < 2 ? '1px solid #EBEBF5' : 'none',
                borderBottom: active ? 'none' : '1px solid #EBEBF5',
                position: 'relative', zIndex: active ? 1 : 0,
                marginBottom: active ? -1 : 0,
                display: 'flex', flexDirection: 'column',
                transition: 'background 0.15s',
              }}>
              <div style={{ marginBottom: 4 }}>
                <CardTitle scoreType={tab.scoreType} tooltipPlacement={tab.tooltipPlacement}>{tab.title}</CardTitle>
              </div>
              <SubLabel>Updated on 12/02/2026</SubLabel>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {!tab.stars && (
                  <>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#1A1835', margin: 0 }}>{tab.pct} %</p>
                    <ScoreBadge score={tab.pct} size="sm" />
                  </>
                )}
              </div>
              <div style={{ marginTop: 2, transform: tab.stars ? 'translateY(-10px)' : 'translateY(4px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                {tab.stars ? (
                  <>
                    <Stars value={tab.starValue} />
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1A1835' }}>{tab.starValue} / 5</span>
                    <ScoreBadge score={tab.pct} size="sm" />
                  </>
                ) : (
                  <ScoreGauge pct={tab.pct} />
                )}
              </div>
              {tab.trend && (
                <div style={{ marginTop: 8 }}>
                  <Trend label={tab.trend} />
                </div>
              )}
            </div>
          )
        })}

        {/* KPI table — span 2 cols */}
        <div style={{ gridColumn: 'span 2', borderTop: '1px solid #EBEBF5', borderRight: '1px solid #EBEBF5', minWidth: 0 }}>

            {/* Toolbar */}
            <div style={{ padding: '30px 24px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Click on each row to view details.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by KPI…"
                  width={160}
                  compact
                />

                {/* Sort */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}>
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{ appearance: 'none', border: '1px solid #DDDDE8', borderRadius: 6, padding: '6px 32px 6px 32px', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                  >
                    <option value="alpha">A → Z</option>
                    <option value="score-desc">Score: High to Low</option>
                    <option value="score-asc">Score: Low to High</option>
                  </select>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

              </div>
            </div>

            {/* KPI rows */}
            <div>
              {kpis.length === 0 && (
                <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                  No KPI matches "<strong>{search}</strong>"
                </div>
              )}
              {kpis.map((kpi, i) => {
                const isSelected = selectedKpi?.name === kpi.name
                const isExpanded = expandedKpi === kpi.name
                const hasSub = kpi.sub?.length > 0
                const isLast = i === kpis.length - 1

                return (
                  <div key={i}>
                    {/* Parent row */}
                    <div
                      onClick={() => handleKpiClick(kpi)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '11px 24px',
                        borderBottom: (!isExpanded && !isLast) ? '1px solid #F3F4F6' : 'none',
                        cursor: 'pointer',
                        background: isSelected ? '#EEF0FB' : 'transparent',
                        borderLeft: isSelected ? '3px solid #2D4CD5' : '3px solid transparent',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#FAFAFA' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* Chevron */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={isSelected ? '#2D4CD5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>

                      <span style={{ fontSize: 14, color: isSelected ? '#2D4CD5' : '#374151', fontWeight: isSelected ? 600 : 400, minWidth: 130 }}>
                        {kpi.name}
                      </span>

                      {kpi.empty
                        ? <span style={{ fontSize: 13, color: '#9CA3AF', flex: 1 }}>Empty</span>
                        : activeTab === 2
                          ? <Stars value={kpi.pct / 20} size={16} />
                          : <ScoreGauge pct={kpi.pct} />
                      }

                      <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#2D4CD5' : '#374151', minWidth: 40, textAlign: 'right' }}>
                        {activeTab === 2 ? `${(kpi.pct / 20).toFixed(1)}` : `${kpi.pct}%`}
                      </span>

                      {kpi.warning && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      )}
                    </div>

                    {/* Subcategory rows — animated with grid-template-rows trick */}
                    {hasSub && (
                      <div style={{
                        display: 'grid',
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <div style={{ overflow: 'hidden', minHeight: 0 }}>
                          <div style={{
                            background: '#FAFBFF',
                            borderBottom: !isLast ? '1px solid #F3F4F6' : 'none',
                          }}>
                            {kpi.sub.map((s, j) => {
                              const isSubSelected = selectedKpi?.name === s.name
                              return (
                                <div
                                  key={j}
                                  className={isExpanded ? 'sub-row-enter' : undefined}
                                  style={{
                                    animationDelay: isExpanded ? `${j * 40}ms` : '0ms',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    padding: '9px 24px 9px 52px',
                                    borderBottom: j < kpi.sub.length - 1 ? '1px solid #F0F0FA' : 'none',
                                    cursor: 'pointer',
                                    background: isSubSelected ? '#EEF0FB' : 'transparent',
                                    borderLeft: isSubSelected ? '3px solid #2D4CD5' : '3px solid transparent',
                                    transition: 'background 0.15s',
                                  }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    const next = isSubSelected ? null : s
                                    setSelectedKpi(next)
                                    if (next) fireNonConformeToast(s)
                                  }}
                                  onMouseEnter={e => { if (!isSubSelected) e.currentTarget.style.background = '#F3F4FF' }}
                                  onMouseLeave={e => { if (!isSubSelected) e.currentTarget.style.background = 'transparent' }}
                                >
                                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
                                    <circle cx="5" cy="5" r="3" fill={isSubSelected ? '#2D4CD5' : '#C4C4D4'} />
                                  </svg>
                                  <span style={{ fontSize: 13, color: isSubSelected ? '#2D4CD5' : '#5E5B73', fontWeight: isSubSelected ? 600 : 400, minWidth: 106 }}>{s.name}</span>
                                  {activeTab === 2 ? <Stars value={s.pct / 20} size={16} /> : <ScoreGauge pct={s.pct} />}
                                  <span style={{ fontSize: 13, fontWeight: 500, color: isSubSelected ? '#2D4CD5' : '#5E5B73', minWidth: 40, textAlign: 'right' }}>
                                    {activeTab === 2 ? `${(s.pct / 20).toFixed(1)}` : `${s.pct}%`}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        {/* Detail panel — 1 col (= same width as Photo quality tab) */}
        <div style={{ borderTop: '1px solid #EBEBF5', padding: 28 }}>
          <div key={selectedKpi?.name ?? '__empty__'} className="kpi-detail-enter" style={{ height: '100%' }}>
            <KpiDetail kpi={selectedKpi} isQuality={activeTab === 2} />
          </div>
        </div>

      </div>

      <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

    </div>
  )
}
