-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  engine TEXT,
  horsepower INTEGER,
  acceleration TEXT,
  top_speed TEXT,
  range_miles INTEGER,
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  return_time TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  return_location TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can only access their own profile
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Vehicles policies: everyone can view vehicles
CREATE POLICY "vehicles_select_all" ON public.vehicles FOR SELECT TO authenticated, anon USING (true);

-- Bookings policies: users can only access their own bookings
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_update_own" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bookings_delete_own" ON public.bookings FOR DELETE USING (auth.uid() = user_id);
