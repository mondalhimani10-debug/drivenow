"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { locations } from "@/lib/vehicles"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import type { VehicleData } from "@/components/vehicle-card"
import {
  ArrowLeft,
  Users,
  Gauge,
  Fuel,
  Zap,
  CalendarIcon,
  MapPin,
  Clock,
  CheckCircle2,
  Shield,
  Loader2
} from "lucide-react"

const pickupTimes = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const { data: vehicle, isLoading } = useSWR<VehicleData>(
    params.id ? `/api/vehicles/${params.id}` : null,
    fetcher
  )

  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [pickupTime, setPickupTime] = useState("")
  const [returnTime, setReturnTime] = useState("")
  const [sameReturnLocation, setSameReturnLocation] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const rentalDays = useMemo(() => {
    if (pickupDate && returnDate) {
      const days = differenceInDays(returnDate, pickupDate)
      return days > 0 ? days : 1
    }
    return 0
  }, [pickupDate, returnDate])

  const totalPrice = useMemo(() => {
    if (vehicle && rentalDays > 0) {
      return Number(vehicle.price_per_day) * rentalDays
    }
    return 0
  }, [vehicle, rentalDays])

  const handleBooking = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!vehicle) return

    setIsBooking(true)
    setBookingError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          pickup_location: pickupLocation,
          return_location: sameReturnLocation ? pickupLocation : returnLocation,
          pickup_date: pickupDate ? format(pickupDate, "yyyy-MM-dd") : "",
          return_date: returnDate ? format(returnDate, "yyyy-MM-dd") : "",
          pickup_time: pickupTime,
          return_time: returnTime,
          total_price: totalPrice + 2000
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create booking")
      }

      router.push("/account?booking=success")
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsBooking(false)
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

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold">Vehicle not found</h1>
          <p className="mt-2 text-muted-foreground">The vehicle you are looking for does not exist.</p>
          <Link href="/vehicles">
            <Button className="mt-4">Browse Vehicles</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/vehicles"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vehicles
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Vehicle Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={vehicle.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {vehicle.category?.charAt(0).toUpperCase()}{vehicle.category?.slice(1)}
                  </Badge>
                  {vehicle.fuel_type === "electric" && (
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                      <Zap className="mr-1 h-3 w-3" />
                      Electric
                    </Badge>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground">{vehicle.brand}</p>
                    <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                    <span className="text-lg font-semibold">{vehicle.year}</span>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed">{vehicle.description}</p>

                {/* Quick Specs */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{vehicle.fuel_type}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {vehicle.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-baseline justify-between">
                      <CardTitle>Book This Vehicle</CardTitle>
                      <div className="text-right">
                        <span className="text-2xl font-bold">₹{vehicle.price_per_day}</span>
                        <span className="text-muted-foreground">/hr</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {bookingError && (
                      <Alert variant="destructive">
                        <AlertDescription>{bookingError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Pickup Location */}
                      <div className="space-y-2">
                      <Label>Pick-up Location</Label>
                      <Select value={pickupLocation} onValueChange={setPickupLocation}>
                        <SelectTrigger className="truncate">
                          <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Same Return Location Toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="same-location"
                        checked={sameReturnLocation}
                        onChange={(e) => setSameReturnLocation(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <Label htmlFor="same-location" className="text-sm cursor-pointer">
                        Return to same location
                      </Label>
                    </div>

                    {!sameReturnLocation && (
                      <div className="space-y-2">
                        <Label>Return Location</Label>
                        <Select value={returnLocation} onValueChange={setReturnLocation}>
                          <SelectTrigger className="truncate">
                            <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pick-up Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !pickupDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pickupDate ? format(pickupDate, "MMM dd") : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={pickupDate}
                              onSelect={setPickupDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Return Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !returnDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {returnDate ? format(returnDate, "MMM dd") : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={returnDate}
                              onSelect={setReturnDate}
                              disabled={(date) => date < (pickupDate || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pick-up Time</Label>
                        <Select value={pickupTime} onValueChange={setPickupTime}>
                          <SelectTrigger>
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {pickupTimes.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Return Time</Label>
                        <Select value={returnTime} onValueChange={setReturnTime}>
                          <SelectTrigger>
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {pickupTimes.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Price Summary */}
                    {rentalDays > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            ₹{vehicle.price_per_day} x {rentalDays} day{rentalDays !== 1 && "s"}
                          </span>
                          <span>₹{totalPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Service fee</span>
                           <span>₹2,000</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Insurance</span>
                          <span className="text-emerald-600">Included</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-xl">₹{totalPrice + 2000}</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleBooking}
                      disabled={!pickupLocation || !pickupDate || !returnDate || !pickupTime || !returnTime || isBooking}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : !user ? (
                        "Sign in to book"
                      ) : rentalDays > 0 ? (
                        `Book for ₹${totalPrice + 2000}`
                      ) : (
                        "Select dates to book"
                      )}
                    </Button>

                    <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                      <Shield className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-muted-foreground">
                        Free cancellation up to 24 hours before pick-up. Full refund guaranteed.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
