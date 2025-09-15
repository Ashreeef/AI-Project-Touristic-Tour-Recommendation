/**
 * API Service for 7wess Touristic Tour Recommendation System
 * 
 * This service handles all communication with the Flask backend API.
 * It provides methods for fetching attractions, categories, wilayas,
 * and generating itineraries using the A* search algorithm.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types for API responses
export interface Attraction {
  name: string;
  category: string;
  city: string;
  gps: [number, number];
  description: string;
  rating: number;
  cost: string;
  visit_duration: string;
  nearby_amenities: string[];
  image: string;
}

export interface Hotel {
  id?: string;
  hotel: string;
  city: string;
  avg_review: number;
  price: number;
  type?: string;
  amenities?: string[];
  image?: string; 
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  category: string;
  cost: string;
  duration: string;
  rating: number;
  coordinates: [number, number];
}

export interface Accommodation {
  name: string;
  city: string;
  rating: number;
  price: number;
  type: string;
  amenities: string[];
}

export interface DayPlan {
  day: number;
  title: string;
  location: string;
  coordinates: [number, number];
  totalCost: number;
  totalTime: number;
  activities: Activity[];
  accommodation: Accommodation;
}

export interface ItineraryResponse {
  success: boolean;
  title: string;
  summary: string;
  totalBudget: number;
  totalTime: number;
  hotelCost: number;
  remainingBudget: number;
  satisfaction: number;
  days: DayPlan[];
}

export interface AttractionsResponse {
  success: boolean;
  count: number;
  attractions: Attraction[];
}

export interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export interface WilayasResponse {
  success: boolean;
  wilayas: string[];
}

export interface HotelsResponse {
  success: boolean;
  count: number;
  hotels: Hotel[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  attractions_loaded: number;
  hotels_loaded: number;
  version: string;
}

// Request types
export interface ItineraryRequest {
  wilaya: string;
  location: string; // "latitude, longitude"
  activities: string[];
  budget: number;
  minHotelStars?: number;
  maxHotelStars?: number;
  maxAttractions?: number;
  maxTravelHours?: number;
  hasCar?: boolean;
}

export interface AttractionsRequest {
  wilaya?: string;
  category?: string;
  limit?: number;
}

export interface HotelsRequest {
  wilaya?: string;
  limit?: number;
  min_stars?: number;
  max_stars?: number;
}

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health');
}

/**
 * Get attractions with optional filtering
 */
export async function getAttractions(
  params: AttractionsRequest = {}
): Promise<AttractionsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.wilaya) searchParams.append('wilaya', params.wilaya);
  if (params.category) searchParams.append('category', params.category);
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/attractions?${queryString}` : '/api/attractions';
  
  return apiRequest<AttractionsResponse>(endpoint);
}

/**
 * Get all available attraction categories
 */
export async function getCategories(): Promise<CategoriesResponse> {
  return apiRequest<CategoriesResponse>('/api/categories');
}

/**
 * Get all available wilayas (provinces)
 */
export async function getWilayas(): Promise<WilayasResponse> {
  return apiRequest<WilayasResponse>('/api/wilayas');
}

/**
 * Get all available cities (same as wilayas for this implementation)
 */
export async function getCities(): Promise<WilayasResponse> {
  return apiRequest<WilayasResponse>('/api/wilayas');
}

/**
 * Get hotels with optional filtering
 */
export async function getHotels(
  params: HotelsRequest = {}
): Promise<HotelsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.wilaya) searchParams.append('wilaya', params.wilaya);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.min_stars) searchParams.append('min_stars', params.min_stars.toString());
  if (params.max_stars) searchParams.append('max_stars', params.max_stars.toString());

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/hotels?${queryString}` : '/api/hotels';
  
  return apiRequest<HotelsResponse>(endpoint);
}

/**
 * Generate an optimized 7-day itinerary
 */
export async function generateItinerary(
  request: ItineraryRequest
): Promise<{ data: ItineraryResponse }> {
  return apiRequest<{ data: ItineraryResponse }>('/api/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Utility function to validate GPS coordinates
 */
export function validateGPSCoordinates(location: string): boolean {
  const coords = location.split(',').map(s => s.trim());
  if (coords.length !== 2) return false;
  
  const [lat, lon] = coords.map(Number);
  return (
    !isNaN(lat) && !isNaN(lon) &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

/**
 * Utility function to format GPS coordinates
 */
export function formatGPSCoordinates(lat: number, lon: number): string {
  return `${lat}, ${lon}`;
}

/**
 * Utility function to parse GPS coordinates
 */
export function parseGPSCoordinates(location: string): [number, number] | null {
  if (!validateGPSCoordinates(location)) return null;
  
  const coords = location.split(',').map(s => s.trim());
  return [Number(coords[0]), Number(coords[1])];
}

/**
 * Default values for itinerary requests
 */
export const DEFAULT_ITINERARY_PARAMS = {
  minHotelStars: 3,
  maxHotelStars: 5,
  maxAttractions: 3,
  maxTravelHours: 8.0,
  hasCar: false,
} as const;
