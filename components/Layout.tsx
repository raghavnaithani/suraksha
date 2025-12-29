import React, { useEffect } from "react";
import SosButton from "./ui/sos-button";
import { Toaster } from "./ui/toaster";
import { startProcessor, flushQueue } from "../src/lib/sos-queue";
import { logEvent } from "../src/lib/event-logger";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">NWIR</h1>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      {/* Floating SOS button — non-intrusive, always present */}
      <SosButton />
      {/* Global toasts */}
      <Toaster />
      {/* Initialize background SOS processor and connectivity flush */}
      {/* startProcessor will poll and flush when online */}
      <ConnectivityListener />
    </div>
  );
}

function ConnectivityListener() {
  useEffect(() => {
    try {
      startProcessor(30_000) // retry every 30s
      const onOnline = async () => {
        logEvent('navigator_online')
        try {
          await flushQueue()
          logEvent('flush_on_online')
        } catch (e) {
          logEvent('flush_on_online_failed', { err: String(e) })
        }
      }
      window.addEventListener('online', onOnline)
      return () => window.removeEventListener('online', onOnline)
    } catch (e) {}
  }, [])
  return null
}
