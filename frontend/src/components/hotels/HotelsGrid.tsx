import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, MapPin } from 'lucide-react';

type FixedHotel = {
  id: number;
  hotel: string;
  city: string;
  image: string;
  avg_review: number;
  stars: number;
  price: number;
};

// All 20 hotels for the hotels page 
const FIXED_HOTELS: FixedHotel[] = [
  { id: 1, hotel: 'Hotel El Djazair', city: 'Algiers', image: '/Hotels/hotel-el-djazair.jpg', avg_review: 4.8, stars: 5, price: 25000 },
  { id: 2, hotel: 'Sheraton Oran Hotel', city: 'Oran', image: '/Hotels/sheraton_hotel.jpg', avg_review: 4.6, stars: 5, price: 22000 },
  { id: 3, hotel: 'Hotel Cirta', city: 'Constantine', image: '/Hotels/hotel_citra.jpg', avg_review: 4.7, stars: 4, price: 18000 },
  { id: 4, hotel: 'Hotel Sabri', city: 'Annaba', image: '/Hotels/hotel_sabri.jpeg', avg_review: 4.5, stars: 4, price: 16000 },
  { id: 5, hotel: 'Hotel Zianides', city: 'Tlemcen', image: '/Hotels/hotel_ziandies.jpg', avg_review: 4.9, stars: 5, price: 20000 },
  { id: 6, hotel: 'Novotel Constantine', city: 'Constantine', image: '/Hotels/novotel_hotel.jpg', avg_review: 4.4, stars: 4, price: 17000 },
  { id: 7, hotel: 'AZ Hotel Vague d’Or', city: 'Algiers', image: '/Hotels/AZ_hotel.jpg', avg_review: 4.2, stars: 4, price: 19000 },
  { id: 8, hotel: 'Holiday Inn Cheraga', city: 'Algiers', image: '/Hotels/holiday_inn.avif', avg_review: 4.3, stars: 4, price: 18500 },
  { id: 9, hotel: 'Hyatt Regency Algiers', city: 'Algiers', image: '/Hotels/hyatt_hotel.jpg', avg_review: 4.6, stars: 5, price: 27000 },
  { id: 10, hotel: 'Renaissance Tlemcen', city: 'Tlemcen', image: '/Hotels/renaissance_hotel.jpg', avg_review: 4.5, stars: 5, price: 24000 },
  { id: 11, hotel: 'Four Points Oran', city: 'Oran', image: '/Hotels/four_points_hotel.avif', avg_review: 4.1, stars: 4, price: 20000 },
  { id: 12, hotel: 'Le Méridien Oran', city: 'Oran', image: '/Hotels/le_meridien_hotel.jpg', avg_review: 4.4, stars: 5, price: 26000 },
  { id: 13, hotel: 'Ibis Tlemcen', city: 'Tlemcen', image: '/Hotels/ibis_Tlemcen_hotel.jpg', avg_review: 4.0, stars: 4, price: 14000 },
  { id: 14, hotel: 'Sheraton Annaba', city: 'Annaba', image: '/Hotels/sheraton_annaba_hotel.jpg', avg_review: 4.6, stars: 5, price: 23000 },
  { id: 15, hotel: 'AZ Hotel Vieux Kouba', city: 'Algiers', image: '/Hotels/AZ_Hotel_Vieux_Kouba.jpg', avg_review: 4.2, stars: 4, price: 15000 },
  { id: 16, hotel: 'El Aurassi', city: 'Algiers', image: '/Hotels/EL_Aurassi.jpg', avg_review: 4.4, stars: 5, price: 26000 },
  { id: 17, hotel: 'Hotel Oasis Tipaza', city: 'Tipaza', image: '/Hotels/Hotel_Oasis.jpg', avg_review: 4.1, stars: 4, price: 15500 },
  { id: 18, hotel: 'Hotel Jijel Plage', city: 'Jijel', image: '/Hotels/hotel_la_plage_jijel.jpg', avg_review: 4.0, stars: 4, price: 14500 },
  { id: 19, hotel: 'Hotel Sidi Fredj', city: 'Algiers', image: '/Hotels/hotel_sidi_fredj.jpg', avg_review: 4.3, stars: 4, price: 17500 },
  { id: 20, hotel: 'AZ Hotel Zeralda', city: 'Algiers', image: '/Hotels/AZ_hotel_zeralda.jpg', avg_review: 4.1, stars: 4, price: 16500 },
];

interface HotelsGridProps {
  priceRange?: [number, number];
  ratingRange?: [number, number];
}

export const HotelsGrid: React.FC<HotelsGridProps> = ({ 
  priceRange = [0, 150000], 
  ratingRange = [1, 5] 
}) => {
  const [hotels, setHotels] = useState<FixedHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use fixed curated hotels; no API calls
    setHotels(FIXED_HOTELS);
    setLoading(false);
  }, []);

  // Filter hotels based on price and rating range
  const filteredHotels = hotels.filter(hotel => {
    const priceMatch = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    const ratingMatch = hotel.avg_review >= ratingRange[0] && hotel.avg_review <= ratingRange[1];
    return priceMatch && ratingMatch;
  });



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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredHotels.map((hotel, index) => (
        <Card key={hotel.id || `${hotel.hotel}-${index}`} className="overflow-hidden hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={hotel.image}
                alt={`${hotel.hotel} hotel`}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{hotel.avg_review}</span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#062546] mb-1">{hotel.hotel}</h3>
                <div className="flex items-center gap-2 text-[#1e6f9f]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.city}, Algeria</span>
                </div>
              </div>
              
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-[#062546]">
                    {hotel.price} DZD
                  </span>
                  <span className="text-gray-600 text-sm ml-1">/night</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
