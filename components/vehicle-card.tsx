import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Gauge, Fuel, ArrowRight } from "lucide-react"

export interface VehicleData {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: string
  price_per_day: number
  image_url: string | null
  seats: number
  transmission: string
  fuel_type: string
  features: string[]
  description: string | null
  available: boolean
}

interface VehicleCardProps {
  vehicle: VehicleData
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="group overflow-hidden border-border transition-all hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={vehicle.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"}
          alt={`${vehicle.brand} ${vehicle.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
          </Badge>
        </div>
        {vehicle.fuel_type === "electric" && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Electric</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{vehicle.seats} seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{vehicle.fuel_type}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-2xl font-bold">₹{vehicle.price_per_day}</span>
            <span className="text-sm text-muted-foreground">/hr</span>
          </div>
          <Link href={`/vehicles/${vehicle.id}`}>
            <Button size="sm" className="gap-1">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
