import { useState } from 'react'
import { Toaster } from 'sonner'
import HotelCard from './components/HotelCard'
import { SearchInput } from './components/SearchInput'
import ComponentsPage from './pages/ComponentsPage'
import DashboardPage from './pages/DashboardPage'
import OverviewPage from './pages/OverviewPage'
import DetailsPage from './pages/DetailsPage'

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY      = '#050033'
const SIDEBAR_W = 68
const HEADER_H  = 68

// ─── Hotels data ─────────────────────────────────────────────────────────────
const HOTELS = [
  {
    id: 1, selected: true,
    brand: 'Pullman',
    code: '[6765]',
    name: 'A0G5 - Pullman Sydney Penrith',
    updated: 'Updated on 12/02/2026',
    score: 48,
    img: 'url(https://images.trvl-media.com/lodging/94000000/93520000/93518700/93518690/e94b74ee.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill)',
  },
  {
    id: 2, selected: false,
    brand: 'Mercure',
    code: '[9876]',
    name: 'Mercure Aix-les-Bains Domaine de Marlioz',
    updated: 'Updated on 12/02/2026',
    score: 48,
    img: 'url(https://www.ahstatic.com/photos/2945_ho_02_p_2048x1536.jpg)',
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
function HamburgerIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <rect width="20" height="2" rx="1" fill="white"/>
      <rect y="6" width="20" height="2" rx="1" fill="white"/>
      <rect y="12" width="20" height="2" rx="1" fill="white"/>
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function AccorLogo() {
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
      {/* monogramme — A symbol, 25.32×25.90 at (19.56, 6.61) */}
      <g transform="translate(19.562902 6.611520)">
        <path fill="white" d="M 25.3193416595459 25.5061301897318 L 19.058656692504883 25.5061301897318 L 14.459651947021484 16.409314410481237 C 11.941949367523193 17.69975578016762 10.51525330543518 20.710785006986256 7.9807658195495605 22.68627524571604 C 6.688345193862915 23.68995185333775 5.160938858985901 24.59803982944179 3.2810542583465576 25.20343203206153 C 2.4250353574752808 25.474265395276362 0.9647663831710815 25.8406870174798 0.42765647172927856 25.888481139523527 C 0.19267089664936066 25.904412514158984 0.04160875268280506 25.904413484597175 0.008039383217692375 25.82475661700783 C -0.02552998624742031 25.761031118466 0.04160952568054199 25.713236586640313 0.2933797836303711 25.601716973505344 C 0.578719437122345 25.47426597642169 1.720078468322754 25.028188283841086 2.441819906234741 24.55024709320616 C 3.348192870616913 23.96078625963394 3.8517329171299934 23.307598757778653 3.9020869731903076 22.81372619809621 C 3.6503167152404785 21.985294828811178 1.8879252672195435 20.153187090323026 3.7006711959838867 16.791667267621737 C 4.3384891748428345 15.580882862382255 4.909166872501373 14.720587860932445 5.311999320983887 13.844362324900201 C 5.7651858031749725 12.840685717278491 6.100880041718483 11.422794944932818 6.201588153839111 10.371324349377844 C 6.201588153839111 10.307598850836017 6.218373265117407 10.307599338849082 6.2519426345825195 10.339462088119996 C 7.124746203422546 11.183824886057199 10.532037258148193 14.497548455848555 10.028496742248535 17.795342802359762 C 11.153070569038391 17.381127117717245 13.116879522800446 16.13848203074312 14.023252487182617 15.469364351933296 C 14.979979455471039 14.76838387542378 15.601012229919434 14.035539951151371 16.60809326171875 14.019608576515914 C 17.51446622610092 14.003677201880457 17.59838992357254 14.417893964994594 18.303346633911133 14.513482209082044 C 18.487978160381317 14.529413583717501 18.739747866988182 14.497551100804863 18.874025344848633 14.433825602263036 C 18.924379400908947 14.401962852992122 18.907594747841358 14.354167332101788 18.840456008911133 14.338235957466331 C 17.850159645080566 14.11519673119639 17.615172624588013 13.35049155335723 16.356321334838867 13.35049155335723 C 15.214962720870972 13.35049155335723 14.30858963727951 14.338237298570938 13.653986930847168 14.752452983213454 L 10.448113441467285 8.395833633810868 C 9.1053386926651 5.735294049200496 9.508171081542969 3.807598156031875 12.462275505065918 0 L 25.3193416595459 25.5061301897318 Z"/>
      </g>
      {/* typogramme — ACCOR wordmark, 50.04×6.64 at (6.98, 38.75) */}
      <g transform="translate(6.982429 38.745098)">
        <path fill="white" d="M 50.035144805908196 6.452208513062758 L 47.85313585200387 3.98284569150754 C 49.01127908200636 3.727943719032537 49.699451120692146 3.1066187308140716 49.699451120692146 2.007353975702601 C 49.699451120692146 0.7806382818328206 48.59165789367012 0.1593137304229173 47.198529068009265 0.1593137304229173 L 42.834511160200606 0.1593137304229173 L 42.834511160200606 6.452208513062758 L 43.992658472019286 6.452208513062758 L 43.992658472019286 4.078430040265919 L 46.59428453244368 4.078430040265919 L 48.591660935023356 6.452208513062758 L 50.035144805908196 6.452208513062758 Z M 43.992658472019286 1.147058372858083 L 47.23210048544252 1.147058372858083 C 48.03776536197529 1.147058372858083 48.50773751371934 1.4975485873851717 48.50773751371934 2.102940755395587 C 48.50773751371934 2.708332923406002 48.004195945432315 3.1066201741814945 47.23210048544252 3.1066201741814945 L 43.992658472019286 3.1066201741814945 L 43.992658472019286 1.147058372858083 Z"/>
        <path fill="white" d="M 3.4240758453176747 0.17524607583905194 L 0 6.468135996609678 L 1.3092058845705115 6.468135996609678 L 2.0309471797280425 5.066177113635692 L 5.92499405629121 5.066177113635692 L 6.646734711163849 6.468135996609678 L 7.989509452028052 6.468135996609678 L 4.565434887280161 0.17524607583905194 L 3.4240758453176747 0.17524607583905194 Z M 2.5512721356989645 4.078430040265919 L 3.994755366298918 1.3223044486971351 L 5.43823795661398 4.078430040265919 L 2.5512721356989645 4.078430040265919 Z"/>
        <path fill="white" d="M 14.132704915937609 0.9877446424351658 C 15.223709392889774 0.9877446424351658 16.11329613003213 1.3701004973783548 16.58326728133104 2.0710809264325323 L 17.523210624391808 1.4816181791200524 C 16.868607922213386 0.6053926617940073 15.71046517242456 0.015932345416134645 14.132704915937609 0.015932345416134645 C 11.598217528527936 0.015932345416134645 10.13794954963869 1.5931388235633026 10.13794954963869 3.329658424399736 C 10.13794954963869 5.0661780252361694 11.598217528527936 6.64338207244873 14.132704915937609 6.64338207244873 C 15.71046517242456 6.64338207244873 16.868607922213386 6.037992829156515 17.523210624391808 5.17769866967942 L 16.58326728133104 4.588235922366939 C 16.13008079828581 5.273284993572166 15.223709392889774 5.671567344495092 14.132704915937609 5.671567344495092 C 12.420667153349994 5.671567344495092 11.329661876041715 4.76348290980647 11.329661876041715 3.3455907698158707 C 11.312877191530802 1.911767196009615 12.420667153349994 0.9877446424351658 14.132704915937609 0.9877446424351658 Z"/>
        <path fill="white" d="M 24.656700154663106 0.9877446424351658 C 25.74770463161527 0.9877446424351658 26.637293929897194 1.3701004973783548 27.107265081196104 2.0710809264325323 L 28.047208424256873 1.4816181791200524 C 27.39260572207845 0.6053926617940073 26.234460411150057 0.015932345416134645 24.656700154663106 0.015932345416134645 C 22.122212767253433 0.015932345416134645 20.661946068933972 1.5931388235633026 20.661946068933972 3.329658424399736 C 20.661946068933972 5.0661780252361694 22.122212767253433 6.64338207244873 24.656700154663106 6.64338207244873 C 26.234460411150057 6.64338207244873 27.39260572207845 6.037992829156515 28.047208424256873 5.17769866967942 L 27.107265081196104 4.588235922366939 C 26.654078598150875 5.273284993572166 25.74770463161527 5.671567344495092 24.656700154663106 5.671567344495092 C 22.944662392075493 5.671567344495092 21.85366095647656 4.76348290980647 21.85366095647656 3.3455907698158707 C 21.836876271965647 1.911767196009615 22.944662392075493 0.9877446424351658 24.656700154663106 0.9877446424351658 Z"/>
        <path fill="white" d="M 35.18069667395839 0 C 32.64620928654871 0 31.185941307659466 1.577206478147168 31.185941307659466 3.3137260789836014 C 31.185941307659466 5.050245679820035 32.64620928654871 6.627449727032595 35.18069667395839 6.627449727032595 C 37.71518406136806 6.627449727032595 39.175452040257305 5.050245679820035 39.175452040257305 3.3137260789836014 C 39.175452040257305 1.577206478147168 37.71518406136806 0 35.18069667395839 0 Z M 35.18069667395839 5.639707515532037 C 33.468658911370774 5.639707515532037 32.377654914632274 4.7316182189742 32.377654914632274 3.3137260789836014 C 32.377654914632274 1.8958339389930026 33.48544349958884 0.9877446424351658 35.18069667395839 0.9877446424351658 C 36.892734436546 0.9877446424351658 37.98373843328449 1.8958339389930026 37.98373843328449 3.3137260789836014 C 38.00052311779541 4.7316182189742 36.892734436546 5.639707515532037 35.18069667395839 5.639707515532037 Z"/>
      </g>
    </svg>
  )
}

// ─── HCM Custom sidebar icons — paths exacts extraits du Figma ───────────────

// 1. ICON HCM - Home (pentagon/maison, stroke #1E1852)
function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(3,3)">
        <path
          d="M 0 6.8096 L 8.9762 0 L 17.9525 6.8096 L 17.9525 18.5715 L 0 18.5715 Z"
          fill="none" stroke="#1E1852" strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}

// 2. Gauge (demi-cercle + aiguille, stroke #0F172B)
function IconGauge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(2,4)">
        {/* Aiguille */}
        <path d="M 10 10 L 14 6" stroke="#0F172B" strokeWidth="2" strokeLinecap="round"/>
        {/* Demi-cercle */}
        <path
          d="M 1.34 15 C 0.462 13.48 0 11.756 0 10 C 0 8.245 0.462 6.52 1.34 5 C 2.217 3.48 3.48 2.218 5 1.34 C 6.52 0.462 8.245 0 10 0 C 11.755 0 13.48 0.462 15 1.34 C 16.52 2.218 17.783 3.48 18.66 5 C 19.538 6.52 20 8.245 20 10 C 20 11.756 19.538 13.48 18.66 15"
          stroke="#0F172B" strokeWidth="2" strokeLinecap="round" fill="none"
        />
      </g>
    </svg>
  )
}

// 3. ICON HCM - Content (4 rectangles asymétriques, stroke #1E1852)
function IconContent() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3"  y="14" width="8" height="7"  fill="none" stroke="#1E1852" strokeWidth="1.5"/>
      <rect x="3"  y="3"  width="8" height="10" fill="none" stroke="#1E1852" strokeWidth="1.5"/>
      <rect x="13" y="13" width="8" height="8"  fill="none" stroke="#1E1852" strokeWidth="1.5"/>
      <rect x="13" y="3"  width="8" height="8"  fill="none" stroke="#1E1852" strokeWidth="1.5"/>
    </svg>
  )
}

// 4. ICON HCM - Photos (appareil photo solid + cercle lens, fill #1E1852)
function IconPhotos() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* Corps appareil photo */}
      <g transform="translate(3,4)">
        <path
          d="M 17.03 14.612 L 0.75 14.612 C 0.552 14.61 0.363 14.53 0.223 14.39 C 0.082 14.25 0.003 14.06 0 13.862 L 0 3.002 C 0.003 2.804 0.082 2.615 0.223 2.475 C 0.363 2.335 0.552 2.255 0.75 2.252 L 3.65 2.252 L 4.12 0.512 C 4.173 0.354 4.278 0.217 4.417 0.125 C 4.557 0.032 4.723 -0.011 4.89 0.002 L 12.89 0.002 C 13.055 0.001 13.216 0.054 13.348 0.153 C 13.48 0.253 13.576 0.393 13.62 0.552 L 14.09 2.292 L 16.99 2.292 C 17.188 2.295 17.377 2.375 17.517 2.515 C 17.658 2.655 17.737 2.844 17.74 3.042 L 17.74 13.862 C 17.738 14.054 17.664 14.237 17.532 14.376 C 17.4 14.515 17.221 14.6 17.03 14.612 Z M 1.5 13.112 L 16.28 13.112 L 16.28 3.752 L 13.56 3.752 C 13.395 3.752 13.235 3.699 13.103 3.599 C 12.971 3.5 12.876 3.361 12.83 3.202 L 12.36 1.462 L 5.42 1.462 L 4.95 3.202 C 4.904 3.361 4.809 3.5 4.677 3.599 C 4.545 3.699 4.385 3.752 4.22 3.752 L 1.5 3.752 Z"
          fill="#1E1852"
        />
      </g>
      {/* Objectif circulaire */}
      <g transform="translate(8,8)">
        <path
          d="M 3.88 7.76 C 3.113 7.76 2.362 7.532 1.724 7.106 C 1.086 6.68 0.589 6.074 0.295 5.365 C 0.002 4.656 -0.075 3.876 0.075 3.123 C 0.224 2.37 0.594 1.679 1.136 1.136 C 1.679 0.594 2.37 0.224 3.123 0.075 C 3.876 -0.075 4.656 0.002 5.365 0.295 C 6.074 0.589 6.68 1.086 7.106 1.724 C 7.532 2.362 7.76 3.113 7.76 3.88 C 7.76 4.909 7.351 5.896 6.624 6.624 C 5.896 7.351 4.909 7.76 3.88 7.76 Z M 3.88 1.51 C 3.409 1.51 2.948 1.65 2.557 1.912 C 2.165 2.174 1.86 2.546 1.68 2.982 C 1.5 3.417 1.454 3.896 1.546 4.358 C 1.639 4.82 1.867 5.244 2.201 5.576 C 2.535 5.909 2.96 6.135 3.422 6.225 C 3.884 6.316 4.363 6.268 4.798 6.086 C 5.232 5.904 5.603 5.598 5.864 5.205 C 6.124 4.812 6.262 4.351 6.26 3.88 C 6.257 3.251 6.005 2.648 5.559 2.204 C 5.113 1.759 4.509 1.51 3.88 1.51 Z"
          fill="#1E1852"
        />
      </g>
    </svg>
  )
}

// 5. ICON HCM - Documents (page avec coin replié, stroke #1E1852)
function IconDocuments() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* Corps du document */}
      <g transform="translate(5,3)">
        <path
          d="M 0 0 L 8.167 0 C 8.167 0 9.75 0.813 11.5 2.5 C 13.25 4.188 14 5.625 14 5.625 L 14 18 L 0 18 Z"
          fill="none" stroke="#1E1852" strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* Ligne de pli */}
        <path d="M 8.167 0 L 14 5.625" stroke="#1E1852" strokeWidth="1.5" strokeLinejoin="round"/>
      </g>
      {/* Triangle du pli (rempli) */}
      <g transform="translate(13,4)">
        <path
          d="M 0 0 L 2.5 2.5 L 5 5 L 0 5 Z"
          fill="#D9D9D9" stroke="#1E1852" strokeWidth="1.5" strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ selectedHotel }) {
  const label = selectedHotel
    ? `${selectedHotel.code} ${selectedHotel.name}`
    : 'No hotel selected'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: HEADER_H, background: NAVY,
      display: 'flex', alignItems: 'stretch',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <button style={{
          width: 68, height: 68, flexShrink: 0,
          background: NAVY, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: '1px solid rgba(255,255,255,0.12)',
          flexDirection: 'column', gap: 3,
        }}>
          <HamburgerIcon />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 0.5 }}>MENU</span>
        </button>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 20, padding: '0 28px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
          Hotel content manager
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
        <AccorLogo />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '0 24px', fontFamily: 'Roboto, sans-serif' }}>
          <span>{label}</span>
          <ChevronDown />
        </div>
        <div style={{ width: 1, height: 68, background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <SettingsIcon />
        </div>
      </div>
    </header>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'home',       icon: <IconHome />,      label: 'Home' },
  { key: 'score',      icon: <IconGauge />,     label: 'Score' },
  { key: 'overview',   icon: <IconContent />,   label: 'Overview' },
  { key: 'photos',     icon: <IconPhotos />,    label: 'Photos' },
  { key: 'documents',  icon: <IconDocuments />, label: 'Documents' },
]

function Sidebar({ page, setPage, hotelSelected }) {
  return (
    <aside style={{
      position: 'fixed', top: HEADER_H, left: 0, bottom: 0, zIndex: 100,
      width: SIDEBAR_W, background: 'white',
      borderRight: '1px solid #EBEBF5',
    }}>
      {/* Nav icons — y:85 in Figma = 17px below header */}
      <div style={{ padding: '17px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {NAV.map(item => {
          const active = page === item.key
          const disabled = !hotelSelected && item.key !== 'home'
          return (
            <button
              key={item.key}
              onClick={() => { if (!disabled) setPage(item.key) }}
              title={item.label}
              disabled={disabled}
              style={{
                width: 40, height: 40, borderRadius: 6, border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: active ? '#F3EFFF' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s, box-shadow 0.15s',
                opacity: disabled ? 0.35 : 1,
              }}
              onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = '#F7F5FF' }}
              onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent' }}
            >
              {item.icon}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage({ selectedHotelId, onSelectHotel }) {
  const [search, setSearch] = useState('')
  const visible = HOTELS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '36px 40px', background: '#F7F9FB', minHeight: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.2, margin: 0 }}>
          Hello John Good 👋
        </h1>
        <p style={{ fontSize: 15, color: '#3E3D48', marginTop: 10, marginBottom: 0 }}>
          Welcome to your one-stop platform for editing and managing your hotel content.
        </p>
      </div>

      <div style={{ marginBottom: 28, width: 240 }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search for a hotel…"
        />
      </div>

      <section>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#3E3D48', marginBottom: 16, marginTop: 0 }}>
          Hotels
        </h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {visible.map(h => (
            <HotelCard
              key={h.id}
              hotel={h}
              selected={h.id === selectedHotelId}
              onSelect={() => onSelectHotel(h.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')
  const [selectedHotelId, setSelectedHotelId] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)

  const selectedHotel = HOTELS.find(h => h.id === selectedHotelId) ?? null

  function handleDescriptionClick(element) {
    setSelectedElement(element)
    setPage('description')
  }

  function handleBackFromDescription() {
    setPage('overview')
    setSelectedElement(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Inter, sans-serif' }}>
      <Toaster position="bottom-right" richColors />
      <Header selectedHotel={selectedHotel} />
      <Sidebar page={page} setPage={setPage} hotelSelected={!!selectedHotel} />
      <main style={{ marginLeft: SIDEBAR_W, marginTop: HEADER_H }}>
        {page === 'description' ? <DetailsPage element={selectedElement} onBack={handleBackFromDescription} />
          : page === 'overview'  ? <OverviewPage onDescriptionClick={handleDescriptionClick} />
          : page === 'score'     ? <DashboardPage />
          : page === 'components'? <ComponentsPage />
          : <HomePage selectedHotelId={selectedHotelId} onSelectHotel={setSelectedHotelId} />}
      </main>
    </div>
  )
}
