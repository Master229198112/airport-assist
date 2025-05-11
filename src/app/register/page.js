'use client'
import { useState } from 'react'
import {
  FaUser, FaLock, FaIdCard, FaPassport,
  FaPhone, FaEnvelope, FaHashtag, FaEye, FaEyeSlash
} from 'react-icons/fa'

export default function Register() {
  const [form, setForm] = useState({
    name: '', age: '', email: '', mobile: '',
    password: '', confirmPassword: '', personalId: '', passportNumber: ''
  });
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus('❌ Passwords do not match');
      return;
    }

    const { confirmPassword, ...submitData } = form;
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData),
    });

    setStatus(res.ok ? '✅ Registration successful!' : '❌ Error during registration');
  };

  const fields = [
    { field: 'name', label: 'Full Name', icon: <FaUser /> },
    { field: 'age', label: 'Age', icon: <FaHashtag /> },
    { field: 'email', label: 'Email Address', icon: <FaEnvelope /> },
    { field: 'mobile', label: 'Mobile Number', icon: <FaPhone /> },
    { field: 'personalId', label: 'ID Card Number', icon: <FaIdCard /> },
    { field: 'passportNumber', label: 'Passport Number', icon: <FaPassport /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-4 pt-20">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">Visitor Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ field, label, icon }) => (
            <div key={field} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">
                {icon}
              </div>
              <input
                type={field === 'age' ? 'number' : 'text'}
                className="pl-10 w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder={label}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            </div>
          ))}

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
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">
              <FaLock />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              className="pl-10 pr-10 w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-pink-600 font-bold py-2 rounded-md hover:bg-pink-100 transition"
          >
            Register
          </button>
        </form>
        {status && (
          <p className="mt-4 text-center text-white font-semibold">{status}</p>
        )}
      </div>
    </div>
  );
}
