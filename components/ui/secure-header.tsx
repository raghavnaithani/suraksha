"use client"

import { Shield, Bell, User, Lock } from "@lib/lucide-stub"
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
import { useAuth } from "@lib/auth-context"

interface SecureHeaderProps {
  userRole?: string
  userName?: string
}

export function SecureHeader({ userRole = "Admin", userName }: SecureHeaderProps) {
  const auth = useAuth();
  const displayName = userName || auth.user?.name || "User";
  
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NWIR
              </h1>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                National Worker Identity Registry
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center mr-2">
            <ThemeToggle />
          </div>
          
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">SYSTEM SECURE</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Lock className="h-3 w-3 text-slate-600 dark:text-slate-400" />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">TLS 1.3 ENCRYPTED</span>
          </div>

          <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/50">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 pl-2 pr-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">{userRole}</p>
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
              <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => auth.logout()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
