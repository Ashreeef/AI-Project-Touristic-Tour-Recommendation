import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Star, Grid, List } from 'lucide-react';
import { getAttractions } from '../../services/api';
import { Attraction } from '../../services/api';

//this component is used to display the destinations grid

// Map destination/attraction names to images in public/destinations
// Keys should be normalized via normalizeName(name)
const destinationImageMap: Record<string, string> = {
  // Djamaa El Djazair
  'djamaa el djazair': '/destinations/Grande-mosquée-Alger.jpg',
  'great mosque of algiers': '/destinations/Grande-mosquée-Alger.jpg',
  'grande mosquee alger': '/destinations/Grande-mosquée-Alger.jpg',

  // Jardin d'Essai / Hamma
  'jardin d essai': '/destinations/Hamma-Algeirs.jpg',
  'jardin d essai du hamma' : '/destinations/Hamma-Algeirs.jpg',
  'le jardin d essai du hamma' : '/destinations/Hamma-Algeirs.jpg',
  'jardin dessai': '/destinations/Hamma-Algeirs.jpg',
  'jardin dessai du hamma': '/destinations/Hamma-Algeirs.jpg',
  'hamma garden': '/destinations/Hamma-Algeirs.jpg',

  // Casbah
  'casbah': '/destinations/La-casbah-dAlger.jpg',
  'la casbah dalger': '/destinations/La-casbah-dAlger.jpg',
  'casbah of algiers': '/destinations/La-casbah-dAlger.jpg',



// Martyrs' Memorial (Maqam Echahid)
'martyrs': '/destinations/memorial-du-martyr.jpg',
'martyrs memorial': '/destinations/memorial-du-martyr.jpg',
'martyrs memorial maqam echahid': '/destinations/memorial-du-martyr.jpg',
'maqam echahid': '/destinations/memorial-du-martyr.jpg',

// Grande Poste (typos)
'la grnade poste': '/destinations/La_Grande_post.jpg',
'grande poste': '/destinations/La_Grande_post.jpg',

// Teri Park (typo)
'teri park': '/destinations/Teri_park.jpg',
'reri park': '/destinations/Teri_park.jpg',

// Royal Mausoleum of Mauretania (aliases)
'royal mausoleum of mauretania': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',
'royal mausoleum of mauretania kbour er roumia': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',
'kbour er roumia': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',
'kbor er roumia': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',


 
  'memorial du martyr': '/destinations/memorial-du-martyr.jpg',

 
  'la grande poste': '/destinations/La_Grande_post.jpg',
  'la grande poste d alger': '/destinations/La_Grande_post.jpg',
 
  'la grande post': '/destinations/La_Grande_post.jpg',

  // Bardo Museum
  'bardo': '/destinations/bardo.jpg',
  'bardo museum': '/destinations/bardo.jpg',

  // Palais des Rais (Bastion 23)
  'palais des rais': '/destinations/Palais_des_Raisr.jpg',
  'bastion 23': '/destinations/Palais_des_Raisr.jpg',

  // Royal Mausoleum of Mauretania
  
  'mauretania royal mausoleum': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',
  'maurtiana royal mausolem': '/destinations/Royal_Mausoleum_of_Mauretania.jpg',
 
  // Chrea Mountains
  'chrea mountains': '/destinations/cherea_mountains.jpg',
  'cherea mountains': '/destinations/cherea_mountains.jpg',

  // Monastère de Tibhirine
  'monastere de tibhirine': '/destinations/Monastère_de_Tibhirine.jpg',
  'monastère de tibhirine': '/destinations/Monastère_de_Tibhirine.jpg',

  // Bab Ezzouar (file is .jpg in folder)
  'bab ezzouar': '/destinations/bab_ezzouar.jpg',
  'beb ezzouar shopping mall': '/destinations/bab_ezzouar.jpg',

  // Port de Sidi Fredj
  'port sidi fredj': '/destinations/Port_de_Sidi_Fredj.jpg',
  'port de sidi fredj': '/destinations/Port_de_Sidi_Fredj.jpg',

  // Lac Dhya
  'lac dhya': '/destinations/lac_dhya.jpg',
  'lac dhaya': '/destinations/lac_dhya.jpg',

  // Musée des Beaux-Arts
  'musee des beaux arts': '/destinations/Musee-des-beaux-arts.jpg',
  'musee des beaux arts d alger': '/destinations/Musee-des-beaux-arts.jpg',

  // Notre Dame d'Afrique
  'notre dame d afrique': '/destinations/NotreDameDafrique.jpg',
  "notre dame d afrique basilique": '/destinations/NotreDameDafrique.jpg',

  // Ketchaoua Mosque
  'ketchaoua mosque': '/destinations/ketchaoua-mosque.jpg',

  // Tipaza Roman Ruins
  'tipaza roman ruins': '/destinations/Tipaza_Romain_ruins.jpg',
  // Teri Park common typo
 

  // Extras kept
  'garden city mall': '/destinations/Garden_City_Mall.jpeg',
  'garden of prague': '/destinations/Garden_of_Prague.jpg',
};

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

interface DestinationsGridProps {
  selectedCategories?: string[];
  ratingRange?: [number, number];
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({ 
  selectedCategories = [], 
  ratingRange = [1, 5] 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const response = await getAttractions({ limit: 20 });
        setAttractions(response.attractions);
      } catch (error) {
        console.error('Error loading attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttractions();
  }, []);

  // Filter attractions based on selected categories and rating range
  const filteredAttractions = attractions.filter(attraction => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(attraction.category);
    const ratingMatch = attraction.rating >= ratingRange[0] && attraction.rating <= ratingRange[1];
    return categoryMatch && ratingMatch;
  });

  const sortedAttractions = [...filteredAttractions].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e6f9f] mx-auto mb-4"></div>
          <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Loading attractions...</p>
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Destinations Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
          : 'space-y-4'
      }>
        {sortedAttractions.map((attraction) => (
          <Card
            key={attraction.name}
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
                    src={destinationImageMap[normalizeName(attraction.name)] || '/image-1.png'}
                    alt={`${attraction.name} attraction`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-gray-800">
                      {attraction.rating}
                    </span>
                  </div>
                </div>

                <div className={`p-4 sm:p-6 space-y-3 sm:space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#062546]">
                        {attraction.name}
                      </h3>
                      <span className="bg-[#1e6f9f] text-white text-xs px-2 py-1 rounded-full w-fit">
                        {attraction.category}
                      </span>
                    </div>
                    <p className="text-[#1e6f9f] text-sm mb-2 sm:mb-3">
                      {attraction.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{attraction.city}, Algeria</span>
                    </div>
                    <span>{Number(attraction.cost?.toString().replace(/[^0-9.-]/g, '')) === 0 ? 'Free' : attraction.cost}</span>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};
