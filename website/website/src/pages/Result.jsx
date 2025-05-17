
import { ArrowLeft, ArrowRight, Map as MapIcon } from "lucide-react";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MapComponent from "./MapComponent";
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};
const Card = ({ className, children, ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Simplified Badge Component
const Badge = ({ className, children, variant = 'default', ...props }) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    // Add more variants as needed
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
const Button = ({ className, variant = 'default', size = 'default', children, ...props }) => {
  const variantClasses = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    // Add more variants as needed
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    // Add more sizes as needed
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const itineraryData = {
  title: "Explore Algeria: 7-Days Cultural & Nature Adventure",
  summary: "A perfect blend of cultural exploration and natural wonders across Algeria's most beautiful regions.",
  days: [
    {
      day: 1,
      title: "Algiers: Cultural Heritage",
      location: "Algiers",
      coordinates:[3.0588, 36.7538 ], // Correct order for Mapbox: lng, lat
     // longitude, latitude
      activities: [
        { time: "09:00", title: "Bardo Museum", description: "Housed in a 19th-century Ottoman palace, showcases prehistoric artifacts, traditional costumes, and Roman mosaics. Highlights include Berber jewelry collections." },
        { time: "13:00", title: "Casbah of Algiers", description: "UNESCO World Heritage Site with Ottoman-era palaces, mosques, and labyrinthine streets." },
        { time: "15:00", title: "Martyrs' Memorial (Maqam Echahid)", description: "A monument commemorating Algeria's independence struggle, featuring three palm leaves and an eternal flame." }
        
      ],
      accommodation: {
        name: "Hôtel El Aurassi",
        type: "4-star hotel",
        amenities: ["Public Transport", "Traditional Tea Houses", "Restaurant"]
      }
    },
    {
      day: 2,
      title: "Algiers: Cultural Heritage",
      location: "Algiers",
      coordinates:[3.1825,36.7236], // Correct order for Mapbox: lng, lat
     // longitude, latitude
      activities: [
        { time: "09:00", title: "Beb Ezzouar Shopping Mall", description: "A large shopping mall offering a variety of international and local retail stores, entertainment options, and dining facilities." },
        { time: "13:00", title: "Musée des Beaux-Arts d'Alger", description: "Features a diverse collection of Algerian and international art, including works from the 19th and 20th centuries." },
        { time: "15:00", title: "National Museum of Antiquities of Algiers", description: "The oldest museum in Algeria and Africa, showcasing a vast collection of classical antiquities and Islamic art from various Arab-Muslim dynasties, located in Algiers' Freedom Park." }
       
      ],
      accommodation: {
        name: "Algiers Marriott Hotel Bab Ezzouar",
        type: "4-star hotel",
        amenities: ["Cinema", "Public Transport", "Restaurant"]
      }
    },
    {
      day: 3,
      title: "Algiers: Cultural Heritage",
      location: "Algiers",
      coordinates:[2.9517,36.7507], // Correct order for Mapbox: lng, lat
     // longitude, latitude
      activities: [
        { time: "09:00", title: "Garden City Mall", description: "A premier shopping and entertainment hub in Dély Ibrahim, Algiers. It features a diverse range of retail outlets from international brands to local boutiques. The mall provides various dining options and recreational facilities including cinemas and play areas for children." },
        { time: "13:00", title: "Tipaza Roman Ruins", description: "Coastal UNESCO site with 3rd-century Christian basilica, Roman theater, and thermal baths. Notable for Phoenician-Roman fusion architecture." }
        
      ],
      accommodation: {
        name: "Holiday Inn Algiers - Cheraga Tower by IHG",
        type: "4-star hotel",
        amenities: ["Play areas", "Beach Access",
      "Archaeological Museum", "Restaurant"]
      }
    },
    {
      day: 4,
      title: "Algiers: Cultural Heritage",
      location: "Algiers",
      coordinates:[3.0733,36.74504], 
      activities: [
        { time: "09:00", title: "Royal Mausoleum of Mauretania (Kbour-er-Roumia)", description: "Ancient mausoleum believed to be the tomb of King Juba II and Queen Cleopatra Selene." },
        { time: "13:00", title: " Villa Abd-el-Tif", description: "A historic villa in Algiers, known for its Moorish architecture and artistic legacy, once home to the Abd-el-Tif Prize laureates, fostering creativity and cultural exchange." },
        { time: "15:00", title: "Villa Boulkine", description: "A 19th-century architectural gem in Hussein Dey, Algiers, once the secondary residence of Dey Hussein, now serving as the temporary home for the Grand Museum of Africa." }
      ],
      accommodation: {
        name: "Hôtel El Djazaïr",
        type: "4-star hotel",
        amenities: ["Public Restrooms",
      "Scenic Viewpoints"]
      }
    },
    {
      day: 5,
      title: "Sétif: Cultural Heritage",
      location: "Sétif",
      coordinates:[5.409908696237017,36.192186258904], 
      activities: [
        { time: "09:00", title: "Sétif Archaeological Museum", description: "Museum housing artifacts from the Roman and Byzantine periods." }
      ],
      accommodation: {
        name: "Park Mall Hotel & Conference Center",
        type: "4-star hotel",
        amenities: ["Gift Shop",
      "Guided Tours", "Restaurant"]
      }
    },
    {
      day: 6,
      title: "Batna: Cultural Heritage",
      location: "Batna",
      coordinates:[6.4681,35.4875], // Correct order for Mapbox: lng, lat
     // longitude, latitude
      activities: [
        { time: "09:00", title: "Timgad Ruins", description: "Complete Roman grid city (100 AD) with 3,500-seat theater, Trajan's Arch, and advanced drainage systems. Called 'Algerian Pompeii'." }
      ],
      accommodation: {
        name: "Hôtel El Hayat",
        type: "3-star hotel",
        amenities: ["Visitor Center",
      "Guided Tours", "Restaurant"]
      }
    },
    {
      day: 7,
      title: "Batna: Cultural Heritage",
      location: "Batna",
      coordinates:[6.434999172605006 ,35.70788061410484], // Correct order for Mapbox: lng, lat
     // longitude, latitude
      activities: [
        { time: "09:00", title: "Mausoleum of Medghacen", description: "A royal Numidian mausoleum, a symbol of Algeria's ancient heritage, offering insights into the region’s early civilizations." }
      ],
      accommodation: {
        name: "Hôtel Messaoudi",
        type: "4-star hotel",
        amenities: ["Historical site", "Restaurant"]
      }
    },
    
    
  ]
};

const Results = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const isMobile = useIsMobile();
  
  // Map location data - removed TypeScript type annotation
  const mapLocations = itineraryData.days.map(day => ({
    id: day.day,
    name: day.location,
    coordinates: day.coordinates, // no type assertion
    day: day.day
  }));

  const selectedDayData = itineraryData.days.find(day => day.day === selectedDay) || itineraryData.days[0]
  
  const handleNext = () => {
    if (selectedDay < itineraryData.days.length) {
      setSelectedDay(selectedDay + 1);
    }
  };
  
  const handlePrevious = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-2">
              <ArrowLeft size={16} className="mr-1" />
              Back to search
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{itineraryData.title}</h1>
            <p className="text-gray-600 mt-2 text-lg">{itineraryData.summary}</p>
          </div>
          
        </div>

        {/* Map and Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map (Larger on desktop) */}
          <Card className="lg:col-span-2 h-[400px] overflow-hidden">
            <CardContent className="p-0 h-full">
              <MapComponent 
                locations={mapLocations} 
                selectedLocationId={selectedDay}
                onLocationSelect={(location) => setSelectedDay(location.day)}
              />
            </CardContent>
          </Card>
          
          {/* Summary Card */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapIcon size={18} className="mr-2" />
                Trip Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="font-medium">{itineraryData.days.length} Days</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Destinations</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.from(new Set(itineraryData.days.map(day => day.location))).map((location, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Highlights</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    <li>UNESCO World Heritage sites</li>
                    <li>Traditional Algerian cuisine</li>
                    <li>Historical monuments</li>
                    <li>Cultural experiences</li>
                    <li>Natural landscapes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Selection Tabs (Mobile) */}
        {isMobile && (
          <div className="mb-4 overflow-x-auto flex no-scrollbar">
            <div className="flex space-x-2 p-1">
              {itineraryData.days.map((day) => (
                <Button
                  key={day.day}
                  variant={selectedDay === day.day ? "default" : "outline"}
                  onClick={() => setSelectedDay(day.day)}
                  className={`flex-shrink-0 ${selectedDay === day.day ? 'bg-indigo-600' : ''}`}
                >
                  Day {day.day}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Daily Itinerary Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={selectedDay === 1}
                >
                  <ArrowLeft size={16} />
                </Button>
              )}
              <CardTitle>
                Day {selectedDayData.day}: {selectedDayData.title}
              </CardTitle>
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={selectedDay === itineraryData.days.length}
                >
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
            
            {!isMobile && (
              <div className="flex gap-2">
                {itineraryData.days.map((day) => (
                  <Button
                    key={day.day}
                    variant={selectedDay === day.day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day.day)}
                    className={selectedDay === day.day ? 'bg-indigo-600' : ''}
                  >
                    Day {day.day}
                  </Button>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="py-6">
            <div className="space-y-6">
              {/* Activities Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Activities</h3>
                <div className="space-y-6">
                  {selectedDayData.activities.map((activity, index) => (
                    <div key={index} className="relative pl-8 pb-6">
                      {/* Timeline */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"></div>
                      
                      {/* Content */}
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-indigo-600 font-medium">{activity.time}</span>
                          <h4 className="text-base font-semibold">{activity.title}</h4>
                        </div>
                        <p className="text-gray-600 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Accommodation */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Accommodation</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{selectedDayData.accommodation.name}</h4>
                      <p className="text-gray-600 text-sm">{selectedDayData.accommodation.type}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {selectedDayData.accommodation.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation Buttons (Mobile) */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={selectedDay === 1}
              className="w-[48%]"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous Day
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={selectedDay === itineraryData.days.length}
              className="w-[48%]"
            >
              Next Day
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;