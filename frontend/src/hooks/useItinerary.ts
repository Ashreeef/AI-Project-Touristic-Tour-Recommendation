/**
 * Custom hook for managing itinerary generation and state
 */

import { useState, useCallback } from 'react';
import { 
  generateItinerary, 
  getCategories, 
  getWilayas,
  checkHealth,
  ItineraryRequest,
  ItineraryResponse,
  CategoriesResponse,
  WilayasResponse,
  HealthResponse,
  DEFAULT_ITINERARY_PARAMS
} from '../services/api';

export interface UseItineraryState {
  // Loading states
  isGenerating: boolean;
  isLoadingCategories: boolean;
  isLoadingWilayas: boolean;
  isCheckingHealth: boolean;
  
  // Data
  itinerary: ItineraryResponse | null;
  categories: string[];
  wilayas: string[];
  health: HealthResponse | null;
  
  // Error states
  error: string | null;
  categoriesError: string | null;
  wilayasError: string | null;
  healthError: string | null;
}

export interface UseItineraryActions {
  generateItinerary: (request: ItineraryRequest) => Promise<ItineraryResponse>;
  loadCategories: () => Promise<void>;
  loadWilayas: () => Promise<void>;
  checkHealth: () => Promise<void>;
  loadTestItinerary: () => Promise<void>;
  clearError: () => void;
  clearItinerary: () => void;
}

export function useItinerary(): UseItineraryState & UseItineraryActions {
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  
  // Data
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [wilayasError, setWilayasError] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const generateItineraryAction = useCallback(async (request: ItineraryRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Merge with default parameters
      const fullRequest = { ...DEFAULT_ITINERARY_PARAMS, ...request };
      
      const response = await generateItinerary(fullRequest);
      setItinerary(response.data);
      return response.data; // Return the itinerary data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary';
      setError(errorMessage);
      console.error('Itinerary generation error:', err);
      throw err; // Re-throw the error
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    
    try {
      const response: CategoriesResponse = await getCategories();
      console.log('Categories loaded:', response.categories);
      setCategories(response.categories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      setCategoriesError(errorMessage);
      console.error('Categories loading error:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const loadWilayas = useCallback(async () => {
    setIsLoadingWilayas(true);
    setWilayasError(null);
    
    try {
      const response: WilayasResponse = await getWilayas();
      setWilayas(response.wilayas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load wilayas';
      setWilayasError(errorMessage);
      console.error('Wilayas loading error:', err);
    } finally {
      setIsLoadingWilayas(false);
    }
  }, []);

  const checkHealthAction = useCallback(async () => {
    setIsCheckingHealth(true);
    setHealthError(null);
    
    try {
      const response: HealthResponse = await checkHealth();
      setHealth(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check API health';
      setHealthError(errorMessage);
      console.error('Health check error:', err);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setCategoriesError(null);
    setWilayasError(null);
    setHealthError(null);
  }, []);

  const clearItinerary = useCallback(() => {
    setItinerary(null);
    setError(null);
  }, []);

  const loadTestItinerary = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/itinerary/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Test itinerary response:', result);
      
      if (result.data) {
        setItinerary(result.data);
        // Store in localStorage for the results page
        localStorage.setItem('itinerary', JSON.stringify(result.data));
      } else {
        throw new Error('No data in test response');
      }
    } catch (err) {
      console.error('Error loading test itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load test itinerary');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    // State
    isGenerating,
    isLoadingCategories,
    isLoadingWilayas,
    isCheckingHealth,
    itinerary,
    categories,
    wilayas,
    health,
    error,
    categoriesError,
    wilayasError,
    healthError,
    
    // Actions
    generateItinerary: generateItineraryAction,
    loadCategories,
    loadWilayas,
    checkHealth: checkHealthAction,
    loadTestItinerary,
    clearError,
    clearItinerary,
  };
}
