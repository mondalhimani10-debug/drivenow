export interface Vehicle {
  id: string
  name: string
  brand: string
  category: "sedan" | "suv" | "sports" | "luxury" | "electric" | "van"
  pricePerDay: number
  image: string
  seats: number
  transmission: "automatic" | "manual"
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  features: string[]
  rating: number
  reviews: number
  available: boolean
  description: string
  specs: {
    engine: string
    horsepower: number
    topSpeed: string
    acceleration: string
    range?: string
  }
}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Model S Plaid",
    brand: "Tesla",
    category: "electric",
    pricePerDay: 15687,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuelType: "electric",
    features: ["Autopilot", "Premium Sound", "Glass Roof", "Heated Seats", "Wireless Charging"],
    rating: 4.9,
    reviews: 127,
    available: true,
    description: "Experience the future of driving with the Tesla Model S Plaid. With instant acceleration and cutting-edge technology, this electric sedan redefines performance.",
    specs: {
      engine: "Tri Motor Electric",
      horsepower: 1020,
      topSpeed: "200 mph",
      acceleration: "0-60 in 1.99s",
      range: "390 miles"
    }
  },
  {
    id: "2",
    name: "M4 Competition",
    brand: "BMW",
    category: "sports",
    pricePerDay: 20335,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
    seats: 4,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["M Sport Exhaust", "Carbon Roof", "Harman Kardon", "Adaptive Suspension", "M Drive"],
    rating: 4.8,
    reviews: 89,
    available: true,
    description: "The BMW M4 Competition delivers raw power and precision handling. A true driver's car with aggressive styling and track-ready performance.",
    specs: {
      engine: "3.0L Twin-Turbo I6",
      horsepower: 503,
      topSpeed: "180 mph",
      acceleration: "0-60 in 3.8s"
    }
  },
  {
    id: "3",
    name: "Range Rover Sport",
    brand: "Land Rover",
    category: "suv",
    pricePerDay: 22825,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuelType: "diesel",
    features: ["Air Suspension", "Terrain Response", "Meridian Sound", "Panoramic Roof", "Massage Seats"],
    rating: 4.7,
    reviews: 156,
    available: true,
    description: "Combining luxury with capability, the Range Rover Sport conquers any terrain while keeping you in ultimate comfort.",
    specs: {
      engine: "3.0L I6 MHEV",
      horsepower: 395,
      topSpeed: "155 mph",
      acceleration: "0-60 in 5.2s"
    }
  },
  {
    id: "4",
    name: "S-Class S580",
    brand: "Mercedes-Benz",
    category: "luxury",
    pricePerDay: 26975,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["Executive Rear Seats", "Burmester 4D", "MBUX Hyperscreen", "Air Balance", "Magic Body Control"],
    rating: 4.9,
    reviews: 203,
    available: true,
    description: "The pinnacle of automotive luxury. The Mercedes S-Class offers an unparalleled blend of comfort, technology, and prestige.",
    specs: {
      engine: "4.0L V8 Biturbo",
      horsepower: 496,
      topSpeed: "155 mph",
      acceleration: "0-60 in 4.4s"
    }
  },
  {
    id: "5",
    name: "Camry Hybrid",
    brand: "Toyota",
    category: "sedan",
    pricePerDay: 5395,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    seats: 5,
    transmission: "automatic",
    fuelType: "hybrid",
    features: ["Toyota Safety Sense", "JBL Audio", "Wireless CarPlay", "Adaptive Cruise", "Lane Assist"],
    rating: 4.6,
    reviews: 412,
    available: true,
    description: "Reliable, efficient, and comfortable. The Toyota Camry Hybrid is perfect for daily commutes and long road trips alike.",
    specs: {
      engine: "2.5L Hybrid",
      horsepower: 208,
      topSpeed: "130 mph",
      acceleration: "0-60 in 7.6s",
      range: "52 mpg combined"
    }
  },
  {
    id: "6",
    name: "Sprinter Passenger",
    brand: "Mercedes-Benz",
    category: "van",
    pricePerDay: 16185,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
    seats: 12,
    transmission: "automatic",
    fuelType: "diesel",
    features: ["Climate Control", "Rear Camera", "USB Ports", "Leather Seats", "WiFi Hotspot"],
    rating: 4.5,
    reviews: 78,
    available: true,
    description: "Perfect for group travel. The Mercedes Sprinter offers spacious seating for up to 12 passengers with premium amenities.",
    specs: {
      engine: "3.0L V6 Turbo Diesel",
      horsepower: 188,
      topSpeed: "100 mph",
      acceleration: "0-60 in 9.1s"
    }
  },
  {
    id: "7",
    name: "911 Carrera S",
    brand: "Porsche",
    category: "sports",
    pricePerDay: 32785,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
    seats: 4,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["Sport Chrono", "PASM", "Bose Sound", "Sport Exhaust", "Adaptive Seats"],
    rating: 5.0,
    reviews: 64,
    available: true,
    description: "An icon of automotive excellence. The Porsche 911 Carrera S delivers thrilling performance wrapped in timeless design.",
    specs: {
      engine: "3.0L Twin-Turbo Flat-6",
      horsepower: 443,
      topSpeed: "191 mph",
      acceleration: "0-60 in 3.5s"
    }
  },
  {
    id: "8",
    name: "Model Y Long Range",
    brand: "Tesla",
    category: "electric",
    pricePerDay: 10375,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&q=80",
    seats: 7,
    transmission: "automatic",
    fuelType: "electric",
    features: ["Autopilot", "Premium Interior", "Glass Roof", "Supercharging", "Dog Mode"],
    rating: 4.8,
    reviews: 234,
    available: true,
    description: "Versatile electric SUV with impressive range and space. Perfect for families seeking sustainable transportation.",
    specs: {
      engine: "Dual Motor Electric",
      horsepower: 384,
      topSpeed: "135 mph",
      acceleration: "0-60 in 4.8s",
      range: "330 miles"
    }
  }
]

export const categories = [
  { id: "sedan", name: "Sedan", icon: "car" },
  { id: "suv", name: "SUV", icon: "truck" },
  { id: "sports", name: "Sports", icon: "gauge" },
  { id: "luxury", name: "Luxury", icon: "crown" },
  { id: "electric", name: "Electric", icon: "zap" },
  { id: "van", name: "Van", icon: "bus" }
] as const

export const locations = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Kolkata, West Bengal",
  "Jaipur, Rajasthan"
]
