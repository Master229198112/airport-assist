'use client'
import { useLoadScript } from '@react-google-maps/api'
import { createContext, useContext } from 'react'

const MapContext = createContext()

export function MapProvider({ children }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  return (
    <MapContext.Provider value={{ isLoaded }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMap() {
  return useContext(MapContext)
}
