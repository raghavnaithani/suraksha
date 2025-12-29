import React from "react";
import { SecureHeader } from "./ui/secure-header";
import { SidebarNav } from "./ui/sidebar-nav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <main className="flex-1 pt-16 lg:pl-64">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
