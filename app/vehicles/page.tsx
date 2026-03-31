"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleCard, type VehicleData } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { categories } from "@/lib/vehicles"
import { Search, SlidersHorizontal, X, Car, LayoutGrid, List } from "lucide-react"

const transmissionTypes = ["automatic", "manual"] as const
const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"] as const

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function VehiclesContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""
  
  const { data: vehicles = [], isLoading } = useSWR<VehicleData[]>("/api/vehicles", fetcher)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 40000])
  const [minSeats, setMinSeats] = useState("any")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory])
    }
  }, [initialCategory])

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((vehicle) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          vehicle.name.toLowerCase().includes(query) ||
          vehicle.brand.toLowerCase().includes(query) ||
          vehicle.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(vehicle.category)) {
        return false
      }

      // Transmission filter
      if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(vehicle.transmission)) {
        return false
      }

      // Fuel type filter
      if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(vehicle.fuel_type)) {
        return false
      }

      // Price range filter
      if (vehicle.price_per_day < priceRange[0] || vehicle.price_per_day > priceRange[1]) {
        return false
      }

      // Seats filter
      if (minSeats !== "any" && vehicle.seats < parseInt(minSeats)) {
        return false
      }

      return true
    })

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price_per_day - b.price_per_day)
        break
      case "price-high":
        result.sort((a, b) => b.price_per_day - a.price_per_day)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [vehicles, searchQuery, selectedCategories, selectedTransmissions, selectedFuelTypes, priceRange, minSeats, sortBy])

  const activeFiltersCount =
    selectedCategories.length +
    selectedTransmissions.length +
    selectedFuelTypes.length +
    (priceRange[0] > 0 || priceRange[1] < 40000 ? 1 : 0) +
    (minSeats !== "any" ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedTransmissions([])
    setSelectedFuelTypes([])
    setPriceRange([0, 40000])
    setMinSeats("any")
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmissions((prev) =>
      prev.includes(transmission) ? prev.filter((t) => t !== transmission) : [...prev, transmission]
    )
  }

  const toggleFuelType = (fuelType: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuelType) ? prev.filter((f) => f !== fuelType) : [...prev, fuelType]
    )
  }

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold">Vehicle Type</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={40000}
            step={1000}
            className="w-full"
          />
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-4">
        <h3 className="font-semibold">Transmission</h3>
        <div className="space-y-3">
          {transmissionTypes.map((transmission) => (
            <div key={transmission} className="flex items-center gap-3">
              <Checkbox
                id={`transmission-${transmission}`}
                checked={selectedTransmissions.includes(transmission)}
                onCheckedChange={() => toggleTransmission(transmission)}
              />
              <Label htmlFor={`transmission-${transmission}`} className="cursor-pointer capitalize">
                {transmission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-4">
        <h3 className="font-semibold">Fuel Type</h3>
        <div className="space-y-3">
          {fuelTypes.map((fuelType) => (
            <div key={fuelType} className="flex items-center gap-3">
              <Checkbox
                id={`fuel-${fuelType}`}
                checked={selectedFuelTypes.includes(fuelType)}
                onCheckedChange={() => toggleFuelType(fuelType)}
              />
              <Label htmlFor={`fuel-${fuelType}`} className="cursor-pointer capitalize">
                {fuelType}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Seats */}
      <div className="space-y-4">
        <h3 className="font-semibold">Minimum Seats</h3>
        <Select value={minSeats} onValueChange={setMinSeats}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="2">2+ seats</SelectItem>
            <SelectItem value="4">4+ seats</SelectItem>
            <SelectItem value="5">5+ seats</SelectItem>
            <SelectItem value="7">7+ seats</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Browse Vehicles</h1>
            <p className="mt-2 text-muted-foreground">
              Explore our collection of premium vehicles for any occasion
            </p>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filters */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden items-center gap-1 rounded-lg border p-1 md:flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1 capitalize">
                  {category}
                  <button onClick={() => toggleCategory(category)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedTransmissions.map((transmission) => (
                <Badge key={transmission} variant="secondary" className="gap-1 capitalize">
                  {transmission}
                  <button onClick={() => toggleTransmission(transmission)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedFuelTypes.map((fuelType) => (
                <Badge key={fuelType} variant="secondary" className="gap-1 capitalize">
                  {fuelType}
                  <button onClick={() => toggleFuelType(fuelType)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 40000) && (
                <Badge variant="secondary" className="gap-1">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button onClick={() => setPriceRange([0, 40000])}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {minSeats !== "any" && (
                <Badge variant="secondary" className="gap-1">
                  {minSeats}+ seats
                  <button onClick={() => setMinSeats("any")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 flex items-center gap-2 font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                <FiltersContent />
              </div>
            </aside>

            {/* Vehicle Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                  <Car className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No vehicles found</h3>
                  <p className="mt-1 text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 && "s"}
                  </p>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                        : "flex flex-col gap-4"
                    }
                  >
                    {filteredVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <VehiclesContent />
    </Suspense>
  )
}
