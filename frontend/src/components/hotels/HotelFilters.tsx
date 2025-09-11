import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Filter, X, Loader2 } from 'lucide-react';

interface HotelFiltersProps {
  onFiltersChange: (filters: { priceRange: [number, number]; ratingRange: [number, number] }) => void;
  isLoading?: boolean;
}

export const HotelFilters: React.FC<HotelFiltersProps> = ({ onFiltersChange, isLoading = false }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);

  const clearFilters = () => {
    setPriceRange([0, 150000]);
    setRatingRange([1, 5]);
  };

  const hasActiveFilters = priceRange[0] !== 0 || priceRange[1] !== 150000 || ratingRange[0] !== 1 || ratingRange[1] !== 5;

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({ priceRange, ratingRange });
  }, [priceRange, ratingRange, onFiltersChange]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Hotels
        </CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e6f9f] mx-auto mb-2" />
              <p className="text-sm text-gray-600 [font-family:'Outfit',Helvetica] font-normal">
                Loading filters...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h4 className="font-semibold mb-3 text-[#062546] [font-family:'Outfit',Helvetica]">
                Price Range (DZD)
              </h4>
              <Slider 
                value={priceRange} 
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={150000} 
                min={0} 
                step={1000} 
                className="w-full transition-all duration-300"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-3 [font-family:'Outfit',Helvetica] font-normal">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-[#1e6f9f]">{priceRange[0].toLocaleString()}</span>
                  <span className="text-gray-500">DZD</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-[#1e6f9f]">{priceRange[1].toLocaleString()}</span>
                  <span className="text-gray-500">DZD</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500 [font-family:'Outfit',Helvetica] font-normal">
                  {priceRange[0] === priceRange[1] 
                    ? `Exactly ${priceRange[0].toLocaleString()} DZD`
                    : `${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} DZD`
                  }
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#062546] [font-family:'Outfit',Helvetica]">
                Star Rating
              </h4>
              
              {/* Star Rating Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        if (ratingRange[0] === ratingRange[1] && ratingRange[0] === star) {
                          // If clicking the same star, reset to full range
                          setRatingRange([1, 5]);
                        } else {
                          // Set both min and max to the clicked star
                          setRatingRange([star, star]);
                        }
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-sm font-bold ${
                        ratingRange[0] <= star && star <= ratingRange[1]
                          ? 'bg-[#1e6f9f] border-[#1e6f9f] text-white shadow-lg transform scale-105'
                          : 'bg-white border-gray-300 text-gray-500 hover:border-[#1e6f9f] hover:text-[#1e6f9f] hover:scale-105'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={isLoading}
                    >
                      {star}
                    </button>
                  ))}
                </div>
                
                
                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setRatingRange([4, 5])}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                      ratingRange[0] === 4 && ratingRange[1] === 5
                        ? 'bg-[#1e6f9f] text-white border-[#1e6f9f]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#1e6f9f] hover:text-[#1e6f9f]'
                    }`}
                    disabled={isLoading}
                  >
                    High End (4-5★)
                  </button>
                  <button
                    onClick={() => setRatingRange([3, 4])}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                      ratingRange[0] === 3 && ratingRange[1] === 4
                        ? 'bg-[#1e6f9f] text-white border-[#1e6f9f]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#1e6f9f] hover:text-[#1e6f9f]'
                    }`}
                    disabled={isLoading}
                  >
                    Mid Range (3-4★)
                  </button>
                  <button
                    onClick={() => setRatingRange([1, 5])}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                      ratingRange[0] === 1 && ratingRange[1] === 5
                        ? 'bg-[#1e6f9f] text-white border-[#1e6f9f]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#1e6f9f] hover:text-[#1e6f9f]'
                    }`}
                    disabled={isLoading}
                  >
                    All Ratings
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                className="w-full bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white [font-family:'Outfit',Helvetica] font-semibold"
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
