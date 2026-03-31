"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { vehicles } from "@/lib/vehicles"
import { createClient } from "@/lib/supabase/client"
import {
  User,
  CalendarDays,
  Settings,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  ChevronRight,
  Bell,
  LogOut,
  Edit2,
  Eye,
  EyeOff
} from "lucide-react"

// Mock reservations data
const mockReservations = [
  {
    id: "RES-001",
    vehicleId: "1",
    status: "upcoming" as const,
    pickupLocation: "Mumbai, Maharashtra",
    returnLocation: "Mumbai, Maharashtra",
    pickupDate: "2026-04-15",
    returnDate: "2026-04-18",
    pickupTime: "10:00",
    returnTime: "18:00",
    totalPrice: 49096
  },
  {
    id: "RES-002",
    vehicleId: "4",
    status: "completed" as const,
    pickupLocation: "Bangalore, Karnataka",
    returnLocation: "Bangalore, Karnataka",
    pickupDate: "2026-03-01",
    returnDate: "2026-03-03",
    pickupTime: "09:00",
    returnTime: "17:00",
    totalPrice: 55950
  },
  {
    id: "RES-003",
    vehicleId: "7",
    status: "cancelled" as const,
    pickupLocation: "Delhi, NCR",
    returnLocation: "Delhi, NCR",
    pickupDate: "2026-02-20",
    returnDate: "2026-02-22",
    pickupTime: "12:00",
    returnTime: "12:00",
    totalPrice: 67570
  }
]

export default function AccountPage() {
  const searchParams = useSearchParams()
  const bookingSuccess = searchParams.get("booking") === "success"
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState("reservations")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  
  // Profile edit state
  const [editMode, setEditMode] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [memberSince, setMemberSince] = useState("")
  
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setUserEmail(user.email || "")
        setUserName(user.user_metadata?.first_name && user.user_metadata?.last_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
          : user.email?.split("@")[0] || "User")
        setMemberSince(user.created_at 
          ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
          : "N/A")
      }
      setIsLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Upcoming</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)
    setLoginError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setLoginError(error.message)
      setIsSigningIn(false)
      return
    }

    window.location.reload()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleSaveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: userName,
        phone: userPhone 
      }
    })
    if (!error) {
      setEditMode(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to manage your reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : "Sign In"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{"Don't have an account? "}</span>
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {bookingSuccess && (
            <Alert className="mb-6 border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                Your reservation has been confirmed! Check your email for details.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
              <p className="mt-1 text-muted-foreground">Manage your reservations and account settings</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
                      <AvatarFallback>{userName.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-lg font-semibold">{userName}</h2>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Member since {memberSince}</p>
                  </div>
                  
                  <Separator className="my-6" />

                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("reservations")}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === "reservations" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      My Reservations
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("payment")}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === "payment" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Payment Methods
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === "notifications" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </button>
                  </nav>

                  <Separator className="my-6" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Reservations Tab */}
              {activeTab === "reservations" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Reservations</CardTitle>
                      <CardDescription>View and manage your vehicle bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mockReservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">No reservations yet</h3>
                          <p className="mt-1 text-muted-foreground">
                            Start exploring our vehicles to make your first booking
                          </p>
                          <Link href="/vehicles">
                            <Button className="mt-4">Browse Vehicles</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mockReservations.map((reservation) => {
                            const vehicle = vehicles.find((v) => v.id === reservation.vehicleId)
                            if (!vehicle) return null
                            
                            return (
                              <div
                                key={reservation.id}
                                className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                              >
                                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-video sm:w-40">
                                  <Image
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                      <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                                      <h3 className="font-semibold">{vehicle.name}</h3>
                                    </div>
                                    {getStatusBadge(reservation.status)}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="h-4 w-4" />
                                      <span>{reservation.pickupLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <CalendarDays className="h-4 w-4" />
                                      <span>{reservation.pickupDate} - {reservation.returnDate}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between pt-2">
                                    <span className="font-semibold">₹{reservation.totalPrice}</span>
                                    <Link href={`/vehicles/${vehicle.id}`}>
                                      <Button variant="outline" size="sm" className="gap-1">
                                        View Details
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    <Button
                      variant={editMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                    >
                      {editMode ? "Save Changes" : (
                        <>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-email">Email</Label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={userEmail}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-since">Member Since</Label>
                        <Input
                          id="member-since"
                          value={memberSince}
                          disabled
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Payment Tab */}
              {activeTab === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">**** **** **** 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/28</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Default</Badge>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: "email", label: "Email notifications", description: "Receive booking confirmations and updates via email" },
                        { id: "sms", label: "SMS notifications", description: "Get text alerts for important updates" },
                        { id: "marketing", label: "Marketing emails", description: "Receive special offers and promotions" },
                        { id: "reminders", label: "Booking reminders", description: "Get reminded before your pickup date" }
                      ].map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div>
                            <p className="font-medium">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={setting.id !== "marketing"} />
                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
