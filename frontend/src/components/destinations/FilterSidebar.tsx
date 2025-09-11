import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Star, Filter, X, Loader2 } from 'lucide-react';

interface FilterSidebarProps {
  onFiltersChange: (filters: { selectedCategories: string[]; ratingRange: [number, number] }) => void;
  categories?: string[];
  isLoading?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFiltersChange, 
  categories = [], 
  isLoading = false 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setRatingRange([1, 5]);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
                          ratingRange[0] !== 1 || ratingRange[1] !== 5;

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({ selectedCategories, ratingRange });
  }, [selectedCategories, ratingRange, onFiltersChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Filter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Type</h4>
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1e6f9f]" />
                  <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 [font-family:'Outfit',Helvetica]"
                    >
                      {category}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-4 [font-family:'Outfit',Helvetica]">
                  No categories available
                </div>
              )}
            </div>
          </div>

          {/* Rating Range */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Rating
            </h4>
            <div className="space-y-3">
              <Slider
                value={ratingRange}
                onValueChange={(value) => setRatingRange(value as [number, number])}
                max={5}
                min={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{ratingRange[0].toFixed(1)}</span>
                <span>{ratingRange[1].toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button className="w-full bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
