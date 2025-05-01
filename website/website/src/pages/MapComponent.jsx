
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox GL JS
mapboxgl.accessToken = "pk.eyJ1IjoiYXg2NjZyYWYiLCJhIjoiY21hNXF6bjI2MGtudDJpc2drMjRxd3E5byJ9.0tbI898wuudgvn9gsWVUPg";

const MapComponent = ({ 
  locations = [], // Default empty array
  onLocationSelect,
  selectedLocationId 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapError, setMapError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    setIsLoading(true);
    setMapError("");

    // Validate locations data
    if (!Array.isArray(locations)) {
      setMapError("Invalid locations data provided");
      setIsLoading(false);
      return;
    }

    try {
      // Get center coordinates from locations or default to Algeria center
      const bounds = new mapboxgl.LngLatBounds();
      const validLocations = locations.filter(loc => 
        loc?.coordinates && Array.isArray(loc.coordinates) && loc.coordinates.length === 2
      );

      if (validLocations.length === 0) {
        setMapError("No valid locations provided");
        setIsLoading(false);
        return;
      }

      validLocations.forEach(location => {
        bounds.extend(location.coordinates);
      });

      // Set default center if no locations
      let center = [3.0588, 36.7538]; // Algiers coordinates
      let zoom = 6;
      if (validLocations.length > 0) {
        center = validLocations[0].coordinates;
        zoom = validLocations.length > 1 ? 7 : 10;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('load', () => {
        // Add markers for each location
        locations.forEach(location => {
          const isSelected = location.id === selectedLocationId;

          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.width = '30px';
          markerElement.style.height = '30px';
          markerElement.style.borderRadius = '50%';
          markerElement.style.backgroundColor = isSelected ? '#4f46e5' : '#f59e0b';
          markerElement.style.display = 'flex';
          markerElement.style.justifyContent = 'center';
          markerElement.style.alignItems = 'center';
          markerElement.style.color = 'white';
          markerElement.style.fontWeight = 'bold';
          markerElement.style.fontSize = '14px';
          markerElement.style.border = '2px solid white';
          markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
          markerElement.innerHTML = `<span>${location.day}</span>`;

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<strong>${location.name}</strong><p>Day ${location.day}</p>`);

          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat(location.coordinates)
            .setPopup(popup)
            .addTo(map.current);

          markerElement.addEventListener('click', () => {
            onLocationSelect?.(location);
          });
        });

        if (locations.length > 1) {
          map.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 10
          });
        }

        setIsLoading(false);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e.error);
        setMapError(`Failed to load map: ${e.error?.message || 'Unknown error'}`);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError(`Failed to initialize map: ${error.message}`);
      setIsLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations, selectedLocationId, onLocationSelect]);

  if (mapError) {
    return (
      <Card className="bg-amber-50 border-amber-200 p-6 h-full flex items-center justify-center text-center">
        <div>
          <h3 className="font-bold text-amber-800">Map Error</h3>
          <p className="text-amber-700 mt-2">{mapError}</p>
          <p className="text-sm mt-4 text-gray-600">
            Please check your Mapbox token and network connection
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

