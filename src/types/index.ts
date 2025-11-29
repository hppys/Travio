// File: src/types/index.ts

export interface Flight {
  id: number;
  airline: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration: string;
  image_url: string;
}

export interface HotelLocation {
  id: number;
  city: string;
  country: string;
  hotel_id: number;
  latitude?: number;
  longitude?: number;
}

export interface HotelFacility {
  facility: string;
}

export interface Hotel {
  id: number;
  name: string;
  rating: number;
  price_per_night: number;
  image_url: string;
  hotel_locations: HotelLocation[];
  hotel_facilities: HotelFacility[];
}

export interface RentalLocation {
  id: number;
  city: string;
  country: string;
  rental_id: number;
}

export interface Rental {
  id: number;
  company_name: string;
  car_model: string;
  price_per_day: number;
  availability: string;
  image_url: string;
  rental_locations: RentalLocation[];
}
