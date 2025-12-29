import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@lib/auth-context'
import { useToast } from '@lib/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../components/ui/dialog'

export default function Login(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [identityMode, setIdentityMode] = useState<'anonymous'|'otp'|'aadhaar'|'worker'>('otp')
  const [phone, setPhone] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Basic client-side validation per identity mode
      if (identityMode === 'otp') {
        if (!phone.trim()) throw new Error('Phone required for OTP')
        if (!otpSent) throw new Error('Please request OTP first')
        // verify OTP stored in sessionStorage (mock)
        const key = `mock_otp_${phone.replace(/\D/g, '')}`
        const stored = sessionStorage.getItem(key)
        if (!stored || stored !== otp) throw new Error('Invalid OTP')
      }
      if (identityMode === 'aadhaar') {
        const digits = aadhaar.replace(/\D/g, '')
        if (digits.length !== 16) throw new Error('Aadhaar must be 16 digits')
      }

      // For Aadhaar mode ask user consent via modal if not already confirmed
      if (identityMode === 'aadhaar' && !aadhaarConsent) {
        setShowAadhaarConsent(true)
        setLoading(false)
        return
      }

      await auth.login({ email, identityMode, phone: phone || undefined, aadhaarId: aadhaar || undefined })
      navigate('/')
    } catch (err) {
      setError((err as Error).message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = () => {
    if (!phone.trim()) return setError('Phone required')
    const digits = phone.replace(/\D/g, '')
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const key = `mock_otp_${digits}`
    sessionStorage.setItem(key, code)
    setOtpSent(true)
    try {
      console.log('[OTP] mock code for', digits, code)
    } catch (e) {}
    // Show OTP in toast for dev convenience (mock-only)
    toast({ title: 'OTP sent (dev)', description: `Mock OTP for ${phone}: ${code}` })
  }

  const [showAadhaarConsent, setShowAadhaarConsent] = useState(false)
  const [aadhaarConsent, setAadhaarConsent] = useState(false)

  const confirmAadhaar = () => {
    setAadhaarConsent(true)
    setShowAadhaarConsent(false)
    // re-submit after consent
    setTimeout(() => document.getElementById('login-submit')?.click(), 50)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="px-6 py-6 text-center">
          <CardTitle className="text-2xl">Welcome to NWIR</CardTitle>
          <CardDescription className="text-sm">Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Identity Mode</label>
              <div className="flex gap-2">
                <label className="inline-flex items-center"><input type="radio" name="mode" checked={identityMode==='otp'} onChange={()=>setIdentityMode('otp')} className="mr-2"/>OTP</label>
                <label className="inline-flex items-center"><input type="radio" name="mode" checked={identityMode==='anonymous'} onChange={()=>setIdentityMode('anonymous')} className="mr-2"/>Anonymous</label>
                <label className="inline-flex items-center"><input type="radio" name="mode" checked={identityMode==='aadhaar'} onChange={()=>setIdentityMode('aadhaar')} className="mr-2"/>Aadhaar</label>
                <label className="inline-flex items-center"><input type="radio" name="mode" checked={identityMode==='worker'} onChange={()=>setIdentityMode('worker')} className="mr-2"/>Worker</label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input 
                placeholder="your.email@example.com" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)} 
                required 
              />
            </div>
            {identityMode === 'otp' && (
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <div className="flex gap-2">
                  <Input placeholder="+91xxxxxxxxxx" type="tel" value={phone} onChange={(e)=>setPhone((e.target as HTMLInputElement).value)} />
                  <button type="button" onClick={sendOtp} className="px-3 py-2 bg-sky-600 text-white rounded">Send OTP</button>
                </div>
                {otpSent && (
                  <div className="mt-2">
                    <label className="text-sm font-medium mb-1 block">Enter OTP</label>
                    <Input placeholder="123456" type="text" value={otp} onChange={(e)=>setOtp((e.target as HTMLInputElement).value)} />
                  </div>
                )}
              </div>
            )}
            {identityMode === 'aadhaar' && (
              <div>
                <label className="text-sm font-medium mb-1 block">Aadhaar (16 digits)</label>
                <Input placeholder="Enter 16-digit Aadhaar" type="text" value={aadhaar} onChange={(e)=>setAadhaar((e.target as HTMLInputElement).value.replace(/\D/g, ''))} />
                <div className="text-xs text-muted-foreground mt-2">We will mask your Aadhaar locally and request consent before using it.</div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input 
                placeholder="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)} 
                required={identityMode !== 'anonymous'}
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button id="login-submit" type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showAadhaarConsent} onOpenChange={(open) => setShowAadhaarConsent(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aadhaar Consent</DialogTitle>
            <DialogDescription>We need your consent to use your Aadhaar for verification. Only masked Aadhaar will be stored locally.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAadhaarConsent(false)}>Cancel</Button>
            <Button onClick={confirmAadhaar}>I Consent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
