'use client'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '', email: '', mobile: '',
    personalId: '', passportNumber: '',
    currentPassword: '', newPassword: ''
  })

  useEffect(() => {
    fetch('/api/profile')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then(data => {
        setForm(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          passportNumber: data.passportNumber || '',
          personalId: data.personalId || '',
          currentPassword: '',
          newPassword: ''
        }))
      })
      .catch(err => {
        alert(err.message)
      })
  }, [])  
  

  const updateProfile = async () => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    alert((await res.json()).message)
  }

  const changePassword = async () => {
    const res = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    })
    alert((await res.json()).message)
  }

  return (
    <div className="p-6 max-w-xl mx-auto mt-20">
  <h1 className="text-2xl font-bold mb-6">👤 My Profile</h1>

  <div className="grid grid-cols-1 gap-4 mb-6">
    <label>
      <strong>Name:</strong>
      <input
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
    </label>

    <label>
      <strong>Email ID:</strong>
      <input
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
    </label>

    <label>
      <strong>Mobile No.:</strong>
      <input
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.mobile}
        onChange={e => setForm({ ...form, mobile: e.target.value })}
      />
    </label>

    <label>
      <strong>Passport No.:</strong>
      <input
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.passportNumber}
        onChange={e => setForm({ ...form, passportNumber: e.target.value })}
      />
    </label>

    <label>
      <strong>Personal ID No.:</strong>
      <input
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.personalId}
        onChange={e => setForm({ ...form, personalId: e.target.value })}
      />
    </label>
  </div>

  <button
    onClick={updateProfile}
    className="px-4 py-2 rounded bg-blue-600 text-white w-full mb-8"
  >
    Update Profile
  </button>

  <hr className="my-6" />

  <div className="grid grid-cols-1 gap-4">
    <label>
      <strong>Current Password:</strong>
      <input
        type="password"
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.currentPassword}
        onChange={e => setForm({ ...form, currentPassword: e.target.value })}
      />
    </label>

    <label>
      <strong>New Password:</strong>
      <input
        type="password"
        className="border border-gray-400 rounded w-full p-2 mt-1"
        value={form.newPassword}
        onChange={e => setForm({ ...form, newPassword: e.target.value })}
      />
    </label>
  </div>

  <button
    onClick={changePassword}
    className="px-4 py-2 rounded bg-green-600 text-white w-full mt-4"
  >
    Change Password
  </button>
</div>
  )
}
