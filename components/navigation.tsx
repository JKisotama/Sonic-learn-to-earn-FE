"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GraduationCap, BookOpen, User, Home, Menu, Shield } from "lucide-react"
import { WalletConnection } from "./wallet-connection"
import { useAdminFunctions } from "@/hooks/use-admin-functions"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isOwner } = useAdminFunctions()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/admin", label: "Admin", icon: Shield, requiresOwner: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-foreground hidden xs:block">Sonic University</span>
            <span className="text-lg font-semibold text-foreground xs:hidden">Sonic</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isAdminItem = item.requiresOwner
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isAdminItem
                        ? isOwner
                          ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          : "text-orange-400 hover:text-orange-500 hover:bg-orange-50/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={isAdminItem && !isOwner ? "Requires contract owner privileges" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isAdminItem && !isOwner && <span className="text-xs opacity-60">🔒</span>}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions - Only wallet connection */}
          <div className="hidden md:flex items-center">
            <WalletConnection />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-transparent">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const isAdminItem = item.requiresOwner
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`nav-item flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : isAdminItem
                              ? isOwner
                                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                : "text-orange-400 hover:text-orange-500 hover:bg-orange-50/50"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                        {isAdminItem && (
                          <span
                            className={`ml-auto text-xs px-2 py-1 rounded-full ${
                              isOwner ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {isOwner ? "Owner" : "🔒 Owner Only"}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile Wallet Connection */}
                <div className="border-t border-border pt-6">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-foreground mb-1">Connect to Start Learning</p>
                    <p className="text-xs text-muted-foreground mb-3">Connect your wallet to claim SET tokens</p>
                  </div>
                  <WalletConnection />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
