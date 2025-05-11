'use client'
import { useEffect, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useLang } from '@/context/LangContext'
import { QRCodeCanvas } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { useMap } from '@/context/MapProvider'

const airportLocation = { lat: 17.241, lng: 78.429 }

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [position, setPosition] = useState(null)
  const [targetLocation, setTargetLocation] = useState(null)
  const [downloadTicketId, setDownloadTicketId] = useState(null)
  const [error, setError] = useState(null)

  const { lang, t } = useLang()

  const { isLoaded } = useMap()
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  // })

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      if (data?.user) {
        setUser(data.user)
        setBookings(data.bookings || [])
      }
      setServices(data.services || [])
    }
    fetchData()
  }, [lang])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => setError(t('location_error'))
      )
    } else {
      setError(t('geolocation_unsupported'))
    }
  }, [lang])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6 space-y-6 pt-20">
      <h1 className="text-3xl font-bold text-center mb-6">
        {user?.name ? `${t('welcome')}, ${user.name} 👋` : `${t('welcome')} – ${t('guest_traveler')}`}
      </h1>

      {/* Current Location */}
      <div className="bg-white/20 p-4 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-2">📍 {t('current_location')}</h2>
        {isLoaded ? (
          <div className="h-64 rounded overflow-hidden border border-white/50">
            <GoogleMap
              zoom={13}
              center={position || airportLocation}
              mapContainerClassName="w-full h-full"
            >
              {position && <Marker position={position} />}
            </GoogleMap>
          </div>
        ) : (
          <p>{t('loading_map')}</p>
        )}
        {error && <p className="text-red-300 mt-2">{error}</p>}
      </div>

      {/* Bookings */}
      {user?.name && (
        <div className="bg-white/20 p-4 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-3">📋 {t('my_bookings')}</h2>
          {bookings.length > 0 ? (
            <ul className="space-y-2">
              {bookings.map((b) => (
                <li key={b._id} className="border border-white/30 rounded p-2 bg-white/10">
                  <p><strong>Ticket No:</strong> {b.ticketNo}</p>
                  <p><strong>{t('airline')}:</strong> {b.airline}</p>
                  <p><strong>{t('travel_time')}:</strong> {new Date(b.travelDate).toLocaleString()}</p>

                  <button
                    onClick={() => setDownloadTicketId(b._id)}
                    className="mt-2 px-3 py-1 bg-green-400 text-black rounded hover:bg-green-300"
                  >
                    Download Boarding Pass
                  </button>

                  {downloadTicketId === b._id && (
                    <div>
                      <div id={`boarding-pass-${b._id}`} className="bg-white text-black p-4 mt-4 rounded w-full max-w-md mx-auto shadow-md">
                        <h3 className="font-bold text-xl mb-2">🛫 Boarding Pass</h3>
                        <p><strong>Ticket No:</strong> {b.ticketNo}</p>
                        <p><strong>Airline:</strong> {b.airline}</p>
                        <p><strong>Travel Time:</strong> {new Date(b.travelDate).toLocaleString()}</p>
                        <p className="mt-2">📱 Scan this code at airport:</p>
                        <QRCodeCanvas
                          value={JSON.stringify({
                            ticketNo: b.ticketNo,
                            airline: b.airline,
                            travelDate: b.travelDate
                          })}
                          size={150}
                          className="mt-2 mx-auto"
                        />
                      </div>

                      <button
                        onClick={() => {
                          const el = document.getElementById(`boarding-pass-${b._id}`)
                          html2canvas(el).then((canvas) => {
                            const link = document.createElement('a')
                            link.download = `boarding-pass-${b.ticketNo}.png`
                            link.href = canvas.toDataURL()
                            link.click()
                          })
                        }}
                        className="mt-2 px-4 py-1 bg-blue-300 text-black rounded hover:bg-blue-200"
                      >
                        📥 Save as Image
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('no_bookings')}</p>
          )}
        </div>
      )}

      {/* Airport Services */}
      <div className="bg-white/20 p-4 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-3">🌟 {t('airport_services')}</h2>
        {services.length > 0 ? (
          <ul className="space-y-4">
            {services.map((s) => (
              <li key={s._id} className="border border-white/30 rounded p-3 bg-white/10">
                <h3 className="font-bold text-lg">{s.name} ({s.type})</h3>
                <p className="text-white/80">{s.description}</p>
                <p className="text-sm text-white/60">🕐 {t('open')}: {s.openTime} – {s.closeTime}</p>
                {s.location?.lat && s.location?.lng && position && (
                  <button
                    onClick={() => setTargetLocation({ name: s.name, lat: s.location.lat, lng: s.location.lng })}
                    className="mt-2 px-3 py-1 bg-yellow-300 text-black rounded hover:bg-yellow-200"
                  >
                    {t('get_directions')}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t('no_services')}</p>
        )}
      </div>

      {/* Map Directions */}
      {targetLocation && position && (
        <div className="bg-white/10 mt-4 p-4 rounded shadow-xl">
          <h3 className="text-lg font-bold mb-2">🧭 {t('get_directions')} → {targetLocation.name}</h3>
          <iframe
            width="100%"
            height="350"
            className="rounded"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${position.lat},${position.lng}&destination=${targetLocation.lat},${targetLocation.lng}&mode=walking`}
          ></iframe>
        </div>
      )}
    </div>
  )
}
