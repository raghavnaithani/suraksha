import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  email: string
  name?: string
  // identity fields (optional and additive)
  identityMode?: 'anonymous' | 'otp' | 'aadhaar' | 'worker'
  phone?: string
  aadhaarId?: string
  workerId?: string
  identityVerified?: boolean
  biometricConsent?: boolean
}

type AuthContextType = {
  user: User | null
  login: (payload: { email: string }) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
    // runtime logging for debugging and audit
    try {
      // eslint-disable-next-line no-console
      console.log('[AuthProvider] user changed:', user)
    } catch (e) {}
  }, [user])

  type LoginPayload = {
    email: string
    name?: string
    identityMode?: User['identityMode']
    phone?: string
    aadhaarId?: string
    workerId?: string
  }

  const login = async (payload: LoginPayload) => {
    // Mask Aadhaar before storing locally for privacy: show only last 4 digits
    let maskedAadhaar: string | undefined = undefined
    if (payload.aadhaarId) {
      const digits = String(payload.aadhaarId).replace(/\D/g, '')
      maskedAadhaar = digits.length >= 4 ? '************' + digits.slice(-4) : '****'
    }

    const fakeUser: User = {
      email: payload.email,
      name: payload.name ?? (payload.email.split('@')[0] || 'User'),
      identityMode: payload.identityMode ?? 'otp',
      phone: payload.phone,
      aadhaarId: maskedAadhaar,
      workerId: payload.workerId,
      identityVerified: payload.identityMode === 'worker' ? true : false,
      biometricConsent: false,
    }
    setUser(fakeUser)
    // runtime logging for audit
    try {
      // eslint-disable-next-line no-console
      console.log('[Auth] login', { payload, fakeUser })
      // log via event logger
      const { logEvent } = await import('./event-logger')
      logEvent('auth_login', { payload, fakeUser })
    } catch (e) {}
    return fakeUser
  }

  const logout = () => {
    // eslint-disable-next-line no-console
    console.log('[Auth] logout', { user })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
