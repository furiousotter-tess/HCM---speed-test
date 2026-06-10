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
  return <p style={{ fontSize: 14, fontWeight: 400, color: '#5E5B73', margin: '0 0 24px', fontFamily: 'Roboto, sans-serif', color: '#898C8E' }}>{children}</p>
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
    { name: 'Hotel overview', pct: 53, trend: '+1.6 pts vs last month', objective: 'Measure the completeness of all hotel description fields used across channels.', insight: 'SEO and destination description fields have the most impact. Prioritise these to boost your score quickly.',
      sub: [
        { name: 'Hotel description',         pct: 68, trend: '+2.5 pts vs last month', objective: 'Verify the main hotel description is engaging and covers the property\'s key highlights.', insight: 'The main description is 70% of the target length. Adding a paragraph about the hotel\'s unique atmosphere will complete it.' },
        { name: 'Hotel SEO description',     pct: 45, trend: '+1.2 pts vs last month', objective: 'Ensure the SEO description is complete and keyword-optimised for search visibility.',    insight: 'The SEO description is under the recommended character count. Extend it to at least 160 characters for full impact.' },
        { name: 'Hotel manager message',     pct: 38, trend: '-0.4 pts vs last month', objective: 'Check that the hotel manager message is personalised and complete.',                     insight: 'Only the opening sentence has been filled in. A full manager message adds a personal touch that improves conversion.' },
        { name: 'Hotel Destination description', pct: 60, trend: '+1.8 pts vs last month', objective: 'Ensure the destination description helps guests understand the local area and attractions.', insight: 'Local transport and nearby attractions sections are incomplete. These are high-value fields for first-time visitors.' },
      ] },
    { name: 'Rooms & accommodations', pct: 64, trend: '+2.4 pts vs last month', objective: 'Verify that room descriptions are detailed enough to set accurate guest expectations.', insight: 'Room description fields are below target. Completing them will push this category above 80%.',
      sub: [
        { name: 'Rooms', pct: 64, trend: '+2.4 pts vs last month', objective: 'Ensure each room type has a complete and engaging description for guests.', insight: 'Description length is below the required minimum for 3 room types. Aim for at least 150 characters per type.' },
      ] },
  ],
  // Tab 1 — Photo completion
  [
    { name: 'Hotel', pct: 76, trend: '+2.1 pts vs last month', objective: 'Ensure all hotel-level photo categories are fully covered.', insight: 'Sustainable development and Label sections are critically under-represented.',
      sub: [
        { name: 'Hotel overview',           pct: 90, trend: '+1.5 pts vs last month', objective: 'Verify hotel overview photos cover exterior, lobby and key spaces.', insight: '1 photo missing — add a wide exterior shot for full coverage.' },
        { name: 'Services',                 pct: 72, trend: '+2.0 pts vs last month', objective: 'Ensure all guest services are visually documented.',                 insight: '2 service photos missing. Prioritise concierge and room service shots.' },
        { name: 'Hotel advantages',         pct: 80, trend: '+1.8 pts vs last month', objective: 'Ensure hotel advantage areas are illustrated with quality photos.',   insight: '1 photo missing in this section. A signature amenity shot is recommended.' },
        { name: 'Sustainable development',  pct: 38, trend: '-0.5 pts vs last month', objective: 'Document sustainable initiatives visually to highlight eco-commitments.', insight: 'Most photos are missing. Add images of green initiatives, recycling points and energy-saving installations.' },
        { name: 'Photos of your guest',     pct: 65, trend: '+3.0 pts vs last month', objective: 'Capture authentic guest experience moments to boost emotional engagement.', insight: '3 lifestyle photos missing. Focus on guests enjoying the pool, spa and dining areas.' },
        { name: 'Label',                    pct: 42, trend: '+0.8 pts vs last month', objective: 'Ensure all certified labels are visually supported with compliant imagery.', insight: 'Several label visuals are missing. Add official imagery for each certification held by the property.' },
      ] },
    { name: 'Restaurant & Breakfast', pct: 74, trend: '+2.5 pts vs last month', objective: 'Ensure dining and breakfast areas are fully documented for guest decision-making.', insight: 'Chef and Anecdote sections are incomplete. Breakfast type visuals are missing.',
      sub: [
        { name: 'Restaurant overview', pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify the restaurant overview set covers ambiance, dining room and plated dishes.', insight: '1 photo missing — an interior wide-angle shot is recommended.' },
        { name: 'Chef',                pct: 55, trend: '+1.2 pts vs last month', objective: 'Ensure the chef is visually featured to build trust and personality.',             insight: '2 photos missing. A portrait and an action shot in the kitchen are the priority.' },
        { name: 'Anecdote',            pct: 48, trend: '-0.3 pts vs last month', objective: 'Illustrate the restaurant\'s story and signature elements visually.',              insight: 'Most anecdote visuals are missing. Add photos of signature dishes, décor details or origin story elements.' },
        { name: 'Breakfast',           pct: 88, trend: '+3.1 pts vs last month', objective: 'Ensure breakfast visuals showcase variety, ambiance and quality.',                insight: '1 photo missing — a wide buffet setup shot would complete this section.' },
        { name: 'Breakfast type',      pct: 60, trend: '+1.0 pts vs last month', objective: 'Document each breakfast type option with clear, appetising imagery.',             insight: '2 breakfast type photos are missing. Show continental and à la carte options clearly.' },
      ] },
    { name: 'Bars', pct: 68, trend: '+1.8 pts vs last month', objective: 'Ensure bar areas are visually compelling and fully documented.', insight: 'Le Pondichery is missing several key shots.',
      sub: [
        { name: 'Le Pondichery', pct: 68, trend: '+1.8 pts vs last month', objective: 'Ensure Le Pondichery bar has a full set of photos covering counter, seating and signature cocktails.', insight: '3 photos missing. Add a bar counter close-up, a cocktail detail shot and an evening ambiance photo.' },
      ] },
    { name: 'Rooms & Accommodations', pct: 62, trend: '+1.5 pts vs last month', objective: 'Verify all room types are fully documented with quality photo coverage.', insight: 'Several room types are critically under-represented. Chambre standard accesssible is the weakest.',
      sub: [
        { name: 'Rooms overview',                                    pct: 88, trend: '+2.0 pts vs last month', objective: 'Ensure the rooms overview carousel covers all key room categories.', insight: '1 photo missing — a wide room layout shot is recommended.' },
        { name: 'Chambre Classique - 2 lits simples',                pct: 75, trend: '+1.5 pts vs last month', objective: 'Verify this room type has photos covering bed, bathroom and view.',  insight: '1 photo missing — a bathroom detail shot would complete coverage.' },
        { name: 'Junior Suite Privilège - 1 canapé-lit 2 personnes', pct: 50, trend: '-0.5 pts vs last month', objective: 'Ensure the Junior Suite is fully documented for premium guests.',    insight: '3 photos missing. Prioritise the living area, sofa-bed setup and a bathroom wide shot.' },
        { name: 'Chambre Privilège - 1 lit double',                  pct: 67, trend: '+2.0 pts vs last month', objective: 'Verify Chambre Privilège photos cover all guest touchpoints.',       insight: '2 photos missing — add a window view and a bathroom close-up.' },
        { name: 'Chambre Privilège, terrasse - 1 lit double',        pct: 72, trend: '+1.8 pts vs last month', objective: 'Ensure the terrace is visually featured as a key selling point.',    insight: '1 photo missing — a terrace lifestyle shot with outdoor furniture is recommended.' },
        { name: 'Chambre privilège vue Tour Eiffel',                  pct: 80, trend: '+3.0 pts vs last month', objective: 'Make the Eiffel Tower view the hero of this room\'s photo set.',   insight: '1 photo missing — a daytime and a night view shot of the Eiffel Tower are both recommended.' },
        { name: 'Chambre standard accessible avec 1 lit double',     pct: 42, trend: '-1.0 pts vs last month', objective: 'Ensure accessibility features are clearly documented visually.',     insight: '4 photos missing. Document wheelchair access, adapted bathroom and room layout in detail.' },
        { name: 'Chambre standard avec 1 lit double',                pct: 70, trend: '+1.2 pts vs last month', objective: 'Verify the standard room has a complete and attractive photo set.',  insight: '2 photos missing — add a bedroom overview and a bathroom shot.' },
        { name: 'Suite',                                             pct: 55, trend: '+0.8 pts vs last month', objective: 'Ensure the suite is fully documented for high-value guests.',        insight: '3 photos missing. Prioritise the living area, bathroom and a signature view shot.' },
      ] },
    { name: 'Wellness', pct: 58, trend: '+1.2 pts vs last month', objective: 'Document all wellness facilities to attract health-conscious guests.', insight: 'Thalasso is critically incomplete. Institut needs additional coverage.',
      sub: [
        { name: 'Spa',      pct: 78, trend: '+2.5 pts vs last month', objective: 'Ensure the spa section has photos covering treatment rooms, pool and relaxation areas.', insight: '1 photo missing — add a treatment room detail shot.' },
        { name: 'Thalasso', pct: 35, trend: '-1.2 pts vs last month', objective: 'Visually document the thalasso facilities to highlight their unique offerings.',         insight: '4 photos missing. This is a key differentiator — prioritise a full photo set urgently.' },
        { name: 'Institut', pct: 62, trend: '+0.5 pts vs last month', objective: 'Ensure the beauty institute is attractively and completely documented.',                  insight: '2 photos missing. Add a reception area shot and a treatment close-up.' },
      ] },
    { name: 'Pool', pct: 82, trend: '+2.8 pts vs last month', objective: 'Ensure pool areas are visually appealing and fully covered.', insight: '1 photo missing from the pool overview set.',
      sub: [
        { name: 'Pool overview', pct: 82, trend: '+2.8 pts vs last month', objective: 'Verify the pool overview covers the full area, sunbeds and water features.', insight: '1 photo missing — a wide aerial or elevated shot of the pool area is recommended.' },
      ] },
    { name: 'Leisure', pct: 63, trend: '+1.5 pts vs last month', objective: 'Ensure all leisure facilities are documented to boost guest engagement.', insight: 'Famille and Golf sections are the weakest areas.',
      sub: [
        { name: 'Fitness overview', pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify the fitness overview covers all key equipment and open-floor space.', insight: '1 photo missing — a natural light action shot is recommended.' },
        { name: 'Salle fitness',    pct: 72, trend: '+1.5 pts vs last month', objective: 'Ensure the fitness room is fully documented with equipment detail shots.',   insight: '2 photos missing — add a cardio zone and a weights area shot.' },
        { name: 'Famille',          pct: 48, trend: '-0.8 pts vs last month', objective: 'Visually highlight family-friendly facilities and activities.',               insight: '3 photos missing. Add photos of kids\' club, family pool area and activity spaces.' },
        { name: 'Golf',             pct: 45, trend: '+0.5 pts vs last month', objective: 'Document the golf facilities to attract sports-oriented guests.',             insight: '3 photos missing. Prioritise a course overview, putting green and clubhouse shot.' },
      ] },
    { name: 'Surrounding', pct: 52, trend: '+0.8 pts vs last month', objective: 'Ensure the hotel\'s surroundings and nearby attractions are well documented.', insight: 'CDG, DisneyLand Paris and Paris Orly sections are critically incomplete.',
      sub: [
        { name: 'Destination',                   pct: 70, trend: '+2.0 pts vs last month', objective: 'Illustrate the destination with iconic and aspirational imagery.',       insight: '2 photos missing — add a city skyline and a local culture shot.' },
        { name: 'Around the hotel - Beaugrenelle', pct: 65, trend: '+1.5 pts vs last month', objective: 'Show proximity to Beaugrenelle shopping centre.',                     insight: '1 photo missing — an exterior shot of the centre entrance is recommended.' },
        { name: 'Around the hotel - Paris',       pct: 68, trend: '+1.2 pts vs last month', objective: 'Highlight Paris\'s key landmarks accessible from the hotel.',          insight: '2 photos missing — add Eiffel Tower and Seine riverside shots.' },
        { name: 'Around the hotel - Galeries Lafayette', pct: 60, trend: '+0.8 pts vs last month', objective: 'Document proximity to Galeries Lafayette.',                    insight: '2 photos missing — add an exterior and an interior shot.' },
        { name: 'Around the hotel - Dupleix',     pct: 55, trend: '+0.5 pts vs last month', objective: 'Show the Dupleix neighbourhood and metro access.',                    insight: '2 photos missing — a street-level and metro entrance shot are recommended.' },
        { name: 'Around the hotel - CDG',         pct: 30, trend: '-0.5 pts vs last month', objective: 'Document CDG airport access for business and transit guests.',         insight: '3 photos missing. Add a transfer route, terminal and signage shot.' },
        { name: 'Around the hotel - DisneyLand Paris', pct: 28, trend: '-0.8 pts vs last month', objective: 'Highlight DisneyLand Paris as a family-friendly nearby attraction.', insight: '3 photos missing. This is high-value for family guests — add park entrance and transport shots.' },
        { name: 'Around the hotel - Paris Orly',  pct: 32, trend: '-0.3 pts vs last month', objective: 'Document Orly airport access for arriving guests.',                   insight: '3 photos missing. Add shuttle, terminal and wayfinding shots.' },
      ] },
    { name: 'Meetings & Events', pct: 70, trend: '+2.2 pts vs last month', objective: 'Ensure all meeting and event spaces are professionally documented.', insight: 'Affaires and Mariages sections need additional coverage.',
      sub: [
        { name: 'Overview',  pct: 88, trend: '+2.0 pts vs last month', objective: 'Verify the meetings overview showcases the full range of event spaces.',          insight: '1 photo missing — a wide setup shot covering multiple rooms is recommended.' },
        { name: 'Dupleix',   pct: 75, trend: '+1.5 pts vs last month', objective: 'Ensure Dupleix room is documented for corporate and social events.',               insight: '1 photo missing — a classroom or theatre-style setup shot is recommended.' },
        { name: 'Eiffel',    pct: 80, trend: '+3.0 pts vs last month', objective: 'Highlight the Eiffel room with its view as a premium event selling point.',        insight: '1 photo missing — a reception-style setup shot with the view in background.' },
        { name: 'Affaires',  pct: 58, trend: '+0.5 pts vs last month', objective: 'Document the Affaires space for business meetings and corporate events.',          insight: '2 photos missing — add a boardroom and a detail shot of AV equipment.' },
        { name: 'Mariages',  pct: 62, trend: '+1.0 pts vs last month', objective: 'Showcase the hotel\'s wedding and celebration event capabilities visually.',       insight: '2 photos missing. Add a banquet setup and a decorated ceremony space shot.' },
      ] },
    { name: 'Parking', pct: 88, trend: '+1.0 pts vs last month', objective: 'Ensure parking facilities are clearly documented for guest convenience.', insight: '1 photo missing from the parking overview.',
      sub: [
        { name: 'Overview', pct: 88, trend: '+1.0 pts vs last month', objective: 'Verify the parking overview covers entrance, spaces and signage.', insight: '1 photo missing — add an entrance or wayfinding shot.' },
      ] },
  ],
  // Tab 2 — Photo quality
  [
    { name: 'Hotel', pct: 72, trend: '+1.8 pts vs last month', objective: 'Assess the visual quality and brand compliance of all hotel-level photography.', insight: 'Sustainable development and Label visuals are below quality threshold.',
      sub: [
        { name: 'Hotel overview',           pct: 88, trend: '+2.0 pts vs last month', objective: 'Verify hotel overview photos meet brand resolution and framing standards.',   insight: '1 image has a slight overexposure issue — a quick correction is recommended.' },
        { name: 'Services',                 pct: 70, trend: '+1.5 pts vs last month', objective: 'Ensure service photos are sharp, well-lit and brand-compliant.',              insight: '2 images are below resolution threshold. Reshoot under controlled lighting.' },
        { name: 'Hotel advantages',         pct: 78, trend: '+2.2 pts vs last month', objective: 'Check that hotel advantage photos reflect premium brand positioning.',         insight: '1 image has a composition issue — reframe to better showcase the advantage.' },
        { name: 'Sustainable development',  pct: 40, trend: '-0.5 pts vs last month', objective: 'Ensure eco-initiative photos are clear, authentic and brand-aligned.',         insight: 'Most existing images are poorly lit. A dedicated reshoot with natural light is strongly recommended.' },
        { name: 'Photos of your guest',     pct: 62, trend: '+2.5 pts vs last month', objective: 'Verify guest lifestyle photos are authentic, diverse and brand-compliant.',   insight: '2 images look staged. Replace with more natural, spontaneous lifestyle shots.' },
        { name: 'Label',                    pct: 45, trend: '+0.8 pts vs last month', objective: 'Ensure label visuals meet certification display standards.',                   insight: 'Several label images are low-resolution. Source official high-res assets from the certifying bodies.' },
      ] },
    { name: 'Restaurant & Breakfast', pct: 70, trend: '+2.0 pts vs last month', objective: 'Evaluate dining photography for brand alignment, food styling and lighting quality.', insight: 'Chef portraits and Anecdote visuals are below brand standards.',
      sub: [
        { name: 'Restaurant overview', pct: 82, trend: '+2.5 pts vs last month', objective: 'Verify restaurant overview images are well-composed and brand-compliant.',    insight: '1 image is slightly underexposed — a brightness correction will improve quality.' },
        { name: 'Chef',                pct: 55, trend: '+1.0 pts vs last month', objective: 'Ensure chef photos are professionally styled and reflect brand identity.',    insight: '1 portrait has a distracting background. Reshoot with a clean kitchen backdrop.' },
        { name: 'Anecdote',            pct: 48, trend: '-0.3 pts vs last month', objective: 'Check that anecdote visuals are storytelling-focused and on-brand.',           insight: 'Images lack narrative depth. Work with a food stylist to create more compelling shots.' },
        { name: 'Breakfast',           pct: 85, trend: '+3.0 pts vs last month', objective: 'Ensure breakfast photos are bright, welcoming and appetising.',               insight: '1 image taken in low light — retake during morning service for better brightness.' },
        { name: 'Breakfast type',      pct: 60, trend: '+1.0 pts vs last month', objective: 'Verify each breakfast type is photographed with consistent styling.',         insight: '2 images have inconsistent colour grading. Apply uniform post-processing for brand coherence.' },
      ] },
    { name: 'Bars', pct: 65, trend: '+1.5 pts vs last month', objective: 'Assess bar photography for brand alignment, lighting quality and visual appeal.', insight: 'Le Pondichery has several images below quality threshold.',
      sub: [
        { name: 'Le Pondichery', pct: 65, trend: '+1.5 pts vs last month', objective: 'Ensure Le Pondichery photos are sharp, well-lit and brand-aligned.', insight: '2 images are underexposed. Reshoot during evening service with ambient lighting reinforced by professional equipment.' },
      ] },
    { name: 'Rooms & Accommodations', pct: 60, trend: '+1.2 pts vs last month', objective: 'Evaluate room photography for resolution, composition and brand compliance.', insight: 'Chambre standard accessible and Junior Suite Privilège are the weakest quality areas.',
      sub: [
        { name: 'Rooms overview',                                    pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify rooms overview images meet brand resolution and composition standards.', insight: '1 image has a white-balance issue — a quick correction is recommended.' },
        { name: 'Chambre Classique - 2 lits simples',                pct: 72, trend: '+1.5 pts vs last month', objective: 'Ensure Chambre Classique photos reflect a clean, welcoming aesthetic.',        insight: '1 image is slightly overexposed — reprocess with reduced highlights.' },
        { name: 'Junior Suite Privilège - 1 canapé-lit 2 personnes', pct: 45, trend: '-0.8 pts vs last month', objective: 'Verify Junior Suite photography meets premium brand positioning standards.',    insight: 'Most photos are below quality threshold. A professional reshoot with a stylist is strongly recommended.' },
        { name: 'Chambre Privilège - 1 lit double',                  pct: 65, trend: '+1.8 pts vs last month', objective: 'Ensure Chambre Privilège photos convey comfort and premium quality.',          insight: '2 images have composition issues — reframe to better showcase room proportions.' },
        { name: 'Chambre Privilège, terrasse - 1 lit double',        pct: 70, trend: '+2.0 pts vs last month', objective: 'Verify the terrace shots are bright and visually aspirational.',               insight: '1 terrace photo is taken in poor light. Reshoot during golden hour for best results.' },
        { name: 'Chambre privilège vue Tour Eiffel',                  pct: 78, trend: '+2.8 pts vs last month', objective: 'Ensure the Eiffel Tower view is the visual hero of this room\'s set.',        insight: '1 night view photo has excessive noise. Reshoot with a tripod and longer exposure.' },
        { name: 'Chambre standard accessible avec 1 lit double',     pct: 38, trend: '-1.5 pts vs last month', objective: 'Ensure accessibility documentation photos meet clarity and precision standards.', insight: 'Most images are poorly framed. A reshoot focused on accessibility details is urgently needed.' },
        { name: 'Chambre standard avec 1 lit double',                pct: 68, trend: '+1.0 pts vs last month', objective: 'Verify standard room photos are clean, bright and brand-compliant.',           insight: '2 images need colour correction — apply consistent warm grading.' },
        { name: 'Suite',                                             pct: 55, trend: '+0.5 pts vs last month', objective: 'Ensure suite photography reflects premium positioning at the required resolution.', insight: '2 images are below 3700px resolution. A full professional reshoot is recommended.' },
      ] },
    { name: 'Wellness', pct: 55, trend: '+1.0 pts vs last month', objective: 'Check wellness facility photos for brand alignment, lighting quality and aspirational feel.', insight: 'Thalasso imagery is critically below standard.',
      sub: [
        { name: 'Spa',      pct: 75, trend: '+2.0 pts vs last month', objective: 'Verify spa photos are serene, well-lit and brand-compliant.',                insight: '1 image has a distracting element in frame — restage and reshoot.' },
        { name: 'Thalasso', pct: 32, trend: '-1.5 pts vs last month', objective: 'Ensure thalasso visuals convey the therapeutic and premium nature of the facility.', insight: 'All existing images are below quality threshold. A dedicated professional reshoot is urgently needed.' },
        { name: 'Institut', pct: 60, trend: '+0.8 pts vs last month', objective: 'Verify beauty institute photos are clean, bright and professionally styled.',   insight: '2 images are underexposed. Reshoot with a combination of natural and soft artificial lighting.' },
      ] },
    { name: 'Pool', pct: 80, trend: '+2.5 pts vs last month', objective: 'Assess pool photography for clarity, composition and brand alignment.', insight: '1 pool image is slightly overexposed — a minor correction will bring quality above 90%.',
      sub: [
        { name: 'Pool overview', pct: 80, trend: '+2.5 pts vs last month', objective: 'Ensure pool overview photos showcase the area at its best.', insight: '1 image is overexposed at midday. Reshoot during early morning or late afternoon for softer light.' },
      ] },
    { name: 'Leisure', pct: 60, trend: '+1.2 pts vs last month', objective: 'Evaluate leisure facility photos for quality, brand alignment and visual appeal.', insight: 'Famille and Golf photos are below brand quality standards.',
      sub: [
        { name: 'Fitness overview', pct: 82, trend: '+2.0 pts vs last month', objective: 'Verify fitness overview images are sharp, well-lit and active in feel.',  insight: '1 image is too dark — replace with a well-lit alternative.' },
        { name: 'Salle fitness',    pct: 70, trend: '+1.5 pts vs last month', objective: 'Ensure fitness room photos convey energy and cleanliness.',                 insight: '2 images have cluttered backgrounds — restage before reshoot.' },
        { name: 'Famille',          pct: 45, trend: '-0.8 pts vs last month', objective: 'Verify family facility photos are vibrant, joyful and brand-compliant.',    insight: '3 images are poorly lit and lack energy. A dedicated family-focused reshoot is recommended.' },
        { name: 'Golf',             pct: 42, trend: '+0.5 pts vs last month', objective: 'Ensure golf course photos are landscape-quality and aspirational.',          insight: '3 images taken in overcast conditions — reshoot on a clear day for vibrant, aspirational results.' },
      ] },
    { name: 'Surrounding', pct: 50, trend: '+0.5 pts vs last month', objective: 'Evaluate neighbourhood and destination photos for quality and relevance.', insight: 'CDG, DisneyLand Paris and Paris Orly sections are critically below quality standards.',
      sub: [
        { name: 'Destination',                        pct: 68, trend: '+1.8 pts vs last month', objective: 'Ensure destination photos are iconic, sharp and aspirational.',           insight: '2 images are too generic — replace with more distinctive and location-specific shots.' },
        { name: 'Around the hotel - Beaugrenelle',    pct: 62, trend: '+1.2 pts vs last month', objective: 'Verify Beaugrenelle photos are clear and visually engaging.',             insight: '1 image has motion blur — reshoot with a faster shutter speed.' },
        { name: 'Around the hotel - Paris',           pct: 65, trend: '+1.0 pts vs last month', objective: 'Ensure Paris landmark photos are high-resolution and well-composed.',    insight: '2 images are underexposed — reshoot during golden hour or use post-processing correction.' },
        { name: 'Around the hotel - Galeries Lafayette', pct: 58, trend: '+0.8 pts vs last month', objective: 'Verify Galeries Lafayette photos convey the shopping experience.',  insight: '2 images are cropped awkwardly — reframe to show the iconic dome or store entrance.' },
        { name: 'Around the hotel - Dupleix',         pct: 52, trend: '+0.5 pts vs last month', objective: 'Ensure Dupleix neighbourhood photos are vibrant and welcoming.',         insight: '2 images are poorly composed — apply the rule of thirds for better visual balance.' },
        { name: 'Around the hotel - CDG',             pct: 28, trend: '-0.5 pts vs last month', objective: 'Verify CDG airport photos meet minimum quality for guest wayfinding.',   insight: 'Images are low-resolution and taken with insufficient lighting. A reshoot with professional equipment is needed.' },
        { name: 'Around the hotel - DisneyLand Paris', pct: 25, trend: '-1.0 pts vs last month', objective: 'Ensure DisneyLand Paris photos are vibrant and family-friendly.',     insight: 'All images are below quality threshold. Source high-resolution editorial or partnership imagery.' },
        { name: 'Around the hotel - Paris Orly',      pct: 30, trend: '-0.3 pts vs last month', objective: 'Verify Paris Orly photos meet brand standards for transport documentation.', insight: 'Images are blurry and underexposed. A reshoot with proper lighting is required.' },
      ] },
    { name: 'Meetings & Events', pct: 68, trend: '+2.0 pts vs last month', objective: 'Assess event space photography for professional quality and brand alignment.', insight: 'Affaires and Mariages sections need quality improvement.',
      sub: [
        { name: 'Overview',  pct: 85, trend: '+2.0 pts vs last month', objective: 'Verify meetings overview images are sharp, professional and brand-compliant.',      insight: '1 image has an overexposed window — use HDR or curtains during reshoot.' },
        { name: 'Dupleix',   pct: 72, trend: '+1.5 pts vs last month', objective: 'Ensure Dupleix room photos convey a professional and welcoming atmosphere.',        insight: '1 image shows empty chairs in disarray — restage before reshoot.' },
        { name: 'Eiffel',    pct: 78, trend: '+2.5 pts vs last month', objective: 'Highlight the Eiffel room\'s view with crisp, high-resolution photography.',        insight: '1 window shot has lens flare — reshoot with appropriate lens filter.' },
        { name: 'Affaires',  pct: 52, trend: '+0.5 pts vs last month', objective: 'Ensure Affaires room photos reflect corporate professionalism and precision.',       insight: '2 images are poorly lit. Reshoot with controlled lighting to convey a premium business environment.' },
        { name: 'Mariages',  pct: 58, trend: '+1.0 pts vs last month', objective: 'Verify wedding space photos are romantic, elegant and aspirational.',               insight: '2 images lack decorative styling. Work with a wedding stylist for a dedicated reshoot.' },
      ] },
    { name: 'Parking', pct: 85, trend: '+1.0 pts vs last month', objective: 'Ensure parking photos are clear, well-lit and informative.', insight: '1 image has poor lighting — a brighter replacement will bring quality above 90%.',
      sub: [
        { name: 'Overview', pct: 85, trend: '+1.0 pts vs last month', objective: 'Verify parking overview photos are clear, bright and help guests navigate easily.', insight: '1 image taken in low light — reshoot during daytime for maximum clarity.' },
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

const TABS_META = [
  { title: 'Content completion', scoreType: 'content', tooltipPlacement: 'bottom-left',  pct: 51, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo completion',   scoreType: 'media',   tooltipPlacement: 'bottom-left',  pct: 92, trend: '+0.2 pts vs last month', stars: false },
  { title: 'Photo quality',      scoreType: 'quality', tooltipPlacement: 'bottom-right', pct: 50, trend: null, stars: true, starValue: 2.5 },
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2D4CD5', borderRadius: 4, padding: '4px 12px', marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'white', fontFamily: 'Inter, sans-serif', letterSpacing: 0.3 }}>NEW FEATURE</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#050033', margin: 0, fontFamily: 'Montserrat, sans-serif', lineHeight: 1.3 }}>
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
            We've built a smarter way to manage your hotel content. Your dashboard now gives you <strong style={{ color: '#232136' }}>3 key scores</strong> so you always know where you stand.
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, marginBottom: 20, border: '1px solid transparent' }}>

        <Card style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
          <div>
            <CardTitle scoreType="global">Your total Score</CardTitle>
            <p style={{ fontSize: 14, fontWeight: 400, color: '#898C8E', margin: '0 0 0', fontFamily: 'Roboto, sans-serif' }}>Updated on 12/02/2026</p>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24 }}>
            <SemiGauge pct={77.5} trend="+ 0.2 pts vs last month" />
            <div>
              <div style={{ marginBottom: 8 }}>
                <ScoreBadge score={77.5} size="sm" />
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
                                  <span style={{ fontSize: 13, color: isSubSelected ? '#2D4CD5' : '#5E5B73', fontWeight: isSubSelected ? 600 : 400, width: 353, flexShrink: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</span>
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
      {showOnboarding && <OnboardingPopup onClose={onCloseOnboarding} />}

    </div>
  )
}
