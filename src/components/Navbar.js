'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const { lang, setLang, t } = useLang()

  // Fetch username from dashboard
  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.user?.name) {
          setUsername(data.user.name)
        }
      })
  }, [])

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUsername('')
    router.push('/') // Redirect to homepage
  }

  const navItems = [
    { href: '/', label: t('dashboard') },
    { href: '/ticket', label: t('enter_ticket') },
    { href: '/route', label: t('travel_route') },
    { href: '/scan', label: t('scan_qr') },
    { href: '/admin', label: t('admin_panel') },
  ] 
  

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-lg font-bold tracking-wide">🛫 Airport Assist</h1>
        <ul className="flex gap-4 text-sm mt-2 md:mt-0">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:underline ${pathname === item.href ? 'font-bold underline' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-black rounded px-2 py-1 ml-2"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="es">Spanish</option>
          <option value="ru">Russian</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>

          {username ? (
            <>
              <li className="ml-4 font-semibold text-yellow-200">
                <Link href="/profile" className="hover:underline">👤 {username}</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
