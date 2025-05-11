'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import en from '@/i18n/en.json'
import hi from '@/i18n/hi.json'
import es from '@/i18n/es.json'
import ru from '@/i18n/ru.json'
import ta from '@/i18n/ta.json'
import te from '@/i18n/te.json'

const translations = { en, hi, es, ru, ta, te }

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('selectedLang')
    if (saved && translations[saved]) {
      setLang(saved)
    }
  }, [])

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('selectedLang', newLang)
  }

  const t = (key) => translations[lang]?.[key] || key

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
