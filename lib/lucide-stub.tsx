import React from 'react'

export type LucideIcon = React.FC<React.SVGProps<SVGSVGElement>>

function make(name: string): LucideIcon {
  return ({ className = 'h-4 w-4', ...props }) => (
    <svg
      aria-hidden
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>{name}</title>
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

const icons = [
  'ScanLine','QrCode','Keyboard','Camera','Shield','CheckCircle','AlertTriangle','XCircle','Clock','User','Building2','MapPin','Fingerprint','RefreshCw','FileText','Search','Filter','Download','LayoutDashboard','Users','ShieldAlert','Smartphone','BarChart3','Settings','UserPlus','ClipboardList','Activity','ScrollText','Bell','Lock','Moon','Sun',
  'CheckIcon','ChevronDownIcon','ChevronUpIcon','ChevronRightIcon','CircleIcon',
  'ChevronLeftIcon','MoreHorizontalIcon','ArrowLeft','ArrowRight','PanelLeftIcon','Loader2Icon','GripVerticalIcon','XIcon','MoreHorizontal'
]

const exportsObj: Record<string, LucideIcon> = {}
for (const name of icons) exportsObj[name] = make(name)

export default exportsObj
export const {
  ScanLine, QrCode, Keyboard, Camera, Shield, CheckCircle, AlertTriangle, XCircle, Clock, User,
  Building2, MapPin, Fingerprint, RefreshCw, FileText, Search, Filter, Download, LayoutDashboard,
  Users, ShieldAlert, Smartphone, BarChart3, Settings, UserPlus, ClipboardList, Activity,
  ScrollText, Bell, Lock, Moon, Sun,
  CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon, CircleIcon,
} = exportsObj

export const { ChevronLeftIcon, MoreHorizontalIcon, ArrowLeft, ArrowRight, PanelLeftIcon, Loader2Icon, GripVerticalIcon, XIcon, MoreHorizontal } = exportsObj
