import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Star, MapPin, Grid, List, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { getHotels } from '../../services/api';
import { Hotel } from '../../services/api';

// Default image fallback
const DEFAULT_HOTEL_IMAGE = '/image-1.png';

const getHotelImage = (hotel: Hotel): string => {
  if (hotel.image) {
    return `/Hotels/${hotel.image}`;
  }
  return DEFAULT_HOTEL_IMAGE;
};

interface HotelsGridProps {
  priceRange?: [number, number];
  ratingRange?: [number, number];
}

export const HotelsGrid: React.FC<HotelsGridProps> = ({ 
  priceRange = [0, 150000], 
  ratingRange = [1, 5] 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await getHotels();
        setHotels(response.hotels);
      } catch (error) {
        console.error('Error loading hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Filter hotels based on price and rating range
  const filteredHotels = hotels.filter(hotel => {
    const priceMatch = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    const ratingMatch = hotel.avg_review >= ratingRange[0] && hotel.avg_review <= ratingRange[1];
    return priceMatch && ratingMatch;
  });

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.avg_review - a.avg_review;
      case 'price':
        return a.price - b.price;
      case 'name':
        return a.hotel.localeCompare(b.hotel);
      default:
        return 0;
    }
  });

  // Calculate stars based on rating (convert 0-5 rating to 1-5 stars)
  const getStars = (rating: number): number => {
    return Math.round(rating);
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = sortedHotels.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, ratingRange]);

  // Helper function to generate pagination numbers with ellipses
  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Handle go to page
  const handleGoToPage = () => {
    const page = parseInt(goToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPage('');
    }
  };

  // Handle enter key in go to page input
  const handleGoToPageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e6f9f] mx-auto mb-4"></div>
          <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="px-3 py-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="px-3 py-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-[#1e6f9f] focus:border-transparent"
            >
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hotels Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
          : 'space-y-4'
      }>
        {paginatedHotels.map((hotel, index) => {
          const stars = getStars(hotel.avg_review);
          return (
            <Card
              key={hotel.id || `${hotel.hotel}-${index}`}
              className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}
            >
              <CardContent className={viewMode === 'list' ? 'p-0' : 'p-0'}>
                <div className={viewMode === 'list' ? 'flex' : ''}>
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-32 sm:w-48 h-24 sm:h-32' : 'w-full h-40 sm:h-48'
                  }`}>
                    <img
                      src={getHotelImage(hotel)}
                      alt={`${hotel.hotel} hotel`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_HOTEL_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold text-gray-800">
                        {hotel.avg_review}
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 sm:p-6 space-y-3 sm:space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-[#062546]">
                          {hotel.hotel}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#1e6f9f] text-sm mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.city}, Algeria</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-[#062546]">
                          {hotel.price.toLocaleString()} DZD
                        </span>
                        <span className="text-gray-600 text-sm">/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {getPaginationNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-3 py-2 min-w-[40px] transition-all ${
                      currentPage === page 
                        ? 'bg-[#1e6f9f] text-white border-[#1e6f9f] rounded-full font-semibold' 
                        : 'hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] hover:rounded-full'
                    }`}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 [font-family:'Outfit',Helvetica]">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Go to page (for large datasets) */}
          {totalPages > 10 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-gray-600 [font-family:'Outfit',Helvetica]">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onKeyPress={handleGoToPageKeyPress}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e6f9f] focus:border-transparent"
                placeholder="Page"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToPage}
                className="px-3 py-1 text-sm hover:bg-[#1e6f9f] hover:text-white hover:border-[#1e6f9f] transition-colors"
              >
                Go
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results info */}
      <div className="text-center mt-4 text-sm text-gray-600 [font-family:'Outfit',Helvetica]">
        Showing {startIndex + 1}-{Math.min(endIndex, sortedHotels.length)} of {sortedHotels.length} hotels
      </div>

    </div>
  );
};
