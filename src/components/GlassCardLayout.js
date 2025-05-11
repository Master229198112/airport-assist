'use client'
import { useRouter } from 'next/navigation'

export default function GlassCardLayout({ children, title, showNav = true }) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0'
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-white">
      {showNav && (
        <div className="flex justify-between items-center mb-4 max-w-2xl w-full mx-auto">
          <h1 className="text-xl font-bold drop-shadow">✈️ Airport Assist</h1>
          <div className="space-x-4">
            <button onClick={() => router.push('/dashboard')} className="hover:underline">Dashboard</button>
            <button onClick={() => router.push('/ticket')} className="hover:underline">Ticket</button>
            <button onClick={handleLogout} className="hover:underline text-red-200">Logout</button>
          </div>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          {title && <h2 className="text-3xl font-bold text-center mb-6 drop-shadow">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  )
}
