import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const APP_NAME = "Karma";
const APP_DEFAULT_TITLE = "Be YOGI";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Its THE Karma";


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Karma",
    template: APP_TITLE_TEMPLATE,
  },
  description: "Be Yogi, I Will Handle Your Karma",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  }
}
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
       <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}