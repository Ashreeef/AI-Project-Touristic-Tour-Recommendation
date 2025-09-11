import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { HotelsGrid } from '../components/hotels/HotelsGrid';
import { HotelFilters } from '../components/hotels/HotelFilters';
import { Button } from '../components/ui/button';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export const HotelsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 150000] as [number, number],
    ratingRange: [1, 5] as [number, number],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFiltersChange = (newFilters: { priceRange: [number, number]; ratingRange: [number, number] }) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - in real app, this would reload data
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader 
        title="Featured Hotels"
        subtitle="Experience the finest accommodations across Algeria"
        backgroundImage="/Hotels/sheraton_hotel.jpg"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <HotelFilters 
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                Hotels & Accommodations
              </h2>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-[#1e6f9f] text-[#1e6f9f] hover:bg-[#1e6f9f] hover:text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            
            <HotelsGrid 
              priceRange={filters.priceRange}
              ratingRange={filters.ratingRange}
            />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 [font-family:'Outfit',Helvetica] mb-4">
                Discover the best hotels and accommodations across Algeria. Use filters to find your perfect stay.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Data is loaded from our comprehensive database of Algerian hotels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
