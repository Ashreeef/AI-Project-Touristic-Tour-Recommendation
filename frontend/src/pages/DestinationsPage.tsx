import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { DestinationsGrid } from '../components/destinations/DestinationsGrid';
import { FilterSidebar } from '../components/destinations/FilterSidebar';
import { useItinerary } from '../hooks/useItinerary';
import { Button } from '../components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    selectedCategories: [] as string[],
    ratingRange: [1, 5] as [number, number]
  });

  const {
    isLoadingCategories,
    categories,
    loadCategories,
    clearError
  } = useItinerary();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFiltersChange = (newFilters: { selectedCategories: string[]; ratingRange: [number, number] }) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    clearError();
    loadCategories();
  };

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader 
        title="Discover Algeria"
        subtitle="Explore the most beautiful destinations across the pearl of North Africa"
        backgroundImage="/destinations/NotreDameDafrique.jpg"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="lg:w-1/4">
            <FilterSidebar 
              onFiltersChange={handleFiltersChange}
              categories={categories}
              isLoading={isLoadingCategories}
            />
          </div>
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                Attractions & Destinations
              </h2>
              <Button
                onClick={handleRefresh}
                disabled={isLoadingCategories}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto border-[#1e6f9f] text-[#1e6f9f] hover:bg-[#1e6f9f] hover:text-white"
              >
                {isLoadingCategories ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            
            <DestinationsGrid 
              selectedCategories={filters.selectedCategories}
              ratingRange={filters.ratingRange}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};
