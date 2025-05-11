'use client'
import { useEffect, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useMap } from '@/context/MapProvider'
import { toast } from 'react-hot-toast'

export default function AdminPanel() {
  const [form, setForm] = useState({
    name: '', type: '', description: '', openTime: '', closeTime: '', location: null
  })
  const [services, setServices] = useState([])
  const center = { lat: 17.241, lng: 78.429 }
  const { isLoaded } = useMap()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    let data = {}
    try {
      data = await res.json()
    } catch {}

    if (res.ok) {
      toast.success('✅ Service added successfully!')
      setForm({
        name: '', type: '', description: '',
        openTime: '', closeTime: '', location: null
      })
      fetchServices()
    } else {
      toast.error('❌ Failed to add service')
    }
  }

  const fetchServices = async () => {
    const res = await fetch('/api/services')
    const data = await res.json()
    setServices(data.services || [])
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id) => {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('🗑️ Service deleted')
      setServices((prev) => prev.filter((s) => s._id !== id))
    } else {
      toast.error('❌ Failed to delete service')
    }
  }

  const handleEdit = (service) => {
    setForm(service)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6 space-y-6 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">⚙️ Admin Panel - Manage Airport Services</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 bg-white/20 backdrop-blur rounded-xl p-6 shadow-lg">
        {['name', 'type', 'description'].map((f) => (
          <input key={f} placeholder={f} className="w-full p-2 rounded text-black" required
            value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <div className="grid grid-cols-2 gap-4">
          <input type="time" className="p-2 rounded text-black" required
            value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
          <input type="time" className="p-2 rounded text-black" required
            value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
        </div>

        <p className="text-sm text-white/80">📍 Pick Location</p>
        {isLoaded ? (
          <div className="h-60 border rounded overflow-hidden mb-2">
            <GoogleMap
              zoom={14}
              center={center}
              mapContainerClassName="w-full h-full"
              onClick={(e) => {
                setForm({ ...form, location: { lat: e.latLng.lat(), lng: e.latLng.lng() } })
              }}
            >
              {form.location && <Marker position={form.location} />}
            </GoogleMap>
          </div>
        ) : <p>Loading Map...</p>}

        <button className="bg-white text-blue-600 font-semibold py-2 w-full rounded hover:bg-blue-100">Save Service</button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-2">📋 Existing Services</h2>
      <ul className="space-y-3">
        {services.map((s) => (
          <li key={s._id} className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold">{s.name} ({s.type})</h3>
              <p className="text-sm">{s.openTime}–{s.closeTime}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="bg-yellow-300 text-black px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mb-15"></div>
    </div>
  )
}


