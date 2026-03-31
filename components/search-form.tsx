"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPin, Search } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { locations } from "@/lib/vehicles"

interface SearchFormProps {
  variant?: "hero" | "compact"
}

export function SearchForm({ variant = "hero" }: SearchFormProps) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (pickupDate) params.set("pickup", format(pickupDate, "yyyy-MM-dd"))
    if (returnDate) params.set("return", format(returnDate, "yyyy-MM-dd"))
    router.push(`/vehicles?${params.toString()}`)
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-11 truncate">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Pick-up location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className="h-11 gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-lg">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pick-up Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-11 sm:h-12 truncate text-sm">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc} className="text-sm">{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Pick-up Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 sm:h-12 w-full justify-start text-left font-normal text-sm truncate",
                  !pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                {pickupDate ? format(pickupDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-40" align="start">
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
          <Label className="text-sm font-medium">Return Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 sm:h-12 w-full justify-start text-left font-normal text-sm truncate",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                {returnDate ? format(returnDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-40" align="start">
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

        <div className="flex items-end">
          <Button onClick={handleSearch} className="h-11 sm:h-12 w-full gap-2 text-sm sm:text-base">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
