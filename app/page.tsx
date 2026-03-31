import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/vehicles"
import { createClient } from "@/lib/supabase/server"
import { 
  Car, 
  Truck, 
  Gauge, 
  Crown, 
  Zap, 
  Bus,
  Shield, 
  Clock, 
  Headphones,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

const categoryIcons = {
  car: Car,
  truck: Truck,
  gauge: Gauge,
  crown: Crown,
  zap: Zap,
  bus: Bus
}

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("available", true)
    .limit(4)
  
  const featuredVehicles = vehicles || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-muted/30">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                    Find your perfect ride for any journey
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                    From daily commutes to weekend adventures. Compare and book premium vehicles with flexible options and competitive rates.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <SearchForm />
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-square">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"
                    alt="Premium vehicle"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 lg:hidden">
              <SearchForm />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
              <p className="mt-2 text-muted-foreground">Find the perfect vehicle type for your needs</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => {
                const Icon = categoryIcons[category.icon as keyof typeof categoryIcons]
                return (
                  <Link key={category.id} href={`/vehicles?category=${category.id}`}>
                    <Card className="group cursor-pointer border-border transition-all hover:border-foreground hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Vehicles</h2>
                <p className="mt-2 text-muted-foreground">Our most popular picks ready for your next adventure</p>
              </div>
              <Link href="/vehicles">
                <Button variant="outline" className="gap-2">
                  View All Vehicles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose DriveNow</h2>
              <p className="mt-2 text-muted-foreground">Experience hassle-free rentals with premium service</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-border">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Fully Insured</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All our vehicles come with comprehensive insurance coverage for your peace of mind.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Flexible Booking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Book for hours, days, or weeks. Free cancellation up to 24 hours before pickup.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Headphones className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">24/7 Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our dedicated team is always available to assist you throughout your rental journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to hit the road?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of satisfied customers who trust DriveNow for their vehicle rental needs.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/vehicles">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Browse Vehicles
                  </Button>
                </Link>
                <Link href="/account">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
