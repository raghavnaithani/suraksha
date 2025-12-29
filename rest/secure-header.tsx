"use client"

import { Shield, Bell, User, Lock } from "../../src/lib/lucide-stub.jsx"
import ThemeToggle from "./theme-toggle"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Link } from "react-router-dom"

interface SecureHeaderProps {
  userRole?: string
  userName?: string
}

export function SecureHeader({ userRole = "Admin", userName = "System Administrator" }: SecureHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold tracking-tight text-foreground">NWIR</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                National Worker Identity Registry
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center mr-2">
            <ThemeToggle />
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-success/10 border border-success/20">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-success">SYSTEM SECURE</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
            <Lock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">TLS 1.3 ENCRYPTED</span>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{userRole}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Security Settings</DropdownMenuItem>
              <DropdownMenuItem>Audit History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
