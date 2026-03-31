import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      vehicles (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      vehicle_id: body.vehicle_id,
      pickup_date: body.pickup_date,
      return_date: body.return_date,
      pickup_time: body.pickup_time,
      return_time: body.return_time,
      pickup_location: body.pickup_location,
      return_location: body.return_location,
      total_price: body.total_price,
      status: "confirmed",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(booking)
}
