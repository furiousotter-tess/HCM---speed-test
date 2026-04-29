import { useState } from 'react'
import HotelCard from '../components/HotelCard'
import { SearchInput } from '../components/SearchInput'

const PULLMAN = {
  id: 1, selected: true,
  brand: 'Pullman',
  code: '[6765]',
  name: 'A0G5 - Pullman Sydney Penrith',
  updated: 'Updated on 12/02/2026',
  score: 48,
  img: 'url(https://images.trvl-media.com/lodging/94000000/93520000/93518700/93518690/e94b74ee.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill)',
}

const MERCURE = {
  id: 2, selected: false,
  brand: 'Mercure',
  code: '[9876]',
  name: 'Mercure Aix-les-Bains Domaine de Marlioz',
  updated: 'Updated on 12/02/2026',
  score: 48,
  img: 'url(https://www.ahstatic.com/photos/2945_ho_02_p_2048x1536.jpg)',
}

function SearchShowcase() {
  const [v1, setV1] = useState('')
  const [v2, setV2] = useState('')
  return (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#8B8A93', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 0 }}>
          Default
        </p>
        <SearchInput value={v1} onChange={setV1} placeholder="Search an element" width={240} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#8B8A93', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 0 }}>
          Compact (dashboard)
        </p>
        <SearchInput value={v2} onChange={setV2} placeholder="Search by KPI…" width={180} compact />
      </div>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <div style={{ padding: '40px 40px', fontFamily: 'Inter, sans-serif' }}>

      {/* Page title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#050033', marginBottom: 8, marginTop: 0 }}>
        Components
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 48, marginTop: 0 }}>
        Design system — composants disponibles
      </p>

      {/* Section: Search Input */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#232136', margin: 0, marginBottom: 4 }}>
            Search Input
          </h2>
          <p style={{ fontSize: 13, color: '#8B8A93', margin: 0 }}>
            web.select · Default + Compact variant
          </p>
        </div>
        <SearchShowcase />
      </section>

      {/* Section: Card Hotel */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#232136', margin: 0, marginBottom: 4 }}>
            Card Hotel
          </h2>
          <p style={{ fontSize: 13, color: '#8B8A93', margin: 0 }}>
            web.card-hotel-list · 2 états : Selected / Unselected
          </p>
        </div>

        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Selected */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, color: '#8B8A93', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 12, marginTop: 0,
            }}>
              Selected
            </p>
            <HotelCard hotel={PULLMAN} />
          </div>

          {/* Unselected */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, color: '#8B8A93', textTransform: 'uppercase',
              letterSpacing: 1, marginBottom: 12, marginTop: 0,
            }}>
              Unselected
            </p>
            <HotelCard hotel={MERCURE} />
          </div>

        </div>
      </section>

    </div>
  )
}
