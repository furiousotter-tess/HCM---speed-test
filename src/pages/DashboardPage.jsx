import { useState } from 'react'
import { toast } from 'sonner'
import { getScoreLevel } from '../lib/scoreColors'
import { calcImageScore, calcTextScore, avgScores } from '../lib/scoring'
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
  <div style={{ position: 'relative', width: size, flexShrink: 0 }}>
    <svg width={size} height={svgH} style={{ display: 'block' }}>
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
      <text
        x={cx} y={cy - r * 0.5 + 20}
        textAnchor="middle" dominantBaseline="central"
        fill="#232136" fontSize={32} fontWeight={700} fontFamily="Montserrat,sans-serif"
      >
        {String(pct).replace('.', ',')}%
      </text>
    </svg>
    {trend && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: -24 }}>
        <Trend label={trend} />
      </div>
    )}
  </div>
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

function CardTitle({ children, info = false, scoreType = null, tooltipPlacement = 'bottom-left', icon = null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 4px' }}>
      {icon}
      <h3 style={{ fontSize: 16, fontWeight: 500, color: '#232136', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{children}</h3>
      {scoreType
        ? <ScoreTooltip scoreType={scoreType} placement={tooltipPlacement} />
        : info && <InfoIcon />
      }
    </div>
  )
}

function SubLabel({ children }) {
  return <p style={{ fontSize: 14, fontWeight: 400, color: '#898C8E', margin: '0 0 24px', fontFamily: 'Roboto, sans-serif' }}>{children}</p>
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
      <p style={{ fontSize: 16, fontWeight: 700, color: '#38364D', margin: 0, fontFamily: 'Roboto, sans-serif' }}>{kpi.name}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: '#232136' }}>
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
            <span style={{ fontSize: 14, fontWeight: 700, color: '#232136', fontFamily: 'Roboto, sans-serif' }}>Improvement</span>
          </div>
          {/* Insight text */}
          <p style={{ fontSize: 14, fontWeight: 400, color: '#5E5B73', margin: 0, lineHeight: 1.6, fontFamily: 'Roboto, sans-serif' }}>
            {kpi.insight}
          </p>
        </div>
        {/* Improve now link */}
        <a href="#" onClick={e => e.preventDefault()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0051AE', fontSize: 14, fontWeight: 400, textDecoration: 'none', transition: 'opacity 0.15s', fontFamily: 'Roboto, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Improve it
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0051AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

// ─── Scoring helpers (thin wrappers + KPI builders) ──────────────────────────
const IS  = (count, imgType) => calcImageScore(count, imgType)
const TS  = (chars, target) => calcTextScore(chars, target)
const AV  = scores => avgScores(scores)

function makeContentKpi(name, subsRaw, trend, objective, insight) {
  const sub = subsRaw.map(s => ({ ...s, pct: TS(s.chars, s.target) }))
  return { name, pct: AV(sub.map(s => s.pct)), trend, objective, insight, sub }
}

function makePhotoKpi(name, subsRaw, trend, objective, insight) {
  const sub = subsRaw.map(s => {
    const scored = IS(s.count, s.imgType)
    return { ...s, pct: scored ?? 0, _scored: scored }
  })
  return { name, pct: AV(sub.map(s => s._scored)), trend, objective, insight, sub }
}

function makeQualityKpi(name, sub, trend, objective, insight) {
  return { name, pct: AV(sub.map(s => s.pct)), trend, objective, insight, sub }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Targets (chars): main description 400 · SEO 231 · director message 118 · room/destination 111
// Targets (images): mandatory carousel 6 · sub-category 4 · optional (if tracked) 6
const KPIS_BY_TAB = [
  // ── Tab 0: Content completion ────────────────────────────────────────────────
  [
    makeContentKpi('Hotel overview',
      [
        { name: 'Hotel description',             chars: 240, target: 400, trend: '+2.5 pts vs last month', objective: 'Verify the main hotel description is engaging and covers the property\'s key highlights.', insight: 'The main description is 60% of the target length. Adding a paragraph about the hotel\'s unique atmosphere will complete it.' },
        { name: 'Hotel SEO description',         chars:  85, target: 231, trend: '+1.2 pts vs last month', objective: 'Ensure the SEO description is complete and keyword-optimised for search visibility.',    insight: 'The SEO description is under the recommended character count. Extend it to at least 160 characters for full impact.' },
        { name: 'Hotel manager message',         chars:  42, target: 118, trend: '-0.4 pts vs last month', objective: 'Check that the hotel manager message is personalised and complete.',                     insight: 'Only the opening sentence has been filled in. A full manager message adds a personal touch that improves conversion.' },
        { name: 'Hotel Destination description', chars:  90, target: 111, trend: '+1.8 pts vs last month', objective: 'Ensure the destination description helps guests understand the local area and attractions.', insight: 'Local transport and nearby attractions sections are incomplete. These are high-value fields for first-time visitors.' },
      ],
      '+1.6 pts vs last month',
      'Measure the completeness of all hotel description fields used across channels.',
      'SEO and destination description fields have the most impact. Prioritise these to boost your score quickly.',
    ),
    makeContentKpi('Rooms & accommodations',
      [
        { name: 'Room type description',   chars: 75, target: 111, trend: '+2.4 pts vs last month', objective: 'Ensure each room type has a complete and engaging description for guests.',        insight: 'Description length is below the minimum for 3 room types. Aim for at least 111 characters per type.' },
        { name: 'Global room description', chars: 57, target: 111, trend: '+1.5 pts vs last month', objective: 'Verify that the global room description covers all key amenities and services.',   insight: 'The global room description reaches 51% of the target. Add a section on room features and service options to complete it.' },
      ],
      '+2.4 pts vs last month',
      'Verify that room descriptions are detailed enough to set accurate guest expectations.',
      'Room description fields are below target. Completing them will push this category above 80%.',
    ),
  ],
  // ── Tab 1: Photo completion ──────────────────────────────────────────────────
  // count = current images · imgType: main(target 6) | sub(target 4) | optional(target 6, 0=no impact)
  [
    makePhotoKpi('Hotel',
      [
        { name: 'Hotel overview',          count: 5, imgType: 'main',     trend: '+1.5 pts vs last month', objective: 'Verify hotel overview photos cover exterior, lobby and key spaces.', insight: '1 photo missing — add a wide exterior shot for full coverage.' },
        { name: 'Services',                count: 4, imgType: 'sub',      trend: '+2.0 pts vs last month', objective: 'Ensure all guest services are visually documented.',                 insight: 'Services section is complete. Maintain coverage with any new service launches.' },
        { name: 'Hotel advantages',        count: 4, imgType: 'sub',      trend: '+1.8 pts vs last month', objective: 'Ensure hotel advantage areas are illustrated with quality photos.',   insight: 'Section is complete. Consider refreshing images seasonally.' },
        { name: 'Sustainable development', count: 2, imgType: 'optional', trend: '-0.5 pts vs last month', objective: 'Document sustainable initiatives visually to highlight eco-commitments.', insight: 'Most photos are missing. Add images of green initiatives, recycling points and energy-saving installations.' },
        { name: 'Photos of your guest',    count: 5, imgType: 'optional', trend: '+3.0 pts vs last month', objective: 'Capture authentic guest experience moments to boost emotional engagement.', insight: '1 lifestyle photo missing. Focus on guests enjoying the pool, spa and dining areas.' },
        { name: 'Label',                   count: 3, imgType: 'optional', trend: '+0.8 pts vs last month', objective: 'Ensure all certified labels are visually supported with compliant imagery.', insight: 'Several label visuals are missing. Add official imagery for each certification held by the property.' },
      ],
      '+2.1 pts vs last month',
      'Ensure all hotel-level photo categories are fully covered.',
      'Sustainable development and Label sections are critically under-represented.',
    ),
    makePhotoKpi('Restaurant & Breakfast',
      [
        { name: 'Restaurant type',     count: 3, imgType: 'sub',  trend: '+0.5 pts vs last month', objective: 'Document each restaurant type with clear, appetising imagery.',                  insight: '1 restaurant type photo is missing. Show brasserie and à la carte options clearly.' },
        { name: 'Restaurant overview', count: 5, imgType: 'main', trend: '+2.0 pts vs last month', objective: 'Verify the restaurant overview set covers ambiance, dining room and plated dishes.', insight: '1 photo missing — an interior wide-angle shot is recommended.' },
        { name: 'Chef',                count: 2, imgType: 'sub',  trend: '+1.0 pts vs last month', objective: 'Ensure chef photos are professionally styled and reflect brand identity.',        insight: '1 portrait is missing — add a shot in the kitchen environment.' },
        { name: 'Anecdote',            count: 2, imgType: 'sub',  trend: '+0.0 pts vs last month', objective: 'Check that anecdote visuals are storytelling-focused and on-brand.',             insight: 'Section under-documented. Work with a food stylist to create compelling shots.' },
        { name: 'Breakfast',           count: 5, imgType: 'main', trend: '+3.1 pts vs last month', objective: 'Ensure breakfast visuals showcase variety, ambiance and quality.',                insight: '1 photo missing — a wide buffet setup shot would complete this section.' },
      ],
      '+2.5 pts vs last month',
      'Ensure dining and breakfast areas are fully documented for guest decision-making.',
      'Overall completion is strong.',
    ),
    makePhotoKpi('Bars',
      [
        { name: 'Le Pondichery', count: 4, imgType: 'main', trend: '+1.8 pts vs last month', objective: 'Ensure Le Pondichery bar has a full set of photos covering counter, seating and signature cocktails.', insight: '2 photos missing. Add a bar counter close-up and an evening ambiance photo.' },
      ],
      '+1.8 pts vs last month',
      'Ensure bar areas are visually compelling and fully documented.',
      'Le Pondichery is missing several key shots.',
    ),
    makePhotoKpi('Rooms & Accommodations',
      [
        { name: 'Rooms overview',                                    count: 5, imgType: 'main', trend: '+2.0 pts vs last month', objective: 'Ensure the rooms overview carousel covers all key room categories.', insight: '1 photo missing — a wide room layout shot is recommended.' },
        { name: 'Chambre Classique - 2 lits simples',                count: 3, imgType: 'sub',  trend: '+1.5 pts vs last month', objective: 'Verify this room type has photos covering bed, bathroom and view.',  insight: '1 photo missing — a bathroom detail shot would complete coverage.' },
        { name: 'Junior Suite Privilège - 1 canapé-lit 2 personnes', count: 2, imgType: 'sub',  trend: '-0.5 pts vs last month', objective: 'Ensure the Junior Suite is fully documented for premium guests.',    insight: '2 photos missing. Prioritise the living area and a bathroom wide shot.' },
        { name: 'Chambre Privilège - 1 lit double',                  count: 3, imgType: 'sub',  trend: '+2.0 pts vs last month', objective: 'Verify Chambre Privilège photos cover all guest touchpoints.',       insight: '1 photo missing — add a window view shot.' },
        { name: 'Chambre Privilège, terrasse - 1 lit double',        count: 3, imgType: 'sub',  trend: '+1.8 pts vs last month', objective: 'Ensure the terrace is visually featured as a key selling point.',    insight: '1 photo missing — a terrace lifestyle shot with outdoor furniture is recommended.' },
        { name: 'Chambre privilège vue Tour Eiffel',                  count: 4, imgType: 'sub',  trend: '+3.0 pts vs last month', objective: 'Make the Eiffel Tower view the hero of this room\'s photo set.',   insight: 'Section is complete. Refresh night view shots annually.' },
        { name: 'Chambre standard accessible avec 1 lit double',     count: 2, imgType: 'sub',  trend: '-1.0 pts vs last month', objective: 'Ensure accessibility features are clearly documented visually.',     insight: '2 photos missing. Document wheelchair access and adapted bathroom in detail.' },
        { name: 'Chambre standard avec 1 lit double',                count: 3, imgType: 'sub',  trend: '+1.2 pts vs last month', objective: 'Verify the standard room has a complete and attractive photo set.',  insight: '1 photo missing — add a bathroom shot.' },
        { name: 'Suite',                                             count: 2, imgType: 'sub',  trend: '+0.8 pts vs last month', objective: 'Ensure the suite is fully documented for high-value guests.',        insight: '2 photos missing. Prioritise the living area and a signature view shot.' },
      ],
      '+1.5 pts vs last month',
      'Verify all room types are fully documented with quality photo coverage.',
      'Several room types are critically under-represented. Junior Suite and accessible room need urgent attention.',
    ),
    makePhotoKpi('Wellness',
      [
        { name: 'Spa',      count: 4, imgType: 'optional', trend: '+2.5 pts vs last month', objective: 'Ensure the spa section has photos covering treatment rooms, pool and relaxation areas.', insight: '2 photos missing — add a treatment room detail and relaxation pool shot.' },
        { name: 'Thalasso', count: 2, imgType: 'optional', trend: '-1.2 pts vs last month', objective: 'Visually document the thalasso facilities to highlight their unique offerings.',         insight: '4 photos missing. This is a key differentiator — prioritise a full photo set urgently.' },
        { name: 'Institut', count: 4, imgType: 'optional', trend: '+0.5 pts vs last month', objective: 'Ensure the beauty institute is attractively and completely documented.',                  insight: '2 photos missing. Add a reception area shot and a treatment close-up.' },
      ],
      '+1.2 pts vs last month',
      'Document all wellness facilities to attract health-conscious guests.',
      'Thalasso is critically incomplete. Institut needs additional coverage.',
    ),
    makePhotoKpi('Pool',
      [
        { name: 'Pool overview', count: 5, imgType: 'optional', trend: '+2.8 pts vs last month', objective: 'Verify the pool overview covers the full area, sunbeds and water features.', insight: '1 photo missing — a wide aerial or elevated shot of the pool area is recommended.' },
      ],
      '+2.8 pts vs last month',
      'Ensure pool areas are visually appealing and fully covered.',
      '1 photo missing from the pool overview set.',
    ),
    makePhotoKpi('Leisure',
      [
        { name: 'Fitness overview', count: 5, imgType: 'optional', trend: '+2.0 pts vs last month', objective: 'Verify the fitness overview covers all key equipment and open-floor space.', insight: '1 photo missing — a natural light action shot is recommended.' },
        { name: 'Salle fitness',    count: 3, imgType: 'optional', trend: '+1.5 pts vs last month', objective: 'Ensure the fitness room is fully documented with equipment detail shots.',   insight: '3 photos missing — add a cardio zone and a weights area shot.' },
        { name: 'Famille',          count: 3, imgType: 'optional', trend: '-0.8 pts vs last month', objective: 'Visually highlight family-friendly facilities and activities.',               insight: '3 photos missing. Add photos of kids\' club, family pool area and activity spaces.' },
        { name: 'Golf',             count: 3, imgType: 'optional', trend: '+0.5 pts vs last month', objective: 'Document the golf facilities to attract sports-oriented guests.',             insight: '3 photos missing. Prioritise a course overview, putting green and clubhouse shot.' },
      ],
      '+1.5 pts vs last month',
      'Ensure all leisure facilities are documented to boost guest engagement.',
      'Famille and Golf sections are the weakest areas.',
    ),
    makePhotoKpi('Surrounding',
      [
        { name: 'Destination', count: 3, imgType: 'sub', trend: '+2.0 pts vs last month', objective: 'Illustrate the destination with iconic and aspirational imagery.', insight: '1 photo missing — add a city skyline shot.' },
      ],
      '+2.0 pts vs last month',
      'Ensure the hotel\'s destination is well documented with iconic and aspirational imagery.',
      '1 photo missing from the Destination section.',
    ),
    makePhotoKpi('Meetings & Events',
      [
        { name: 'Overview',  count: 5, imgType: 'main', trend: '+2.0 pts vs last month', objective: 'Verify the meetings overview showcases the full range of event spaces.',          insight: '1 photo missing — a wide setup shot covering multiple rooms is recommended.' },
        { name: 'Dupleix',   count: 3, imgType: 'sub',  trend: '+1.5 pts vs last month', objective: 'Ensure Dupleix room is documented for corporate and social events.',               insight: '1 photo missing — a classroom or theatre-style setup shot is recommended.' },
        { name: 'Eiffel',    count: 4, imgType: 'sub',  trend: '+3.0 pts vs last month', objective: 'Highlight the Eiffel room with its view as a premium event selling point.',        insight: 'Section is complete. Feature the Eiffel view prominently in all marketing.' },
        { name: 'Affaires',  count: 2, imgType: 'sub',  trend: '+0.5 pts vs last month', objective: 'Document the Affaires space for business meetings and corporate events.',          insight: '2 photos missing — add a boardroom and a detail shot of AV equipment.' },
        { name: 'Mariages',  count: 3, imgType: 'sub',  trend: '+1.0 pts vs last month', objective: 'Showcase the hotel\'s wedding and celebration event capabilities visually.',       insight: '1 photo missing. Add a decorated ceremony space shot.' },
      ],
      '+2.2 pts vs last month',
      'Ensure all meeting and event spaces are professionally documented.',
      'Affaires section needs additional coverage.',
    ),
  ],

  // ── Tab 2: Photo quality ─────────────────────────────────────────────────────
  // pct values are AI + human validation scores (0–100), not computed from counts
  [
    makeQualityKpi('Hotel',
      [
        { name: 'Hotel overview',           pct: 88, trend: '+2.0 pts vs last month', objective: 'Verify hotel overview photos meet brand resolution and framing standards.',   insight: '1 image has a slight overexposure issue — a quick correction is recommended.' },
        { name: 'Services',                 pct: 70, trend: '+1.5 pts vs last month', objective: 'Ensure service photos are sharp, well-lit and brand-compliant.',              insight: '2 images are below resolution threshold. Reshoot under controlled lighting.' },
        { name: 'Hotel advantages',         pct: 78, trend: '+2.2 pts vs last month', objective: 'Check that hotel advantage photos reflect premium brand positioning.',         insight: '1 image has a composition issue — reframe to better showcase the advantage.' },
        { name: 'Sustainable development',  pct: 40, trend: '-0.5 pts vs last month', objective: 'Ensure eco-initiative photos are clear, authentic and brand-aligned.',         insight: 'Most existing images are poorly lit. A dedicated reshoot with natural light is strongly recommended.' },
        { name: 'Photos of your guest',     pct: 62, trend: '+2.5 pts vs last month', objective: 'Verify guest lifestyle photos are authentic, diverse and brand-compliant.',   insight: '2 images look staged. Replace with more natural, spontaneous lifestyle shots.' },
        { name: 'Label',                    pct: 45, trend: '+0.8 pts vs last month', objective: 'Ensure label visuals meet certification display standards.',                   insight: 'Several label images are low-resolution. Source official high-res assets from the certifying bodies.' },
      ],
      '+1.8 pts vs last month',
      'Assess the visual quality and brand compliance of all hotel-level photography.',
      'Sustainable development and Label visuals are below quality threshold.',
    ),
    makeQualityKpi('Restaurant & Breakfast',
      [
        { name: 'Restaurant type',     pct: 65, trend: '+1.0 pts vs last month', objective: 'Verify each restaurant type is photographed with consistent styling and brand alignment.', insight: '1 image has inconsistent framing. Apply uniform composition guidelines for brand coherence.' },
        { name: 'Restaurant overview', pct: 82, trend: '+2.5 pts vs last month', objective: 'Verify restaurant overview images are well-composed and brand-compliant.',    insight: '1 image is slightly underexposed — a brightness correction will improve quality.' },
        { name: 'Chef',                pct: 55, trend: '+1.0 pts vs last month', objective: 'Ensure chef photos are professionally styled and reflect brand identity.',    insight: '1 portrait has a distracting background. Reshoot with a clean kitchen backdrop.' },
        { name: 'Anecdote',            pct: 48, trend: '-0.3 pts vs last month', objective: 'Check that anecdote visuals are storytelling-focused and on-brand.',           insight: 'Images lack narrative depth. Work with a food stylist to create more compelling shots.' },
        { name: 'Breakfast',           pct: 85, trend: '+3.0 pts vs last month', objective: 'Ensure breakfast photos are bright, welcoming and appetising.',               insight: '1 image taken in low light — retake during morning service for better brightness.' },
      ],
      '+2.0 pts vs last month',
      'Evaluate dining photography for brand alignment, food styling and lighting quality.',
      'Chef portraits and Anecdote visuals are below brand standards.',
    ),
    makeQualityKpi('Bars',
      [
        { name: 'Le Pondichery', pct: 65, trend: '+1.5 pts vs last month', objective: 'Ensure Le Pondichery photos are sharp, well-lit and brand-aligned.', insight: '2 images are underexposed. Reshoot during evening service with ambient lighting reinforced by professional equipment.' },
      ],
      '+1.5 pts vs last month',
      'Assess bar photography for brand alignment, lighting quality and visual appeal.',
      'Le Pondichery has several images below quality threshold.',
    ),
    makeQualityKpi('Rooms & Accommodations',
      [
        { name: 'Rooms overview',                                    pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify rooms overview images meet brand resolution and composition standards.', insight: '1 image has a white-balance issue — a quick correction is recommended.' },
        { name: 'Chambre Classique - 2 lits simples',                pct: 72, trend: '+1.5 pts vs last month', objective: 'Ensure Chambre Classique photos reflect a clean, welcoming aesthetic.',        insight: '1 image is slightly overexposed — reprocess with reduced highlights.' },
        { name: 'Junior Suite Privilège - 1 canapé-lit 2 personnes', pct: 45, trend: '-0.8 pts vs last month', objective: 'Verify Junior Suite photography meets premium brand positioning standards.',    insight: 'Most photos are below quality threshold. A professional reshoot with a stylist is strongly recommended.' },
        { name: 'Chambre Privilège - 1 lit double',                  pct: 65, trend: '+1.8 pts vs last month', objective: 'Ensure Chambre Privilège photos convey comfort and premium quality.',          insight: '2 images have composition issues — reframe to better showcase room proportions.' },
        { name: 'Chambre Privilège, terrasse - 1 lit double',        pct: 70, trend: '+2.0 pts vs last month', objective: 'Verify the terrace shots are bright and visually aspirational.',               insight: '1 terrace photo is taken in poor light. Reshoot during golden hour for best results.' },
        { name: 'Chambre privilège vue Tour Eiffel',                  pct: 78, trend: '+2.8 pts vs last month', objective: 'Ensure the Eiffel Tower view is the visual hero of this room\'s set.',        insight: '1 night view photo has excessive noise. Reshoot with a tripod and longer exposure.' },
        { name: 'Chambre standard accessible avec 1 lit double',     pct: 38, trend: '-1.5 pts vs last month', objective: 'Ensure accessibility documentation photos meet clarity and precision standards.', insight: 'Most images are poorly framed. A reshoot focused on accessibility details is urgently needed.' },
        { name: 'Chambre standard avec 1 lit double',                pct: 68, trend: '+1.0 pts vs last month', objective: 'Verify standard room photos are clean, bright and brand-compliant.',           insight: '2 images need colour correction — apply consistent warm grading.' },
        { name: 'Suite',                                             pct: 55, trend: '+0.5 pts vs last month', objective: 'Ensure suite photography reflects premium positioning at the required resolution.', insight: '2 images are below 3700px resolution. A full professional reshoot is recommended.' },
      ],
      '+1.2 pts vs last month',
      'Evaluate room photography for resolution, composition and brand compliance.',
      'Chambre standard accessible and Junior Suite Privilège are the weakest quality areas.',
    ),
    makeQualityKpi('Wellness',
      [
        { name: 'Spa',      pct: 75, trend: '+2.0 pts vs last month', objective: 'Verify spa photos are serene, well-lit and brand-compliant.',                insight: '1 image has a distracting element in frame — restage and reshoot.' },
        { name: 'Thalasso', pct: 32, trend: '-1.5 pts vs last month', objective: 'Ensure thalasso visuals convey the therapeutic and premium nature of the facility.', insight: 'All existing images are below quality threshold. A dedicated professional reshoot is urgently needed.' },
        { name: 'Institut', pct: 60, trend: '+0.8 pts vs last month', objective: 'Verify beauty institute photos are clean, bright and professionally styled.',   insight: '2 images are underexposed. Reshoot with a combination of natural and soft artificial lighting.' },
      ],
      '+1.0 pts vs last month',
      'Check wellness facility photos for brand alignment, lighting quality and aspirational feel.',
      'Thalasso imagery is critically below standard.',
    ),
    makeQualityKpi('Pool',
      [
        { name: 'Pool overview', pct: 80, trend: '+2.5 pts vs last month', objective: 'Ensure pool overview photos showcase the area at its best.', insight: '1 image is overexposed at midday. Reshoot during early morning or late afternoon for softer light.' },
      ],
      '+2.5 pts vs last month',
      'Assess pool photography for clarity, composition and brand alignment.',
      '1 pool image is slightly overexposed — a minor correction will bring quality above 90%.',
    ),
    makeQualityKpi('Leisure',
      [
        { name: 'Fitness overview', pct: 82, trend: '+2.0 pts vs last month', objective: 'Verify fitness overview images are sharp, well-lit and active in feel.',  insight: '1 image is too dark — replace with a well-lit alternative.' },
        { name: 'Salle fitness',    pct: 70, trend: '+1.5 pts vs last month', objective: 'Ensure fitness room photos convey energy and cleanliness.',                 insight: '2 images have cluttered backgrounds — restage before reshoot.' },
        { name: 'Famille',          pct: 45, trend: '-0.8 pts vs last month', objective: 'Verify family facility photos are vibrant, joyful and brand-compliant.',    insight: '3 images are poorly lit and lack energy. A dedicated family-focused reshoot is recommended.' },
        { name: 'Golf',             pct: 42, trend: '+0.5 pts vs last month', objective: 'Ensure golf course photos are landscape-quality and aspirational.',          insight: '3 images taken in overcast conditions — reshoot on a clear day for vibrant, aspirational results.' },
      ],
      '+1.2 pts vs last month',
      'Evaluate leisure facility photos for quality, brand alignment and visual appeal.',
      'Famille and Golf photos are below brand quality standards.',
    ),
    makeQualityKpi('Surrounding',
      [
        { name: 'Destination', pct: 68, trend: '+1.8 pts vs last month', objective: 'Ensure destination photos are iconic, sharp and aspirational.', insight: '2 images are too generic — replace with more distinctive and location-specific shots.' },
      ],
      '+1.8 pts vs last month',
      'Evaluate destination photos for quality, brand alignment and visual impact.',
      '2 images are too generic — replace with more distinctive and location-specific shots.',
    ),
    makeQualityKpi('Meetings & Events',
      [
        { name: 'Overview',  pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify meetings overview images are sharp, professional and brand-compliant.',      insight: '1 image has an overexposed window — use HDR or curtains during reshoot.' },
        { name: 'Dupleix',   pct: 72, trend: '+1.5 pts vs last month', objective: 'Ensure Dupleix room photos convey a professional and welcoming atmosphere.',        insight: '1 image shows empty chairs in disarray — restage before reshoot.' },
        { name: 'Eiffel',    pct: 78, trend: '+2.5 pts vs last month', objective: 'Highlight the Eiffel room\'s view with crisp, high-resolution photography.',        insight: '1 window shot has lens flare — reshoot with appropriate lens filter.' },
        { name: 'Affaires',  pct: 52, trend: '+0.5 pts vs last month', objective: 'Ensure Affaires room photos reflect corporate professionalism and precision.',       insight: '2 images are poorly lit. Reshoot with controlled lighting to convey a premium business environment.' },
        { name: 'Mariages',  pct: 58, trend: '+1.0 pts vs last month', objective: 'Verify wedding space photos are romantic, elegant and aspirational.',               insight: '2 images lack decorative styling. Work with a wedding stylist for a dedicated reshoot.' },
      ],
      '+2.0 pts vs last month',
      'Assess event space photography for professional quality and brand alignment.',
      'Affaires and Mariages sections need quality improvement.',
    ),
  ],
]

// ─── Worst entities across all tabs ──────────────────────────────────────────
const TAB_LABELS = ['Content', 'Photo', 'Quality']

const WORST_ENTITIES = (() => {
  const all = []
  KPIS_BY_TAB.forEach((tab, tabIdx) => {
    tab.forEach(kpi => {
      kpi.sub?.forEach(s => {
        all.push({ name: s.name, pct: s.pct, tab: TAB_LABELS[tabIdx], tabIdx, parent: kpi.name, insight: s.insight,
                   count: s.count, imgType: s.imgType, chars: s.chars, target: s.target })
      })
    })
  })
  // One worst item per parent group AND per template title — ensures 4 visually distinct cards
  const groupSeen = new Set()
  const titleSeen = new Set()
  const deduped = []
  for (const item of all.sort((a, b) => a.pct - b.pct)) {
    const groupKey = item.parent ?? item.name
    const title = getCardCopy(item, item.tabIdx).title
    if (!groupSeen.has(groupKey) && !titleSeen.has(title)) {
      groupSeen.add(groupKey)
      titleSeen.add(title)
      deduped.push(item)
    }
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
    all.push({ name: kpi.name, pct: kpi.pct, parent: null, insight: kpi.insight, _isParent: true })
    kpi.sub?.forEach(s => {
      all.push({
        name: s.name, pct: s.pct, parent: kpi.name, insight: s.insight,
        count: s.count, imgType: s.imgType, chars: s.chars, target: s.target,
      })
    })
  })
  return all.sort((a, b) => a.pct - b.pct)
})

function getCriticalGapTitle(e, tabIdx) {
  const { count, imgType, chars, target, pct, name } = e
  if (tabIdx === 1 && imgType === 'main') {
    if (!count || count === 0) return `${name} — no photos yet.`
    const rem = 6 - count
    return rem > 0 ? `${name} — ${rem} photo${rem > 1 ? 's' : ''} to go.` : `${name} — complete.`
  }
  if (tabIdx === 1 && imgType === 'sub') {
    const rem = 4 - (count || 0)
    return rem > 0 ? `${name} — ${rem}/${4} photos missing.` : `${name} — complete.`
  }
  if (tabIdx === 1 && imgType === 'optional') {
    if (!count || count === 0) return `${name} — no photos yet.`
    const rem = 6 - count
    return rem > 0 ? `${name} — ${rem}/6 photos missing.` : `${name} — complete.`
  }
  if (tabIdx === 0 && chars !== undefined && target !== undefined) {
    const ratio = chars / target
    if (ratio < 0.5) return `${name} — under 50% filled.`
    const rem = Math.round(target * 0.75) - chars
    return rem > 0 ? `${name} — ${rem} characters to go.` : `${name} — field validated.`
  }
  if (tabIdx === 2) {
    if (pct < 40) return `${name} — below quality threshold.`
    if (pct < 60) return `${name} — quality gap detected.`
    if (pct < 80) return `${name} — quality can improve.`
    return `${name} — quality on track.`
  }
  return name
}

function getCardCopy(e, tabIdx) {
  const { count, imgType, chars, target, pct, name, insight, _isParent } = e

  // ── Tab 0: Content completion ────────────────────────────────────────────────
  if (tabIdx === 0) {
    if (!_isParent && chars !== undefined && target !== undefined) {
      const ratio = chars / target
      if (chars === 0) {
        const minChars = Math.round(target * 0.75)
        return {
          title: "This field is empty — and your score shows it.",
          body: `Every blank field is a missed point. Start with a short description: just ${minChars} characters gets you to 100% on this field.`,
        }
      }
      if (ratio < 0.5) return {
        title: "This field is hurting your overall score.",
        body: "Less than half filled — your score on this field is capped at 50%. A few sentences are all it takes to change that. Fill it in now.",
      }
      if (ratio < 0.75) {
        const currentPct = Math.round(ratio * 100)
        const remaining = Math.round(target * 0.75) - chars
        return {
          title: "Nearly there. Add a few more words.",
          body: `You're at ${currentPct}% — just ${remaining} characters away from a 100% score on this field. Small effort, immediate gain.`,
        }
      }
      return {
        title: "Field validated. Score: 100%.",
        body: "This field is fully contributing to your completion score. You can keep adding content if you'd like — it won't change the score, but it improves the guest experience.",
      }
    }
    // Parent-level: general principle
    return {
      title: "You don't need to write a novel.",
      body: "Reaching 75% of the target length is enough to validate a field at 100%. It's not about maximum length — it's about useful density. Drop below 50% and the score falls to 50% immediately.",
    }
  }

  // ── Tab 1: Photo completion ──────────────────────────────────────────────────
  if (tabIdx === 1) {
    if (!_isParent && imgType) {
      if (imgType === 'main') {
        if (!count || count === 0) return {
          title: "This category is dragging your score down.",
          body: "Add at least 6 photos to fully validate this category. As long as it's empty, it pulls your overall completion score below its potential.",
        }
        if (count <= 3) {
          const rem = 6 - count
          return {
            title: "Good start. Keep going.",
            body: `${count}/6 photos. You're ${rem} away from validating this category. Your overall score is the average across all categories — every photo you add moves the needle.`,
          }
        }
        if (count <= 5) {
          const rem = 6 - count
          return {
            title: `Almost done. Just ${rem} more photo${rem > 1 ? 's' : ''}.`,
            body: `${count}/6 photos. You're one step away from 100% on this category and a higher overall score.`,
          }
        }
        return {
          title: "Category complete.",
          body: "This category is contributing 100% to your completion score. Now focus on the others to keep building.",
        }
      }
      if (imgType === 'sub') {
        if (count >= 4) return {
          title: "Sub-category complete.",
          body: "This sub-category is contributing 100% to your completion score. Now focus on the others to keep building.",
        }
        return {
          title: "4 photos per sub-category. That's the target.",
          body: "Each sub-category feeds into your overall average. 4 images = 100% on that segment. Incomplete sub-categories pull the score down just like mandatory ones.",
        }
      }
      if (imgType === 'optional') {
        if (!count || count === 0) return {
          title: "Adding a category means committing to fill it.",
          body: "Optional categories don't affect your score if they're empty. The moment you upload a single photo, they become tracked and require 6 images to be fully validated.",
        }
        if (count >= 6) return {
          title: "Category complete.",
          body: "This category is contributing 100% to your completion score. Now focus on the others to keep building.",
        }
        return {
          title: "You've activated an optional category.",
          body: "This category now enters the score calculation and requires 6 photos to reach 100%. Complete it — or remove the photo to avoid an open completion debt.",
        }
      }
      if (imgType === 'chef') return {
        title: "One photo is all it takes here.",
        body: "The Chef category is fully validated with a single image. No need to add more.",
      }
    }
    // Parent-level photo item
    return {
      title: "Adding a category means committing to fill it.",
      body: "Optional categories don't affect your score if they're empty. The moment you upload a single photo, they become tracked and require 6 images to be fully validated.",
    }
  }

  // ── Tab 2: Quality score ─────────────────────────────────────────────────────
  if (tabIdx === 2) {
    if (pct < 40) return {
      title: "This photo doesn't meet the minimum requirements.",
      body: "Resolution too low or incorrect ratio — it will be automatically cropped and capped at \"Compliant\" at best. Replace it to unlock higher quality tiers.",
    }
    if (pct < 60) return {
      title: "More photos won't fix low quality.",
      body: "Uploading more poor-quality images doesn't improve the score — it averages it down. To move toward Advanced or Excellence, replace underlit, poorly framed, or blurry shots with carefully prepared ones.",
    }
    if (pct < 80) return {
      title: "The AI sees what your guests see.",
      body: "The algorithm analyses every image across four dimensions: lighting, sharpness, framing, and staging. A dark, blurry, or cluttered room brings the score down — regardless of how many photos you've uploaded.",
    }
    return {
      title: "A beautiful photo isn't always the right photo.",
      body: "A technically flawless image that doesn't match your brand guidelines is penalised. Human reviewers assess desirability: warmth, authenticity, visual intent. Lead with photos that make guests want to book.",
    }
  }

  return { title: name, body: insight }
}

// ─── Tab icons (shared between dashboard tabs and drawer) ─────────────────────
const TAB_ICONS = [
  // Content completion — document with lines
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#232136" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>,
  // Photo completion — camera
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#232136" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>,
  // Photo quality — star
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#232136" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
  </svg>,
]

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
          <div style={{ display: 'flex', gap: 0, padding: '18px 28px 0', borderBottom: '1px solid #DADADD' }}>
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
                  borderBottom: activeTab === i ? '2px solid #2D4CD5' : '2px solid transparent',
                  marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px 28px' }}>
          {entities.map((e, i) => {
            const level = getScoreLevel(e.pct)
            const copy  = getCardCopy(e, activeTab)
            return (
              <div
                key={i}
                style={{
                  background: 'white',
                  border: '1px solid #DAD9DD',
                  borderRadius: 6,
                  marginBottom: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Top row: badge + title + breadcrumb */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 16px',
                  borderBottom: '1px solid #EAEAEC',
                }}>
                  <span style={{
                    flexShrink: 0,
                    background: level.bg,
                    borderRadius: 26,
                    padding: '4px 10px',
                    fontSize: 13, fontWeight: 700,
                    color: level.text,
                    fontFamily: 'Roboto, sans-serif',
                    whiteSpace: 'nowrap',
                  }}>
                    {e.pct}%
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif', lineHeight: '20px' }}>
                      {copy.title}
                    </div>
                    {e.parent && (
                      <div style={{ fontSize: 13, fontWeight: 400, color: '#5E5B73', fontFamily: 'Roboto, sans-serif', lineHeight: '18px', marginTop: 2 }}>
                        {e.parent} › {e.name}
                      </div>
                    )}
                  </div>

                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#050033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>

                {/* Bottom: description */}
                <div style={{ padding: '16px 16px' }}>
                  <p style={{ fontSize: 14, fontWeight: 400, color: '#38364D', fontFamily: 'Roboto, sans-serif', lineHeight: '22px', margin: 0 }}>
                    {copy.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}


// Scores computed from raw data — single source of truth
const TAB0_PCT    = AV(KPIS_BY_TAB[0].map(k => k.pct))
const TAB1_PCT    = AV(KPIS_BY_TAB[1].map(k => k.pct))
const TAB2_PCT    = AV(KPIS_BY_TAB[2].map(k => k.pct))
const OVERALL_PCT = AV([TAB0_PCT, TAB1_PCT, TAB2_PCT])

const TABS_META = [
  { title: 'Content completion', scoreType: 'content', tooltipPlacement: 'bottom-left',  pct: TAB0_PCT, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo completion',   scoreType: 'media',   tooltipPlacement: 'bottom-left',  pct: TAB1_PCT, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo quality',      scoreType: 'quality', tooltipPlacement: 'bottom-right', pct: TAB2_PCT, trend: null, stars: true, starValue: Math.round(TAB2_PCT / 20) },
]


// ─── Onboarding popup ────────────────────────────────────────────────────────
function OnboardingPopup({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(5,0,51,0.4)',
        zIndex: 2000, backdropFilter: 'blur(2px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2001, width: 520,
        background: 'white', borderRadius: 16,
        boxShadow: '0 24px 64px rgba(5,0,51,0.18)',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #2D4CD5, #4ECDA8)' }} />

        <div style={{ padding: '32px 36px 36px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#050033', margin: 0, fontFamily: 'Montserrat, sans-serif', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                Meet your new Content Dashboard
              </h2>
              <p style={{ fontSize: 16, color: '#5E5B73', margin: '6px 0 0', fontFamily: 'Roboto, sans-serif' }}>
                Your content, scored. Your actions, clear.
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', flexShrink: 0, marginTop: -4 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <p style={{ fontSize: 14, color: '#5E5B73', margin: '0 0 20px', lineHeight: 1.7, fontFamily: 'Roboto, sans-serif' }}>
            We've built a smarter way to manage your hotel content, based on HCS scoring. Your dashboard now gives you 3 key scores so you always know where you stand.
          </p>

          {/* 3 features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {[
              { color: '#2D4CD5', label: 'Content scores', desc: 'Content completion, Photo completion & Photo quality — scored so you always know what to edit next.',
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                </svg> },
              { color: '#DC2626', label: 'Critical gaps', desc: 'Your lowest-performing KPIs are surfaced automatically, no digging required.',
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="12"/><line x1="11" y1="16" x2="11.01" y2="16"/>
                </svg> },
              { color: '#4ECDA8', label: 'Concrete improvements', desc: 'Every underperforming KPI comes with a clear, actionable tip to fix it fast.',
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                </svg> },
            ].map(({ color, label, desc, icon }) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#232136', margin: '0 0 2px', fontFamily: 'Roboto, sans-serif' }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#5E5B73', margin: 0, fontFamily: 'Roboto, sans-serif', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 100, border: 'none',
              background: '#050033', color: 'white', fontSize: 15, fontWeight: 600,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer', letterSpacing: 0.2,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Start exploring your scores →
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage({ showOnboarding = false, onCloseOnboarding = () => {}, onOpenOnboarding = () => {} }) {
  const [activeTab, setActiveTab]     = useState(0)
  const [selectedKpi, setSelectedKpi] = useState(null)
  const [expandedKpi, setExpandedKpi] = useState(null)
  const [search, setSearch]           = useState('')
  const [sortBy, setSortBy]           = useState('default')
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, marginBottom: 20, border: '1px solid transparent' }}>

        <Card style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
          <div>
            <CardTitle scoreType="global">Your total Score</CardTitle>
            <p style={{ fontSize: 14, fontWeight: 400, color: '#898C8E', margin: '0 0 0', fontFamily: 'Roboto, sans-serif' }}>Updated on 12/02/2026</p>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24 }}>
            <SemiGauge pct={OVERALL_PCT} trend="+ 0.2 pts vs last month" />
            <div>
              <div style={{ marginBottom: 8 }}>
                <ScoreBadge score={OVERALL_PCT} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 18, fontWeight: 500, color: '#1A1835', margin: 0, fontFamily: 'Roboto, sans-serif' }}>Good progress!</p>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Your score is above average — you're on the right track. A few targeted actions on your weakest KPIs could push you into the Excellence range.</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Critical Gaps</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WORST_ENTITIES.map((e, i) => {
              const level = getScoreLevel(e.pct)
              return (
                <div key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 8px',
                    borderBottom: i < WORST_ENTITIES.length - 1 ? '1px solid #F3F4F6' : 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F5FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
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
                      {getCardCopy(e, e.tabIdx).title}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{e.tab}</div>
                  </div>
                  {/* Chevron */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
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
      <div style={{ border: '1px solid #EBEBF5', borderRadius: 16, background: 'white', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>

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
                <CardTitle scoreType={tab.scoreType} tooltipPlacement={tab.tooltipPlacement} icon={TAB_ICONS[i]}>{tab.title}</CardTitle>
              </div>
              <SubLabel>Updated on 12/02/2026</SubLabel>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {!tab.stars && (
                  <>
                    <p style={{ fontSize: 26, fontWeight: 700, color: '#1A1835', margin: 0 }}>{tab.pct} %</p>
                    <ScoreBadge score={tab.pct} size="sm" />
                  </>
                )}
              </div>
              <div style={{ marginTop: 2, transform: tab.stars ? 'translateY(-10px)' : 'translateY(4px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                {tab.stars ? (
                  <>
                    <Stars value={tab.starValue} />
                    <span style={{ fontSize: 26, fontWeight: 700, color: '#1A1835' }}>{tab.starValue} / 5</span>
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
                    <option value="default">Default</option>
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

                      <span style={{ fontSize: 14, color: isSelected ? '#2D4CD5' : '#374151', fontWeight: isSelected ? 600 : 400, width: 377, flexShrink: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {kpi.name}
                      </span>

                      {kpi.empty
                        ? <span style={{ fontSize: 13, color: '#9CA3AF', flex: 1 }}>Empty</span>
                        : activeTab === 2
                          ? <Stars value={Math.round(kpi.pct / 20)} size={16} />
                          : <ScoreGauge pct={kpi.pct} />
                      }

                      <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#2D4CD5' : '#374151', minWidth: 40, textAlign: 'right' }}>
                        {activeTab === 2 ? `${Math.round(kpi.pct / 20)}` : `${kpi.pct}%`}
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
                                  <span style={{ fontSize: 13, color: isSubSelected ? '#2D4CD5' : '#5E5B73', fontWeight: isSubSelected ? 600 : 400, width: 353, flexShrink: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</span>
                                  {activeTab === 2 ? <Stars value={Math.round(s.pct / 20)} size={16} /> : <ScoreGauge pct={s.pct} />}
                                  <span style={{ fontSize: 13, fontWeight: 500, color: isSubSelected ? '#2D4CD5' : '#5E5B73', minWidth: 40, textAlign: 'right' }}>
                                    {activeTab === 2 ? `${Math.round(s.pct / 20)}` : `${s.pct}%`}
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
      {showOnboarding && <OnboardingPopup onClose={onCloseOnboarding} />}

    </div>
  )
}
