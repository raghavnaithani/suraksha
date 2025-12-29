"use client"

import { useState } from "react"
import {
  ScanLine,
  QrCode,
  Keyboard,
  Camera,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Building2,
  MapPin,
  Fingerprint,
  RefreshCw,
  FileText,
} from "@lib/lucide-stub"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { TrustScore } from "@components/ui/trust-score"
import { StatusBadge } from "@components/ui/status-badge"
import { Link } from "react-router-dom"
import { apiPost } from "@lib/use-api"
import { useAuth } from '@lib/auth-context'

type VerificationState = "idle" | "scanning" | "processing" | "result"
type VerificationResult = "GREEN" | "YELLOW" | "RED" | null

interface VerificationResponse {
  requestId: string
  workerId: string
  result: VerificationResult
  workerName: string
  workerPhoto: string
  trustScore: number
  trustLevel: "GREEN" | "YELLOW" | "RED"
  employmentStatus: {
    isEmployed: boolean
    employers: { name: string; role: string; since: string }[]
  }
  backgroundCheck: {
    status: string
    policeVerification: string
    lastChecked: string
  }
  activeTask?: {
    taskId: string
    employer: string
    type: string
    destination: string
    timeWindow: string
  }
  deviceStatus: {
    verified: boolean
    lastSeen: string
    location?: string
  }
  riskFlags: string[]
  recommendations: string[]
  responseTimeMs: number
  timestamp: Date
}

export default function VerificationTerminal() {
  const [state, setState] = useState<VerificationState>("idle")
  const [result, setResult] = useState<VerificationResult>(null)
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()

  const performVerification = async (workerId: string) => {
    setState("scanning")
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 800))
    setState("processing")

    try {
      // Prevent anonymous users from performing verification
      if (auth?.user?.identityMode === 'anonymous') {
        setError('Anonymous users have limited access. Please login to verify identities.')
        setState('idle')
        return
      }

      // Provide a demoResult hint for local dev (mapping demo IDs to results)
      let demoResult: any = undefined
      if (workerId.startsWith('PHONE:')) {
        const num = workerId.split(':')[1] || ''
        const last4 = num.slice(-4)
        demoResult = last4 === '9999' ? 'GREEN' : last4 === '8888' ? 'YELLOW' : last4 === '7777' ? 'RED' : undefined
      } else if (workerId.startsWith('AADHAAR:')) {
        const a = workerId.split(':')[1] || ''
        const last4 = a.slice(-4)
        demoResult = last4 === '4444' ? 'GREEN' : last4 === '5555' ? 'YELLOW' : last4 === '6666' ? 'RED' : undefined
      } else {
        demoResult = workerId.includes("001234")
          ? "GREEN"
          : workerId.includes("005678")
          ? "YELLOW"
          : workerId.includes("007890")
          ? "RED"
          : undefined
      }

      const payload: any = {
        workerId: workerId || "NWIR-2024-001234",
        verifierId: "terminal_001",
        verifierRole: "employer",
        location: { lat: 28.6139, lng: 77.209 },
      }
      if (demoResult) payload.demoResult = demoResult

      console.log('[Verification] performing verification', payload)
      const response = await apiPost("/api/verify", payload)

      console.log('[Verification] response', response)
      setVerificationData(response)
      setResult(response.result as VerificationResult)
      setState("result")
    } catch (err) {
      setError("Verification failed. Please try again.")
      setState("idle")
    }
  }

  const handleManualVerify = () => {
    if (manualInput.trim()) {
      performVerification(manualInput.trim())
    }
  }

  const resetVerification = () => {
    setState("idle")
    setResult(null)
    setVerificationData(null)
    setManualInput("")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background secure-grid">
      <div className="scan-effect pointer-events-none fixed inset-0 z-[-1]" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ScanLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Verification Terminal</h1>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  NWIR CHECKPOINT ACCESS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/verify/history">
                <Button variant="outline" size="sm" className="font-mono text-xs bg-transparent">
                  <FileText className="h-4 w-4 mr-1" />
                  HISTORY
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm" className="font-mono text-xs bg-transparent">
                  EXIT TERMINAL
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {state === "idle" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Worker Identity Verification</h2>
              <p className="text-muted-foreground">Verify delivery personnel or banking agent identity in real-time</p>
            </div>

            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="qr" className="font-mono text-xs gap-2">
                  <QrCode className="h-4 w-4" />
                  QR CODE
                </TabsTrigger>
                <TabsTrigger value="manual" className="font-mono text-xs gap-2">
                  <Keyboard className="h-4 w-4" />
                  MANUAL ID
                </TabsTrigger>
                <TabsTrigger value="phone" className="font-mono text-xs gap-2">
                  <MapPin className="h-4 w-4" />
                  PHONE
                </TabsTrigger>
                <TabsTrigger value="aadhaar" className="font-mono text-xs gap-2">
                  <Fingerprint className="h-4 w-4" />
                  AADHAAR
                </TabsTrigger>
                <TabsTrigger value="face" className="font-mono text-xs gap-2">
                  <Camera className="h-4 w-4" />
                  FACE SCAN
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr">
                <Card className="glow-border">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5 text-primary" />
                      QR Code Verification
                    </CardTitle>
                    <CardDescription>Ask the worker to display their NWIR QR code from the mobile app</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-64 h-64 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-muted/30 mb-6">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Position QR code here</p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="font-mono gap-2 w-full max-w-xs"
                      onClick={() => performVerification("NWIR-2024-001234")}
                    >
                      <ScanLine className="h-5 w-5" />
                      START SCANNING
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="phone">
                <Card className="glow-border">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Phone Verification
                    </CardTitle>
                    <CardDescription>Verify worker by registered phone number</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-full max-w-md space-y-4">
                      <Input placeholder="Phone (e.g., 9999999999)" className="text-center" onChange={(e)=>{}} />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => performVerification('PHONE:9999999999')}>Demo: GREEN</Button>
                        <Button variant="outline" size="sm" onClick={() => performVerification('PHONE:8888888888')}>Demo: YELLOW</Button>
                        <Button variant="outline" size="sm" onClick={() => performVerification('PHONE:7777777777')}>Demo: RED</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="aadhaar">
                <Card className="glow-border">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      Aadhaar Matching
                    </CardTitle>
                    <CardDescription>Verify worker by Aadhaar (16 digits)</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-full max-w-md space-y-4">
                      <Input placeholder="Enter 16-digit Aadhaar" className="text-center" onChange={(e)=>{}} />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => performVerification('AADHAAR:1111222233334444')}>Demo: GREEN</Button>
                        <Button variant="outline" size="sm" onClick={() => performVerification('AADHAAR:2222333344445555')}>Demo: YELLOW</Button>
                        <Button variant="outline" size="sm" onClick={() => performVerification('AADHAAR:3333444455556666')}>Demo: RED</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual">
                <Card className="glow-border">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Keyboard className="h-5 w-5 text-primary" />
                      Manual ID Entry
                    </CardTitle>
                    <CardDescription>Enter the worker&apos;s NWIR ID manually</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-full max-w-md space-y-4">
                      <Input
                        placeholder="Enter Worker ID (e.g., NWIR-2024-001234)"
                        className="bg-muted border-border font-mono text-center text-lg h-14"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                      />
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs bg-transparent"
                          onClick={() => setManualInput("NWIR-2024-001234")}
                        >
                          Demo: GREEN
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs bg-transparent"
                          onClick={() => setManualInput("NWIR-2024-005678")}
                        >
                          Demo: YELLOW
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs bg-transparent"
                          onClick={() => setManualInput("NWIR-2024-007890")}
                        >
                          Demo: RED
                        </Button>
                      </div>
                      <Button
                        size="lg"
                        className="font-mono gap-2 w-full"
                        onClick={handleManualVerify}
                        disabled={!manualInput.trim()}
                      >
                        <Shield className="h-5 w-5" />
                        VERIFY IDENTITY
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="face">
                <Card className="glow-border">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Facial Recognition
                    </CardTitle>
                    <CardDescription>Verify identity using facial biometrics</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-64 h-64 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center bg-muted/30 mb-6">
                      <div className="text-center">
                        <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Position face here</p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="font-mono gap-2 w-full max-w-xs"
                      onClick={() => performVerification("NWIR-2024-009012")}
                    >
                      <Fingerprint className="h-5 w-5" />
                      CAPTURE & VERIFY
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {state === "scanning" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="relative inline-block mb-8">
              <div className="h-32 w-32 rounded-full border-4 border-primary/30 flex items-center justify-center">
                <ScanLine className="h-16 w-16 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
            </div>
            <h2 className="text-xl font-bold mb-2">Scanning...</h2>
            <p className="text-muted-foreground font-mono">Capturing identity data</p>
          </div>
        )}

        {state === "processing" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="relative inline-block mb-8">
              <div className="h-32 w-32 rounded-full border-4 border-primary flex items-center justify-center">
                <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Processing...</h2>
            <p className="text-muted-foreground font-mono text-sm">
              Verifying identity, employment status, and task authorization
            </p>
            <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Querying NWIR database</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Calculating trust score</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                <span>Checking authorization...</span>
              </div>
            </div>
          </div>
        )}

        {state === "result" && verificationData && (
          <div className="max-w-3xl mx-auto">
            {/* Result Header */}
            <div
              className={`p-8 rounded-t-lg border-2 ${
                result === "GREEN"
                  ? "bg-success/10 border-success/30"
                  : result === "YELLOW"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-destructive/10 border-destructive/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-20 w-20 rounded-full flex items-center justify-center ${
                      result === "GREEN" ? "bg-success/20" : result === "YELLOW" ? "bg-warning/20" : "bg-destructive/20"
                    }`}
                  >
                    {result === "GREEN" && <CheckCircle className="h-10 w-10 text-success" />}
                    {result === "YELLOW" && <AlertTriangle className="h-10 w-10 text-warning" />}
                    {result === "RED" && <XCircle className="h-10 w-10 text-destructive" />}
                  </div>
                  <div>
                    <p
                      className={`text-3xl font-bold ${
                        result === "GREEN" ? "text-success" : result === "YELLOW" ? "text-warning" : "text-destructive"
                      }`}
                    >
                      {result === "GREEN" && "VERIFIED"}
                      {result === "YELLOW" && "CAUTION"}
                      {result === "RED" && "ALERT"}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      Response time: {verificationData.responseTimeMs}ms
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground">VERIFICATION ID</p>
                  <p className="font-mono text-sm">{verificationData.requestId}</p>
                </div>
              </div>
            </div>

            {/* Worker Details */}
            <Card className="rounded-t-none border-t-0 glow-border">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Identity */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">IDENTITY</h3>
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden">
                          {verificationData.workerPhoto ? (
                            <img
                              src={verificationData.workerPhoto || "/placeholder.svg"}
                              alt={verificationData.workerName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xl font-semibold">{verificationData.workerName}</p>
                          <p className="font-mono text-sm text-primary">{verificationData.workerId}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">EMPLOYMENT</h3>
                      <div className="space-y-2">
                        {verificationData.employmentStatus.isEmployed ? (
                          verificationData.employmentStatus.employers.map((emp, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">{emp.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({emp.role} since {emp.since})
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-destructive">No active employment</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">VERIFICATION STATUS</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">Background Check</span>
                          <StatusBadge status={verificationData.backgroundCheck.status} size="sm" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">Police Verification</span>
                          <StatusBadge status={verificationData.backgroundCheck.policeVerification} size="sm" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">Device Attestation</span>
                          {verificationData.deviceStatus.verified ? (
                            <span className="text-xs text-success font-mono">VERIFIED</span>
                          ) : (
                            <span className="text-xs text-destructive font-mono">FAILED</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Trust & Task */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">TRUST SCORE</h3>
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <TrustScore score={verificationData.trustScore} size="lg" />
                      </div>
                    </div>

                    {verificationData.activeTask && result === "GREEN" && (
                      <div>
                        <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">
                          CURRENT TASK AUTHORIZATION
                        </h3>
                        <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Task ID</span>
                              <span className="font-mono text-sm">{verificationData.activeTask.taskId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Employer</span>
                              <span className="font-mono text-sm">{verificationData.activeTask.employer}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm">{verificationData.activeTask.destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{verificationData.activeTask.timeWindow}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {verificationData.riskFlags.length > 0 && (
                      <div>
                        <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">RISK FLAGS</h3>
                        <div className="space-y-2">
                          {verificationData.riskFlags.map((flag, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 rounded bg-destructive/10 border border-destructive/30"
                            >
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <span className="text-sm text-destructive">{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {verificationData.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-xs font-mono text-muted-foreground uppercase mb-3">RECOMMENDATIONS</h3>
                        <div className="space-y-2">
                          {verificationData.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button variant="outline" onClick={resetVerification} className="font-mono gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    NEW VERIFICATION
                  </Button>
                  <div className="flex items-center gap-2">
                    {result === "RED" && (
                      <Button variant="destructive" className="font-mono gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        REPORT INCIDENT
                      </Button>
                    )}
                    <Button variant="outline" className="font-mono gap-2 bg-transparent">
                      <FileText className="h-4 w-4" />
                      DOWNLOAD REPORT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
