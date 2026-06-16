import { useState } from 'react'
import { ScoreGauge } from '../components/ScoreGauge'
import { ScoreBadge } from '../components/ScoreBadge'
import { SearchInput } from '../components/SearchInput'
import { getScoreLevel } from '../lib/scoreColors'

// ─── Data ─────────────────────────────────────────────────────────────────────
const BRAND_DOCS = [
  { id: 1, title: 'Content brand Guidelines', count: '3 documents (PDF)' },
  { id: 2, title: 'Image brand Guidelines',   count: '3 documents (PDF)' },
]

const FILTER_CATEGORIES = [
  'All',
  'Hotel',
  'Restaurant & Breakfast',
  'Bars',
  'Rooms & Accommodations',
  'Wellness',
  'Pool',
  'Leisure',
  'Surrounding',
  'Meetings & Events',
  'Parking',
]

const FILTER_STATUSES = ['Published', 'Publications in progress']

// Scores corrélés aux données Dashboard :
// content → Tab 0, photos → Tab 1 (Media), quality → Tab 2 (Photo Quality)
const HO0 = 'https://www.ahstatic.com/photos/1598_ho_00_p_1024x768.jpg'
const HO1 = 'https://www.ahstatic.com/photos/1598_ho_01_p_1024x768.jpg'
const HO2 = 'https://www.ahstatic.com/photos/1598_ho_02_p_1024x768.jpg'
const HO3 = 'https://www.ahstatic.com/photos/1598_ho_03_p_1024x768.jpg'
const HO4 = 'https://www.ahstatic.com/photos/1598_ho_04_p_1024x768.jpg'
const HO5 = 'https://www.ahstatic.com/photos/1598_ho_05_p_1024x768.jpg'
const BR0 = 'https://www.ahstatic.com/photos/1598_br_00_p_1024x768.jpg'
const BR1 = 'https://www.ahstatic.com/photos/1598_br_01_p_1024x768.jpg'
const BR2 = 'https://www.ahstatic.com/photos/1598_br_02_p_1024x768.jpg'
const BR3 = 'https://www.ahstatic.com/photos/1598_br_03_p_1024x768.jpg'
const BR4 = '/breakfast-type.jpg'
const BAB = 'https://www.ahstatic.com/photos/1598_bab002_00_p_1024x768.jpg'
const RO1 = 'https://www.ahstatic.com/photos/1598_rodbc_00_p_1024x768.jpg'
const RO2 = 'https://www.ahstatic.com/photos/1598_rodbch_00_p_1024x768.jpg'
const RO3 = 'https://www.ahstatic.com/photos/1598_rodbaci_00_p_1024x768.jpg'
const RO4 = 'https://www.ahstatic.com/photos/1598_rodba_00_p_1024x768.jpg'
const RO5 = 'https://www.ahstatic.com/photos/1598_rotwc_00_p_1024x768.jpg'
const RO6 = 'https://www.ahstatic.com/photos/1598_rodbabc_00_p_1024x768.jpg'
const RO7 = 'https://www.ahstatic.com/photos/1598_rosad_00_p_1024x768.jpg'
const RO8 = 'https://www.ahstatic.com/photos/1598_rodbc_01_p_1024x768.jpg'
const RO9 = 'https://www.ahstatic.com/photos/1598_rodba_01_p_1024x768.jpg'
const SP0 = '/spa.jpg'
const SP1 = '/thalasso.jpg'
const SP2 = '/institut.jpeg'
const PO0 = '/pool-overview.jpg'
const FI0 = 'https://www.ahstatic.com/photos/1598_fi_00_p_1024x768.jpg'
const FI1 = '/salle-fitness.jpeg'
const FI2 = '/famille.avif'
const FI3 = '/golf.jpeg'
const SU0 = 'https://www.ahstatic.com/photos/2945_ho_00_p_1024x768.jpg'
const SU1 = 'https://www.ahstatic.com/photos/2945_ho_01_p_1024x768.jpg'
const SU2 = 'https://www.ahstatic.com/photos/2945_ho_02_p_1024x768.jpg'
const SU3 = 'https://www.ahstatic.com/photos/2945_ho_03_p_1024x768.jpg'
const SU4 = 'https://www.ahstatic.com/photos/2945_ho_04_p_1024x768.jpg'
const SU5 = 'https://www.ahstatic.com/photos/2945_ho_05_p_1024x768.jpg'
const SU6 = 'https://www.ahstatic.com/photos/2945_br_00_p_1024x768.jpg'
const SU7 = 'https://www.ahstatic.com/photos/2945_fi_00_p_1024x768.jpg'
const SM0 = 'https://www.ahstatic.com/photos/1598_sm_00_p_1024x768.jpg'
const SM1 = 'https://www.ahstatic.com/photos/1598_sm_01_p_1024x768.jpg'
const SM2 = 'https://www.ahstatic.com/photos/1598_sm_02_p_1024x768.jpg'
const SM3 = 'https://www.ahstatic.com/photos/1598_sm_03_p_1024x768.jpg'
const SM4 = 'https://www.ahstatic.com/photos/1598_sm_04_p_1024x768.jpg'
const PA0 = 'https://www.ahstatic.com/photos/1598_pa_00_p_1024x768.jpg'

const ELEMENTS = [
  // Hotel
  { id:  1, category: 'Hotel', name: 'Hotel overview',          published: true,  content: 72, photos: 90, quality: 88, filterKey: 'Hotel', img: HO0, photoCount: 12, showPhoto: true,  showDesc: true  },
  { id:  2, category: 'Hotel', name: 'Services',                published: true,  content: 65, photos: 72, quality: 70, filterKey: 'Hotel', img: HO1, photoCount: 8,  showPhoto: true,  showDesc: false },
  { id:  3, category: 'Hotel', name: 'Hotel advantages',        published: true,  content: 70, photos: 80, quality: 78, filterKey: 'Hotel', img: HO2, photoCount: 6,  showPhoto: true,  showDesc: false },
  { id:  4, category: 'Hotel', name: 'Sustainable development', published: false, content: 30, photos: 38, quality: 40, filterKey: 'Hotel', img: HO3, photoCount: 3,  showPhoto: true,  showDesc: false },
  { id:  6, category: 'Hotel', name: 'Label',                   published: false, content: 40, photos: 42, quality: 45, filterKey: 'Hotel', img: '/placeholder-accor.png', photoCount: 3,  showPhoto: true,  showDesc: false },
  // Restaurant & Breakfast
  { id:  7, category: 'Restaurant & Breakfast', name: 'Restaurant overview', published: true,  content: 75, photos: 85, quality: 82, filterKey: 'Restaurant & Breakfast', img: BR0, photoCount: 10, showPhoto: true,  showDesc: false },
  { id:  8, category: 'Restaurant & Breakfast', name: 'Chef',                published: true,  content: 55, photos: 55, quality: 55, filterKey: 'Restaurant & Breakfast', img: BR1, photoCount: 4,  showPhoto: true,  showDesc: false },
  { id:  9, category: 'Restaurant & Breakfast', name: 'Anecdote',            published: false, content: 45, photos: 48, quality: 48, filterKey: 'Restaurant & Breakfast', img: BR2, photoCount: 3,  showPhoto: true,  showDesc: false },
  { id: 10, category: 'Restaurant & Breakfast', name: 'Breakfast',           published: true,  content: 80, photos: 88, quality: 85, filterKey: 'Restaurant & Breakfast', img: BR3, photoCount: 9,  showPhoto: true,  showDesc: false },
  { id: 11, category: 'Restaurant & Breakfast', name: 'Breakfast type',      published: true,  content: 58, photos: 60, quality: 60, filterKey: 'Restaurant & Breakfast', img: BR4, photoCount: 5,  showPhoto: true, showDesc: false },
  // Bars
  { id: 12, category: 'Bars', name: 'Le Pondichery', published: true, content: 62, photos: 68, quality: 65, filterKey: 'Bars', img: BAB, photoCount: 6, showPhoto: true, showDesc: false },
  // Rooms & Accommodations
  { id: 13, category: 'Rooms & Accommodations', name: 'Rooms overview',                                    published: true,  content: 80, photos: 88, quality: 85, filterKey: 'Rooms & Accommodations', img: RO1, photoCount: 10, showPhoto: true, showDesc: true  },
  { id: 14, category: 'Rooms & Accommodations', name: 'Chambre Classique - 2 lits simples',                published: true,  content: 68, photos: 75, quality: 72, filterKey: 'Rooms & Accommodations', img: RO2, photoCount: 7,  showPhoto: true, showDesc: false },
  { id: 15, category: 'Rooms & Accommodations', name: 'Junior Suite Privilège - 1 canapé-lit 2 personnes', published: false, content: 48, photos: 50, quality: 45, filterKey: 'Rooms & Accommodations', img: RO3, photoCount: 4,  showPhoto: true, showDesc: false },
  { id: 16, category: 'Rooms & Accommodations', name: 'Chambre Privilège - 1 lit double',                  published: true,  content: 64, photos: 67, quality: 65, filterKey: 'Rooms & Accommodations', img: RO4, photoCount: 6,  showPhoto: true, showDesc: false },
  { id: 17, category: 'Rooms & Accommodations', name: 'Chambre Privilège, terrasse - 1 lit double',        published: true,  content: 68, photos: 72, quality: 70, filterKey: 'Rooms & Accommodations', img: RO5, photoCount: 7,  showPhoto: true, showDesc: false },
  { id: 18, category: 'Rooms & Accommodations', name: 'Chambre privilège vue Tour Eiffel',                 published: true,  content: 75, photos: 80, quality: 78, filterKey: 'Rooms & Accommodations', img: RO6, photoCount: 8,  showPhoto: true, showDesc: false },
  { id: 19, category: 'Rooms & Accommodations', name: 'Chambre standard accessible avec 1 lit double',     published: false, content: 38, photos: 42, quality: 38, filterKey: 'Rooms & Accommodations', img: RO7, photoCount: 3,  showPhoto: true, showDesc: false },
  { id: 20, category: 'Rooms & Accommodations', name: 'Chambre standard avec 1 lit double',                published: true,  content: 65, photos: 70, quality: 68, filterKey: 'Rooms & Accommodations', img: RO8, photoCount: 6,  showPhoto: true, showDesc: false },
  { id: 21, category: 'Rooms & Accommodations', name: 'Suite',                                             published: true,  content: 52, photos: 55, quality: 55, filterKey: 'Rooms & Accommodations', img: RO9, photoCount: 5,  showPhoto: true, showDesc: false },
  // Wellness
  { id: 22, category: 'Wellness', name: 'Spa',      published: true,  content: 70, photos: 78, quality: 75, filterKey: 'Wellness', img: SP0, photoCount: 8, showPhoto: true, showDesc: false },
  { id: 23, category: 'Wellness', name: 'Thalasso', published: false, content: 30, photos: 35, quality: 32, filterKey: 'Wellness', img: SP1, photoCount: 2, showPhoto: true, showDesc: false },
  { id: 24, category: 'Wellness', name: 'Institut', published: true,  content: 58, photos: 62, quality: 60, filterKey: 'Wellness', img: SP2, photoCount: 5, showPhoto: true, showDesc: false },
  // Pool
  { id: 25, category: 'Pool', name: 'Pool overview', published: true, content: 78, photos: 82, quality: 80, filterKey: 'Pool', img: PO0, photoCount: 7, showPhoto: true, showDesc: false },
  // Leisure
  { id: 26, category: 'Leisure', name: 'Fitness overview', published: true,  content: 78, photos: 85, quality: 82, filterKey: 'Leisure', img: FI0, photoCount: 8, showPhoto: true,  showDesc: false },
  { id: 27, category: 'Leisure', name: 'Salle fitness',    published: true,  content: 65, photos: 72, quality: 70, filterKey: 'Leisure', img: FI1, photoCount: 6, showPhoto: true, showDesc: false },
  { id: 28, category: 'Leisure', name: 'Famille',          published: false, content: 42, photos: 48, quality: 45, filterKey: 'Leisure', img: FI2, photoCount: 3, showPhoto: true,  showDesc: false },
  { id: 29, category: 'Leisure', name: 'Golf',             published: false, content: 40, photos: 45, quality: 42, filterKey: 'Leisure', img: FI3, photoCount: 3, showPhoto: true,  showDesc: false },
  // Surrounding
  { id: 30, category: 'Surrounding', name: 'Destination',                          published: true,  content: 65, photos: 70, quality: 68, filterKey: 'Surrounding', img: SU0, photoCount: 6, showPhoto: true, showDesc: false },
  { id: 31, category: 'Surrounding', name: 'Around the hotel - Beaugrenelle',      published: true,  content: 60, photos: 65, quality: 62, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 2, showPhoto: true, showDesc: false },
  { id: 32, category: 'Surrounding', name: 'Around the hotel - Paris',             published: true,  content: 62, photos: 68, quality: 65, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 3, showPhoto: true, showDesc: false },
  { id: 33, category: 'Surrounding', name: 'Around the hotel - Galeries Lafayette',published: true,  content: 55, photos: 60, quality: 58, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 2, showPhoto: true, showDesc: false },
  { id: 34, category: 'Surrounding', name: 'Around the hotel - Dupleix',           published: true,  content: 50, photos: 55, quality: 52, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 2, showPhoto: true, showDesc: false },
  { id: 35, category: 'Surrounding', name: 'Around the hotel - CDG',               published: false, content: 25, photos: 30, quality: 28, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 1, showPhoto: true, showDesc: false },
  { id: 36, category: 'Surrounding', name: 'Around the hotel - DisneyLand Paris',  published: false, content: 22, photos: 28, quality: 25, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 1, showPhoto: true, showDesc: false },
  { id: 37, category: 'Surrounding', name: 'Around the hotel - Paris Orly',        published: false, content: 28, photos: 32, quality: 30, filterKey: 'Surrounding', img: '/placeholder-accor.png', photoCount: 2, showPhoto: true, showDesc: false },
  // Meetings & Events
  { id: 38, category: 'Meetings & Events', name: 'Overview',  published: true,  content: 80, photos: 88, quality: 85, filterKey: 'Meetings & Events', img: SM0, photoCount: 9, showPhoto: true, showDesc: false },
  { id: 39, category: 'Meetings & Events', name: 'Dupleix',   published: true,  content: 68, photos: 75, quality: 72, filterKey: 'Meetings & Events', img: SM1, photoCount: 6, showPhoto: true, showDesc: false },
  { id: 40, category: 'Meetings & Events', name: 'Eiffel',    published: true,  content: 74, photos: 80, quality: 78, filterKey: 'Meetings & Events', img: SM2, photoCount: 7, showPhoto: true, showDesc: false },
  { id: 41, category: 'Meetings & Events', name: 'Affaires',  published: false, content: 50, photos: 58, quality: 52, filterKey: 'Meetings & Events', img: SM3, photoCount: 4, showPhoto: true, showDesc: false },
  { id: 42, category: 'Meetings & Events', name: 'Mariages',  published: false, content: 55, photos: 62, quality: 58, filterKey: 'Meetings & Events', img: SM4, photoCount: 5, showPhoto: true, showDesc: false },
  // Parking
  { id: 43, category: 'Parking', name: 'Overview', published: true, content: 82, photos: 88, quality: 85, filterKey: 'Parking', img: '/placeholder-accor.png', photoCount: 4, showPhoto: true, showDesc: false },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

// Figma node 625-19274 — "💠 website-32" container: 56×56, bg #F9F9FF
// Vector fill: #050033. Rendered at 32×32 via viewBox scaling.

function ContentDocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="8" fill="#F9F9FF"/>
      {/* Document/text vector — 30×30, centered at (13,13) */}
      <g transform="translate(13,13)">
        <path fill="#050033" d="M 3.190146729139747 30 C 2.3101467293384292 30 1.5583824245427111 29.688381800978835 0.9348530324416929 29.065146520523506 C 0.3116177519863643 28.441617128422486 0 27.68985237659197 0 26.80985237679065 L 0 3.190146729139747 C 0 2.3101467293384292 0.3116177519863643 1.5583824245427111 0.9348530324416929 0.9348530324416929 C 1.5583824245427111 0.3116177519863643 2.3101467293384292 0 3.190146729139747 0 L 26.80985237679065 0 C 27.68985237659197 0 28.441617128422486 0.3116177519863643 29.065146520523506 0.9348530324416929 C 29.688381800978835 1.5583824245427111 30 2.3101467293384292 30 3.190146729139747 L 30 26.80985237679065 C 30 27.68985237659197 29.688381800978835 28.441617128422486 29.065146520523506 29.065146520523506 C 28.441617128422486 29.688381800978835 27.68985237659197 30 26.80985237679065 30 L 3.190146729139747 30 Z M 3.190146729139747 27.352941246593694 L 26.80985237679065 27.352941246593694 C 26.968381776193237 27.352941246593694 27.098526682325073 27.302056076214228 27.20029137926965 27.20029137926965 C 27.302056076214228 27.098526682325073 27.352941246593694 26.968381776193237 27.352941246593694 26.80985237679065 L 27.352941246593694 6.176470623296847 L 2.6470587534063057 6.176470623296847 L 2.6470587534063057 26.80985237679065 C 2.6470587534063057 26.968381776193237 2.6979412415769706 27.098526682325073 2.7997059385215493 27.20029137926965 C 2.901470635466128 27.302056076214228 3.0316173297371605 27.352941246593694 3.190146729139747 27.352941246593694 Z M 6.176470623296847 14.558823143734683 L 6.176470623296847 11.911764390328376 L 23.82352878065675 11.911764390328376 L 23.82352878065675 14.558823143734683 L 6.176470623296847 14.558823143734683 Z M 6.176470623296847 21.617646883515764 L 6.176470623296847 18.97058813010946 L 16.764705040875672 18.97058813010946 L 16.764705040875672 21.617646883515764 L 6.176470623296847 21.617646883515764 Z"/>
      </g>
    </svg>
  )
}

function ImageDocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="8" fill="#F9F9FF"/>
      {/* Photo/landscape vector — 29×29, centered at (13.5,13.5) */}
      <g transform="translate(13.5,13.5)">
        <path fill="#050033" d="M 3.083808719410616 29 C 2.2220538055195527 29 1.4926470588235294 28.701470588235296 0.8955882352941177 28.104411764705883 C 0.29852941176470593 27.50735294117647 0 26.777946194480446 0 25.916191280589384 L 0 3.083808719410616 C 0 2.2220538055195527 0.29852941176470593 1.4926470588235294 0.8955882352941177 0.8955882352941177 C 1.4926470588235294 0.29852941176470593 2.2220538055195527 0 3.083808719410616 0 L 25.916191280589384 0 C 26.777946194480446 0 27.50735294117647 0.29852941176470593 28.104411764705883 0.8955882352941177 C 28.701470588235296 1.4926470588235294 29 2.2220538055195527 29 3.083808719410616 L 29 25.916191280589384 C 29 26.777946194480446 28.701470588235296 27.50735294117647 28.104411764705883 28.104411764705883 C 27.50735294117647 28.701470588235296 26.777946194480446 29 25.916191280589384 29 L 3.083808719410616 29 Z M 3.083808719410616 26.441176470588236 L 25.916191280589384 26.441176470588236 C 26.047544218512144 26.441176470588236 26.167809867157658 26.386447116907906 26.276986335305608 26.276986335305608 C 26.386447116907906 26.167809867157658 26.441176470588236 26.047544218512144 26.441176470588236 25.916191280589384 L 26.441176470588236 3.083808719410616 C 26.441176470588236 2.9524557814878576 26.386447116907906 2.832190132842345 26.276986335305608 2.7230136646943937 C 26.167809867157658 2.6135528830920953 26.047544218512144 2.558823529411765 25.916191280589384 2.558823529411765 L 3.083808719410616 2.558823529411765 C 2.9524557814878576 2.558823529411765 2.832191434327294 2.6135528830920953 2.723014966179343 2.7230136646943937 C 2.6135541845770445 2.832190132842345 2.558823529411765 2.9524557814878576 2.558823529411765 3.083808719410616 L 2.558823529411765 25.916191280589384 C 2.558823529411765 26.047544218512144 2.6135541845770445 26.167809867157658 2.723014966179343 26.276986335305608 C 2.832191434327294 26.386447116907906 2.9524557814878576 26.441176470588236 3.083808719410616 26.441176470588236 Z M 5.544117647058823 22.60294117647059 L 23.5868091358858 22.60294117647059 L 17.977440239401425 15.12349979176241 L 13.187750468534583 21.35636717852424 L 9.77598576265223 16.993146694407745 L 5.544117647058823 22.60294117647059 Z M 8.529411764705882 10.661764705882353 C 9.1199313584496 10.661764705882353 9.622882570939906 10.453931591090035 10.038264914119946 10.038264914119946 C 10.453931591090035 9.622882570939906 10.661764705882353 9.1199313584496 10.661764705882353 8.529411764705882 C 10.661764705882353 7.938892170962165 10.453931591090035 7.43594095847186 10.038264914119946 7.0205586152918205 C 9.622882570939906 6.604891938321732 9.1199313584496 6.397058823529412 8.529411764705882 6.397058823529412 C 7.938892170962165 6.397058823529412 7.43594095847186 6.604891938321732 7.0205586152918205 7.0205586152918205 C 6.604891938321732 7.43594095847186 6.397058823529412 7.938892170962165 6.397058823529412 8.529411764705882 C 6.397058823529412 9.1199313584496 6.604891938321732 9.622882570939906 7.0205586152918205 10.038264914119946 C 7.43594095847186 10.453931591090035 7.938892170962165 10.661764705882353 8.529411764705882 10.661764705882353 Z"/>
      </g>
    </svg>
  )
}

function BrandDocCard({ doc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, background: 'white', border: '1px solid #EBEBF5', borderRadius: 8,
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: hovered ? '0 4px 16px rgba(5,0,51,0.07)' : '0 1px 3px rgba(5,0,51,0.03)',
        transition: 'box-shadow 0.18s',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {doc.id === 1 ? <ContentDocIcon /> : <ImageDocIcon />}
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif' }}>{doc.title}</p>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280', fontFamily: 'Roboto, sans-serif' }}>{doc.count}</p>
        </div>
      </div>
      <a href="#" onClick={e => e.preventDefault()}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, fontWeight: 500, color: '#0051AE', textDecoration: 'none',
          fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Consult
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0051AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    </div>
  )
}

// Badge statut — Figma: bg #eaedf5, text #3d4892, r:2, fs:12 (non-published)
function StatusBadge({ published }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 2,
      background: published ? '#DCFCE7' : '#eaedf5',
      color: published ? '#166534' : '#3d4892',
      fontSize: 12, fontWeight: 400, fontFamily: 'Roboto, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {published ? 'Published' : 'Publications in progress'}
    </span>
  )
}

// Star path — Figma node 625-19307, 9×9 px, fill #FD5C1C (filled) / #DBD9E4 (empty)
const STAR_PATH = 'M 8.917928640969684 3.6893834090112603 L 6.764977001218264 5.7198272200551585 L 7.368497404752128 8.689438358042938 C 7.412861447258389 8.907974488638311 7.191045513534554 9.076047628108858 7.006886419179194 8.964583301589236 L 4.4999317434414445 7.444952212436576 L 1.9929762502598791 8.964133329016136 C 1.8088171559045194 9.075596530604324 1.5869968795104166 8.907524100911946 1.6309473465365043 8.689427215864939 L 2.234467954431322 5.71981564933185 L 0.0819451789139278 3.6893722668332596 C -0.0766815049181507 3.5397346108189596 0.008702519627507205 3.266780501370036 0.2204822741395927 3.2439641298054216 L 3.100834351277951 2.9280062453336178 L 4.276954324236909 0.15420509190392204 C 4.3623352322780224 -0.0472215681615597 4.632704307905063 -0.056433444175783554 4.723948133734898 0.15683818141084735 L 5.898782063211841 2.928055528044005 L 8.779134038169722 3.2440134125158084 C 9.01811237083366 3.395848441291436 9.03694397727152 3.577523381164148 8.918083137850727 3.689425834996724 L 8.917928640969684 3.6893834090112603 Z'

function StarRow({ pct }) {
  const filled = Math.round(pct / 20) // 0–5
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 9 9" fill="none">
          <path fill={i < filled ? '#FD5C1C' : '#DBD9E4'} d={STAR_PATH} />
        </svg>
      ))}
    </div>
  )
}

// Colonne de score — variant 'bar' (défaut) ou 'star' (qualité)
function ScoreColumn({ label, pct, variant = 'bar' }) {
  const starValue = Math.round(pct / 20) // 0–5
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      {/* Label */}
      <span style={{ fontSize: 11, fontWeight: 400, color: '#050033', fontFamily: 'Roboto, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </span>
      {/* Gauge : barre horizontale ou étoiles */}
      {variant === 'star' ? (
        <StarRow pct={pct} />
      ) : (
        <div style={{ width: '100%' }}>
          <ScoreGauge pct={pct} height={5} />
        </div>
      )}
      {/* Value */}
      <span style={{ fontSize: 14, fontWeight: 500, color: '#050033', fontFamily: 'Roboto, sans-serif' }}>
        {variant === 'star' ? `${starValue}/5` : `${pct}%`}
      </span>
    </div>
  )
}

function ElementCard({ el, onDescriptionClick }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 6,
        border: '1px solid #DADADD',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(5,0,51,0.04)',
      }}
    >
      {/* ── Image ── Figma: pad 16/16/0/16, r:6,6,24,0 */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <div style={{
          backgroundImage: el.img ? `url(${el.img})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: el.img ? '#C4C4D4' : '#EBEBF5',
          borderRadius: '6px 6px 24px 0px',
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '4 / 3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}>
          {el.img ? (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 40%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <StatusBadge published={el.published} />
              </div>
            </>
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A9A8BB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
                <line x1="2" y1="2" x2="22" y2="22" stroke="#A9A8BB" strokeWidth="1.5"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 400, color: '#A9A8BB', fontFamily: 'Roboto, sans-serif' }}>No media</span>
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <StatusBadge published={el.published} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Heading ── Figma: pad:16/16/16/16, gap:16 */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 400, color: '#5e5b73', fontFamily: 'Roboto, sans-serif' }}>
          {el.category}
        </p>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#232136', fontFamily: 'Roboto, sans-serif', lineHeight: 1.3 }}>
          {el.name}
        </p>
      </div>

      {/* ── Score columns ── flex so visible columns always start from the left */}
      {(el.showDesc || el.showPhoto) && (
        <div style={{ padding: '16px 16px 0 16px', display: 'flex', gap: 16 }}>
          {el.showDesc  && <div style={{ flex: '1 1 0' }}><ScoreColumn label="Content" pct={el.content} /></div>}
          {el.showPhoto && <div style={{ flex: '1 1 0' }}><ScoreColumn label="Photos"  pct={el.photos}  /></div>}
          {el.showPhoto && <div style={{ flex: '1 1 0' }}><ScoreColumn label="Quality" pct={el.quality} variant="star" /></div>}
        </div>
      )}

      {/* ── Buttons ── */}
      {(el.showDesc || el.showPhoto) && (
        <div style={{ padding: '16px', display: 'flex', gap: 16, marginTop: 'auto' }}>
          {el.showDesc && (
            <button
              onClick={() => onDescriptionClick(el)}
              style={{
                flex: 1, height: 40,
                border: '1px solid #050033', borderRadius: 100,
                background: 'white', fontSize: 16, fontWeight: 400, color: '#1f1b4b',
                cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5fb'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Description
            </button>
          )}
          {el.showPhoto && (
            <button
              style={{
                flex: 1, height: 40,
                border: '1px solid #050033', borderRadius: 100,
                background: 'white', fontSize: 16, fontWeight: 400, color: '#1f1b4b',
                cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5fb'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Media
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function CheckItem({ label, checked, onChange, bold }) {
  const [hovered, setHovered] = useState(false)
  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', padding: '5px 6px', borderRadius: 5,
        background: hovered ? 'rgba(45,76,213,0.05)' : 'transparent',
        transition: 'background 0.15s',
        marginLeft: -6,
      }}>
      <div
        onClick={onChange}
        style={{
          width: 16, height: 16, borderRadius: 3, flexShrink: 0,
          border: checked ? 'none' : '1.5px solid #DDDDE8',
          background: checked ? '#2D4CD5' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{
        fontSize: bold ? 16 : 14, fontWeight: bold ? 500 : 400,
        color: '#374151', fontFamily: 'Roboto, sans-serif',
      }}>
        {label}
      </span>
    </label>
  )
}


// ─── Overview Page ─────────────────────────────────────────────────────────────
export default function OverviewPage({ onDescriptionClick }) {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState(['All'])
  const [activeStatuses, setActiveStatuses] = useState([])
  const [sortBy, setSortBy] = useState('alpha')

  function toggleCategory(cat) {
    if (cat === 'All') {
      setActiveCategories([...FILTER_CATEGORIES])
      return
    }
    setActiveCategories(prev => {
      const withoutAll = prev.filter(c => c !== 'All')
      return withoutAll.includes(cat)
        ? withoutAll.filter(c => c !== cat)
        : [...withoutAll, cat]
    })
  }

  function toggleStatus(s) {
    setActiveStatuses(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const filtered = ELEMENTS.filter(el => {
    const matchSearch = !search ||
      el.name.toLowerCase().includes(search.toLowerCase()) ||
      el.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategories.includes('All') ||
      activeCategories.includes(el.filterKey)
    const matchStatus = activeStatuses.length === 0 ||
      (activeStatuses.includes('Published') && el.published) ||
      (activeStatuses.includes('Publications in progress') && !el.published)
    return matchSearch && matchCat && matchStatus
  }).sort((a, b) => {
    if (sortBy === 'content-asc') return a.content - b.content
    if (sortBy === 'photos-asc')  return a.photos  - b.photos
    if (sortBy === 'quality-asc') return a.quality  - b.quality
    return a.name.localeCompare(b.name) // alpha (default)
  })

  return (
    <div style={{ padding: '36px 40px', background: '#F7F9FB', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#050033', margin: 0 }}>Overview</h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>Everything about your hotel, at a glance.</p>
      </div>

      {/* Main layout: filter left + content right */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── Filter panel ── */}
        <div style={{
          width: 297, flexShrink: 0,
        }}>

          <p style={{ fontSize: 18, fontWeight: 500, color: '#252339', margin: '0 0 14px', fontFamily: 'Roboto, sans-serif' }}>
            All elements ({ELEMENTS.length})
          </p>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search an element"
            />
          </div>

          {/* Category filters */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, marginBottom: 16 }}>
            {FILTER_CATEGORIES.map(cat => (
              <CheckItem
                key={cat}
                label={cat}
                bold={cat === 'All'}
                checked={activeCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            ))}
          </div>

          {/* Status filters */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#252339', margin: '0 0 10px', fontFamily: 'Roboto, sans-serif' }}>Status</p>
            {FILTER_STATUSES.map(s => (
              <CheckItem
                key={s}
                label={s}
                checked={activeStatuses.includes(s)}
                onChange={() => toggleStatus(s)}
              />
            ))}
          </div>
        </div>

        {/* ── Content area ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Brand guidelines */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {BRAND_DOCS.map(doc => <BrandDocCard key={doc.id} doc={doc} />)}
          </div>

          {/* Sort + action bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
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
                <option value="content-asc">Content score : low to high</option>
                <option value="photos-asc">Photo score : low to high</option>
                <option value="quality-asc">Quality : low to high</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#050033', border: '1px solid #524f81', borderRadius: 100,
                color: '#f9f9ff', fontSize: 16, fontWeight: 400,
                padding: '12px 16px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                transition: 'background 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a1460'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(82,79,129,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#050033'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create new element
            </button>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
              No elements match the current filters.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {filtered.map(el => <ElementCard key={el.id} el={el} onDescriptionClick={onDescriptionClick} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
