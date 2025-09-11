import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { MapPin, Star } from 'lucide-react';

// Top 6 hotels for homepage section (highest rated)
const hotels = [
  {
    id: 5,
    name: 'Hotel Zianides',
    location: 'Tlemcen',
    image: '/Hotels/hotel_ziandies.jpg',
    rating: 4.9,
    stars: 5,
    price: 20000,
    description: 'Boutique hotel with Andalusian influence',
  },
  {
    id: 1,
    name: 'Hotel El Djazair',
    location: 'Algiers',
    image: '/Hotels/hotel-el-djazair.jpg',
    rating: 4.8,
    stars: 5,
    price: 25000,
    description: 'Luxury hotel with stunning Mediterranean views',
  },
  {
    id: 3,
    name: 'Hotel Cirta',
    location: 'Constantine',
    image: '/Hotels/hotel_citra.jpg',
    rating: 4.7,
    stars: 4,
    price: 18000,
    description: 'Historic hotel with traditional architecture',
  },
  {
    id: 2,
    name: 'Sheraton Oran Hotel',
    location: 'Oran',
    image: '/Hotels/sheraton_hotel.jpg',
    rating: 4.6,
    stars: 5,
    price: 22000,
    description: 'Modern hotel in the heart of Oran',
  },
  {
    id: 9,
    name: 'Hyatt Regency Algiers',
    location: 'Algiers',
    image: '/Hotels/hyatt_hotel.jpg',
    rating: 4.6,
    stars: 5,
    price: 27000,
    description: 'Luxury hotel in the heart of Algiers',
  },
  {
    id: 14,
    name: 'Sheraton Annaba',
    location: 'Annaba',
    image: '/Hotels/sheraton_annaba_hotel.jpg',
    rating: 4.6,
    stars: 5,
    price: 23000,
    description: 'Premium hotel with coastal views',
  },
];

// Removed unused amenityIcons as Book Now buttons were removed

export const FeaturedHotelsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#1e6f9f] to-[#062546] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 [font-family:'Outfit',Helvetica] drop-shadow-lg">
            Featured Hotels
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed [font-family:'Outfit',Helvetica] font-normal px-2">
            Experience the finest accommodations across Algeria. From luxury resorts 
            to boutique hotels, find your perfect stay.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-2xl border-0 shadow-lg"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={`${hotel.name} hotel`}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-lg">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                    <span className="text-sm sm:text-base font-bold text-gray-800 [font-family:'Outfit',Helvetica]">
                      {hotel.rating}
                    </span>
                  </div>
                  
                </div>

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#062546] mb-2 [font-family:'Outfit',Helvetica]">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[#1e6f9f] mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base [font-family:'Outfit',Helvetica] font-medium">{hotel.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed [font-family:'Outfit',Helvetica]">
                      {hotel.description}
                    </p>
                  </div>


                  <div className="pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <span className="text-2xl sm:text-3xl font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                        {hotel.price.toLocaleString()} DZD
                      </span>
                      <span className="text-gray-600 text-sm sm:text-base ml-2 [font-family:'Outfit',Helvetica]">/night</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            onClick={() => window.location.href = '/hotels'}
            className="w-full sm:w-auto border-2 border-white text-[#062546] bg-white hover:bg-gray-100 hover:text-[#062546] px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg hover:shadow-white/20 transition-all duration-300 [font-family:'Outfit',Helvetica] group"
          >
            View All Hotels
          </Button>
        </div>
      </div>
    </section>
  );
};
