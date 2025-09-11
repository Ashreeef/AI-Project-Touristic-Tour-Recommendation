/**
 * Interactive Map Component
 * 
 * Displays attractions and hotels on an interactive map using Leaflet
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import * as L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryResponse } from '../../services/api';
import { MapPin, Hotel, Star, Clock, DollarSign } from 'lucide-react';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const attractionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hotelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface InteractiveMapProps {
  itinerary: ItineraryResponse;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  itinerary, 
  height = '400px' 
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([36.737232, 3.086472]); // Default to Algiers
  const [markers, setMarkers] = useState<Array<{
    position: [number, number];
    type: 'attraction' | 'hotel';
    data: any;
    day: number;
  }>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (itinerary && itinerary.days) {
      const allMarkers: Array<{
        position: [number, number];
        type: 'attraction' | 'hotel';
        data: any;
        day: number;
      }> = [];

      let totalLat = 0;
      let totalLon = 0;
      let pointCount = 0;

      // Process each day
      itinerary.days.forEach((day, dayIndex) => {
        // Add attraction markers
        day.activities.forEach((activity) => {
          
          if (activity.coordinates && Array.isArray(activity.coordinates) && activity.coordinates.length >= 2) {
            const [lat, lon] = activity.coordinates;
            allMarkers.push({
              position: [lat, lon],
              type: 'attraction',
              data: activity,
              day: dayIndex + 1
            });
            
            totalLat += lat;
            totalLon += lon;
            pointCount++;
          }
        });

        // Add hotel marker
        if (day.accommodation && day.accommodation.name !== 'No hotel found') {
          // For now, use the last activity's coordinates for hotel
          // In a real implementation, you'd have hotel coordinates
          const lastActivity = day.activities[day.activities.length - 1];
          if (lastActivity) {
            const [lat, lon] = lastActivity.coordinates;
            allMarkers.push({
              position: [lat, lon],
              type: 'hotel',
              data: day.accommodation,
              day: dayIndex + 1
            });
          }
        }
      });

      setMarkers(allMarkers);

      // Calculate center point
      if (pointCount > 0) {
        const centerLat = totalLat / pointCount;
        const centerLon = totalLon / pointCount;
        setMapCenter([centerLat, centerLon]);
      }
    }
  }, [itinerary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };



  if (!isClient) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ height }}>
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p className="[font-family:'Outfit',Helvetica] font-normal">
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  if (!itinerary || markers.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ height }}>
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p className="[font-family:'Outfit',Helvetica] font-normal">
            No map data available
          </p>
        </div>
      </div>
    );
  }

  const toLatLngTuple = (c: LatLngExpression): [number, number] => {
    if (Array.isArray(c)) {
      return [c[0] as number, c[1] as number];
    }
    const anyC: any = c as any;
    if (typeof anyC?.lat === 'number' && typeof anyC?.lng === 'number') {
      return [anyC.lat, anyC.lng];
    }
    // Fallback for L.LatLng instance
    return [(anyC as L.LatLng).lat, (anyC as L.LatLng).lng];
  };

  const [centerLat, centerLng] = toLatLngTuple(mapCenter);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        key={`map-${centerLat}-${centerLng}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.type === 'attraction' ? attractionIcon : hotelIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  {marker.type === 'attraction' ? (
                    <MapPin className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Hotel className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                    Day {marker.day}
                  </span>
                </div>
                
                <h3 className="font-bold text-[#062546] mb-2 [font-family:'Outfit',Helvetica]">
                  {marker.data.name || marker.data.title}
                </h3>
                
                {marker.type === 'attraction' ? (
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.cost}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.time}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {formatCurrency(marker.data.price)}/night
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      <span className="[font-family:'Outfit',Helvetica] font-normal">
                        {marker.data.rating}/5
                      </span>
                    </div>
                    {marker.data.amenities && marker.data.amenities.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {marker.data.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                            <span 
                              key={idx}
                              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full [font-family:'Outfit',Helvetica] font-normal"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Add route lines between attractions for each day */}
        {itinerary.days.map((day, dayIndex) => {
          if (day.activities.length > 0) {
            const coordinates = day.activities.map(activity => activity.coordinates);
            const routeColor = dayIndex === 0 ? '#1e6f9f' : dayIndex === 1 ? '#059669' : dayIndex === 2 ? '#dc2626' : '#7c3aed';
            
            
            // Draw route even for single activity (as a point)
            if (coordinates.length === 1) {
              // For single activity, create a small circle or just show the marker
              return null; // Let the marker handle single points
            }
            
            return (
              <Polyline
                key={`route-${dayIndex}`}
                positions={coordinates}
                color={routeColor}
                weight={4}
                opacity={0.8}
                dashArray={dayIndex > 1 ? "5, 5" : undefined} // Add dash pattern for day 3+
              />
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};
