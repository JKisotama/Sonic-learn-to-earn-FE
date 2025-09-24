"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GraduationCap, BookOpen, User, Home, Menu, LogIn, UserPlus } from "lucide-react"
import { WalletConnection } from "./wallet-connection"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ]

  const authItems = [
    { href: "/login", label: "Sign In", icon: LogIn },
    { href: "/register", label: "Register", icon: UserPlus },
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
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions - Prioritize wallet connection over auth */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <WalletConnection />
            <div className="flex items-center gap-2 opacity-60">
              <span className="text-xs text-muted-foreground hidden lg:inline">Optional:</span>
              {authItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">{item.label}</span>
                      <span className="lg:hidden">{item.label === "Sign In" ? "Login" : "Join"}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
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
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`nav-item flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile Wallet Connection - Emphasize wallet connection */}
                <div className="border-t border-border pt-6">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-foreground mb-1">Connect to Start Learning</p>
                    <p className="text-xs text-muted-foreground mb-3">Connect your wallet to claim SET tokens</p>
                  </div>
                  <WalletConnection />
                </div>

                {/* Mobile Auth Actions - Make auth optional */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-3">Optional Account Features:</p>
                  <div className="flex flex-col gap-2">
                    {authItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
