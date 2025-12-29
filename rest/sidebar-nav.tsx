"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "../../src/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  ScanLine,
  ShieldAlert,
  Smartphone,
  BarChart3,
  FileText,
  Settings,
  UserPlus,
  ClipboardList,
  Activity,
  ScrollText,
} from "../../src/lib/lucide-stub.jsx"

const navItems = [
  {
    title: "COMMAND CENTER",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/system-health", label: "System Health", icon: Activity },
    ],
  },
  {
    title: "WORKER MANAGEMENT",
    items: [
      { href: "/admin/workers", label: "Worker Registry", icon: Users },
      { href: "/admin/enrollment", label: "Enrollment", icon: UserPlus },
      { href: "/admin/background-checks", label: "Background Checks", icon: ClipboardList },
    ],
  },
  {
    title: "ORGANIZATION",
    items: [
      { href: "/employer", label: "Employer Portal", icon: Building2 },
      { href: "/employer/contracts", label: "Contracts", icon: FileText },
    ],
  },
  {
    title: "VERIFICATION",
    items: [
      { href: "/verify", label: "Verification Terminal", icon: ScanLine },
      { href: "/law-enforcement", label: "Law Enforcement", icon: ShieldAlert },
    ],
  },
  {
    title: "MOBILE",
    items: [{ href: "/worker", label: "Worker Portal", icon: Smartphone }],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
]

export function SidebarNav() {
  const pathname = useLocation().pathname

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 border-r border-border bg-sidebar">
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {navItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-3 mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">v2.4.1 | PROD</span>
        </div>
      </div>
    </aside>
  )
}
