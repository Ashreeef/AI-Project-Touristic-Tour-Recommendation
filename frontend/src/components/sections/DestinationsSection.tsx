import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const destinations = [
  {
    id: 1,
    image: '/image-5.png',
    title: 'Algiers',
    description: 'The White Pearl of the Mediterranean',
    country: 'Algeria',
    rating: 4.8,
    attractions: 25,
  },
  {
    id: 2,
    image: '/image-6.png',
    title: 'Oran',
    description: 'The Radiant City of Western Algeria',
    country: 'Algeria',
    rating: 4.6,
    attractions: 18,
  },
  {
    id: 3,
    image: '/image.png',
    title: 'Constantine',
    description: 'The City of Bridges and Ancient Wonders',
    country: 'Algeria',
    rating: 4.7,
    attractions: 22,
  },
  {
    id: 4,
    image: '/image-2.png',
    title: 'Annaba',
    description: 'The Serene Coastal Paradise',
    country: 'Algeria',
    rating: 4.5,
    attractions: 15,
  },
  {
    id: 5,
    image: '/image-3.png',
    title: 'Tlemcen',
    description: 'The Pearl of the Maghreb',
    country: 'Algeria',
    rating: 4.9,
    attractions: 20,
  },
  {
    id: 6,
    image: '/image-4.png',
    title: 'Ghardaia',
    description: 'Gateway to the Sahara Desert',
    country: 'Algeria',
    rating: 4.4,
    attractions: 12,
  },
];

export const DestinationsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#062546] mb-4 sm:mb-6 lg:mb-8 [font-family:'Outfit',Helvetica]">
            Discover Algeria
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-[#1e6f9f] max-w-4xl mx-auto leading-relaxed [font-family:'Outfit',Helvetica] font-normal px-2">
            Explore the most beautiful destinations across the pearl of North Africa. 
            From coastal cities to desert oases, discover the diverse beauty of Algeria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-2xl border-0 shadow-lg"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={destination.image}
                    alt={`${destination.title} destination`}
                    className="w-full h-48 sm:h-56 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-lg">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                    <span className="text-sm sm:text-base font-bold text-gray-800 [font-family:'Outfit',Helvetica]">
                      {destination.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#062546] mb-2 sm:mb-3 [font-family:'Outfit',Helvetica]">
                      {destination.title}
                    </h3>
                    <p className="text-[#1e6f9f] text-base sm:text-lg leading-relaxed [font-family:'Outfit',Helvetica] font-normal">
                      {destination.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base [font-family:'Outfit',Helvetica] font-medium">{destination.country}</span>
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 [font-family:'Outfit',Helvetica] font-medium">
                      {destination.attractions} attractions
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
            onClick={() => window.location.href = '/destinations'}
            className="w-full sm:w-auto border-2 border-[#062546] text-[#062546] hover:bg-[#062546] hover:text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg hover:shadow-[#062546]/20 transition-all duration-300 [font-family:'Outfit',Helvetica] group"
          >
            View All Destinations
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};
