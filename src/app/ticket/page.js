'use client'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMap } from '@/context/MapProvider'

export default function TicketEntry() {
  const router = useRouter()

  const { isLoaded } = useMap()

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  //   libraries: ['places']
  // })

  const [form, setForm] = useState({
    ticketNo: '', airline: '', travelDate: '',
    address: '', coordinates: null
  })

  const center = useMemo(() => ({ lat: 17.385, lng: 78.4867 }), [])
  const [marker, setMarker] = useState(null)

  const handleMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    setMarker(coords)
    setForm({ ...form, coordinates: coords })
    localStorage.setItem('ticketCoords', JSON.stringify(coords))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId') // optional
    const res = await fetch('/api/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }),
    })

    if (res.ok) router.push('/')
  }

  if (!isLoaded) return <p className="text-center text-white">Loading map...</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-white pt-20">
      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🛫 Ticket Details & Address</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-2 border border-white/50 bg-white/20 text-white rounded" placeholder="Ticket No"
              value={form.ticketNo} onChange={(e) => setForm({ ...form, ticketNo: e.target.value })} required />

            <input className="p-2 border border-white/50 bg-white/20 text-white rounded" placeholder="Airline"
              value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} required />

            <input type="datetime-local" className="p-2 border border-white/50 bg-white/20 text-white rounded col-span-2"
              value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} required />
          </div>

          <input className="w-full p-2 border border-white/50 bg-white/20 text-white rounded" placeholder="Enter Address"
            value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />

          <p className="text-white/80 mb-2">Or pick location on map 👇</p>
          <div className="h-[300px] rounded overflow-hidden border border-white/50">
            <GoogleMap zoom={13} center={center} mapContainerClassName="w-full h-full" onClick={handleMapClick}>
              {marker && <Marker position={marker} />}
            </GoogleMap>
          </div>

          <button type="submit" className="w-full bg-white text-pink-600 font-bold py-2 rounded-md hover:bg-pink-100 transition">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  )
}
