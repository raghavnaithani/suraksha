import React from 'react'
import { Link } from 'react-router-dom'

export default function PwaAnonymous() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Suraksha (Guest)</h2>
        <p className="mt-2 text-sm text-gray-600">You are using the PWA as a guest. Limited features available.</p>
        <div className="mt-4 grid gap-3">
          <Link to="/sos-anonymous">
            <button className="w-full py-3 bg-red-600 text-white rounded">Emergency SOS</button>
          </Link>
          <Link to="/pwa/report">
            <button className="w-full py-3 border rounded">Report an incident (offline)</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
