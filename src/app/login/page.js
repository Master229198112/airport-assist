'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-sky-400 to-blue-600 p-4 pt-20">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">
              <FaEnvelope />
            </div>
            <input
              type="email"
              className="pl-10 w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">
              <FaLock />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="pl-10 pr-10 w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="w-full bg-white text-pink-600 font-bold py-2 rounded-md hover:bg-pink-100 transition">
            Login
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-200 font-semibold">{error}</p>}
      </div>
    </div>
  )
}
