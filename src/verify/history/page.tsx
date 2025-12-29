"use client"

import { useState } from "react"
import { Search, Filter, Download, ScanLine, CheckCircle, AlertTriangle, XCircle } from "@lib/lucide-stub"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { StatusBadge } from "@components/ui/status-badge";
import { Link } from "react-router-dom"

const verificationHistory = [
  {
    id: "VER-001234",
    workerId: "NWIR-2024-001234",
    workerName: "Rajesh Kumar",
    result: "GREEN" as const,
    verifierType: "Society Gate",
    location: "Saket, Delhi",
    timestamp: new Date("2024-12-11T10:30:00"),
    responseTime: 187,
  },
  {
    id: "VER-001235",
    workerId: "NWIR-2024-005678",
    workerName: "Amit Sharma",
    result: "YELLOW" as const,
    verifierType: "Corporate Campus",
    location: "Cyber City, Gurgaon",
    timestamp: new Date("2024-12-11T09:45:00"),
    responseTime: 234,
  },
  {
    id: "VER-001236",
    workerId: "NWIR-2024-015678",
    workerName: "Unknown",
    result: "RED" as const,
    verifierType: "ATM Location",
    location: "Andheri, Mumbai",
    timestamp: new Date("2024-12-11T08:20:00"),
    responseTime: 312,
  },
  {
    id: "VER-001237",
    workerId: "NWIR-2024-009012",
    workerName: "Priya Singh",
    result: "GREEN" as const,
    verifierType: "Society Gate",
    location: "Koramangala, Bangalore",
    timestamp: new Date("2024-12-11T07:55:00"),
    responseTime: 156,
  },
  {
    id: "VER-001238",
    workerId: "NWIR-2024-012345",
    workerName: "Mohammed Ali",
    result: "GREEN" as const,
    verifierType: "Police Checkpoint",
    location: "Banjara Hills, Hyderabad",
    timestamp: new Date("2024-12-10T22:30:00"),
    responseTime: 198,
  },
]

export default function VerificationHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resultFilter, setResultFilter] = useState<string>("all")

  const stats = {
    total: verificationHistory.length,
    green: verificationHistory.filter((v) => v.result === "GREEN").length,
    yellow: verificationHistory.filter((v) => v.result === "YELLOW").length,
    red: verificationHistory.filter((v) => v.result === "RED").length,
    avgResponse: Math.round(verificationHistory.reduce((a, b) => a + b.responseTime, 0) / verificationHistory.length),
  }

  const filteredHistory = verificationHistory.filter((ver) => {
    const matchesSearch =
      ver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ver.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ver.workerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesResult = resultFilter === "all" || ver.result === resultFilter

    return matchesSearch && matchesResult
  })

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
                <h1 className="text-lg font-bold">Verification History</h1>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  AUDIT LOG | TERMINAL VT-DEL-001
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/verify">
                <Button className="font-mono text-xs gap-2">
                  <ScanLine className="h-4 w-4" />
                  NEW VERIFICATION
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="glow-border">
            <CardContent className="pt-6">
              <p className="text-xs font-mono text-muted-foreground">TOTAL</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="glow-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">GREEN</p>
                <p className="text-2xl font-bold text-success">{stats.green}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-success" />
            </CardContent>
          </Card>
          <Card className="glow-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">YELLOW</p>
                <p className="text-2xl font-bold text-warning">{stats.yellow}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-warning" />
            </CardContent>
          </Card>
          <Card className="glow-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">RED</p>
                <p className="text-2xl font-bold text-destructive">{stats.red}</p>
              </div>
              <XCircle className="h-6 w-6 text-destructive" />
            </CardContent>
          </Card>
          <Card className="glow-border">
            <CardContent className="pt-6">
              <p className="text-xs font-mono text-muted-foreground">AVG RESPONSE</p>
              <p className="text-2xl font-bold">{stats.avgResponse}ms</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glow-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or Worker..."
                  className="pl-10 bg-muted border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-muted border-border">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="GREEN">Green Only</SelectItem>
                  <SelectItem value="YELLOW">Yellow Only</SelectItem>
                  <SelectItem value="RED">Red Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="font-mono gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                EXPORT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="text-base">Verification Records</CardTitle>
            <CardDescription className="font-mono text-xs">Showing {filteredHistory.length} records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-mono">VERIFICATION ID</TableHead>
                  <TableHead className="text-xs font-mono">WORKER</TableHead>
                  <TableHead className="text-xs font-mono">RESULT</TableHead>
                  <TableHead className="text-xs font-mono">VERIFIER TYPE</TableHead>
                  <TableHead className="text-xs font-mono">LOCATION</TableHead>
                  <TableHead className="text-xs font-mono">RESPONSE</TableHead>
                  <TableHead className="text-xs font-mono">TIME</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((ver) => (
                  <TableRow key={ver.id}>
                    <TableCell className="font-mono text-xs text-primary">{ver.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{ver.workerName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{ver.workerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ver.result} size="sm" />
                    </TableCell>
                    <TableCell className="text-sm">{ver.verifierType}</TableCell>
                    <TableCell className="text-sm">{ver.location}</TableCell>
                    <TableCell className="font-mono text-xs">{ver.responseTime}ms</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{ver.timestamp.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
