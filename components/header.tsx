"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, CalendarDays, LogOut, Settings } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const navLinks = [
    { href: "/vehicles", label: "Browse Vehicles" },
    { href: "/vehicles?category=electric", label: "Electric" },
    { href: "/vehicles?category=luxury", label: "Luxury" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="DriveNow" width={36} height={36} className="rounded-lg" />
          <span className="text-xl font-semibold tracking-tight">DriveNow</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/account">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Reservations
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account?tab=profile" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 pt-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Image src="/images/logo.png" alt="DriveNow" width={36} height={36} className="rounded-lg" />
                <span className="text-xl font-semibold">DriveNow</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 pt-4 border-t">
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CalendarDays className="h-4 w-4" />
                        My Bookings
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        handleSignOut()
                        setOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                      <Button className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
