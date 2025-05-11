'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QRScanPage() {
  const [ticketInfo, setTicketInfo] = useState(null)
  const [error, setError] = useState(null)
  const qrRef = useRef(null)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });
  
    scanner.render(
      async (decodedText) => {
        try {
          const qrData = JSON.parse(decodedText);
          console.log('QR content:', qrData);
  
          const res = await fetch(`/api/ticket/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketNo: qrData.ticketNo })
          });
  
          const data = await res.json();
          setTicketInfo(data);
        } catch (err) {
          setError('Invalid QR Code');
        }
  
        scanner.clear();
      },
      (err) => {
        console.warn('Scan error:', err);
      }
    );
  
    const qrElement = qrRef.current; // Store the current value
  
    return () => {
      if (qrElement) {
        qrElement.remove();
      }
    };
  }, []);  

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Scan Boarding Pass</h1>
      <div id="qr-reader" ref={qrRef} className="w-full max-w-md mx-auto rounded-xl overflow-hidden" />

      {ticketInfo && (
        <div className="mt-6 p-4 bg-white/20 backdrop-blur rounded-xl text-white">
          <h2 className="text-xl font-semibold mb-2">✅ Ticket Matched</h2>
          <p><strong>Ticket No:</strong> {ticketInfo.ticketNo}</p>
          <p><strong>Airline:</strong> {ticketInfo.airline}</p>
          <p><strong>Travel Time:</strong> {new Date(ticketInfo.travelDate).toLocaleString()}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-200">{error}</p>}
    </div>
  )
}
