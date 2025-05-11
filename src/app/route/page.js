'use client'
import { useEffect, useState } from 'react'

const airportCoords = { lat: 17.241, lng: 78.429 }

export default function RouteSuggestion() {
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState(null)
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/ticket/future')
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []))
  }, [])

  const fetchRoute = async (ticket, mode) => {
    setLoading(true)
    setError(null)
    setRouteData(null)

    const res = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin: ticket.coordinates, destination: airportCoords, mode })
    })

    const data = await res.json()
    if (!res.ok) setError(data.error || 'Failed to fetch route')
    else setRouteData({ ...data, mode, ticket })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-blue-600 p-6 text-white pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">🧭 Travel Suggestions</h1>

      <div className="grid gap-4 md:grid-cols-2">
      {tickets.map(t => (
        <div key={t._id} className="bg-white/20 rounded p-4">
          <p><strong>✈️ Airline:</strong> {t.airline}</p>
          <p><strong>🗓 Travel Time:</strong> {new Date(t.travelDate).toLocaleString()}</p>
          <p><strong>📍 Address:</strong> {t.address}</p>
          <button className="mt-2 bg-yellow-300 text-black px-3 py-1 rounded hover:bg-yellow-200"
            onClick={() => {
              setSelected(t)
              setRouteData(null)  // 🧹 Clear old route details
              setError(null)
            }}>
            View Route
          </button>
        </div>
      ))}
      </div>

      {selected && (
        <>
          <div className="bg-white/10 p-4 mt-8 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-2">Select Mode for {selected.airline}</h2>
            <div className="flex gap-3">
              {['driving', 'transit', 'walking'].map(mode => (
                <button
                  key={mode}
                  className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100"
                  onClick={() => fetchRoute(selected, mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="mt-4 text-yellow-100">⏳ Calculating...</p>}
          {error && <p className="mt-2 text-red-200">{error}</p>}
        </>
      )}

      {routeData && (
        <div className="bg-white/20 p-4 mt-6 rounded shadow-lg">
          <h3 className="text-xl font-bold capitalize mb-2">{routeData.mode} Route</h3>
          <p><strong>🛣 Summary:</strong> {routeData.summary}</p>
          <p><strong>📏 Distance:</strong> {routeData.distance}</p>
          <p><strong>⏱ Duration:</strong> {routeData.duration}</p>
          <p><strong>💰 Cost:</strong> ₹{
            routeData.mode === 'driving' ? '2500' :
            routeData.mode === 'transit' ? '450' : '0 (walk)'
          }</p>
        </div>
      )}
    </div>
  )
}
