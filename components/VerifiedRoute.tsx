import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

export default function VerifiedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />
  if (auth.user?.identityMode === 'anonymous') return <Navigate to="/pwa/anonymous" replace />
  return <>{children}</>
}
