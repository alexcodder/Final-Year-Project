import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

// Kathmandu coordinates
const KATHMANDU_CENTER = {
  lat: 27.7172,
  lng: 85.3240
};

// Custom icons for different types of locations
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bloodBankIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const location = useLocation();
  const focusHospital = location.state?.focusHospital;

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/hospitals');
        if (response.data.success) {
          setLocations(response.data.data);
        } else {
          toast.error('Failed to fetch locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Error fetching locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Initialize map
  useEffect(() => {
    if (isLoading) return; // Wait until loading is done
    if (!mapRef.current) {
      console.log('Map ref is not ready');
      return;
    }

    // Only initialize if the container has a height
    const checkAndInit = () => {
      const height = mapRef.current.offsetHeight;
      console.log('Map container height:', height);
      if (height && !mapInstanceRef.current) {
        console.log('Initializing map...');
        const map = L.map(mapRef.current).setView([KATHMANDU_CENTER.lat, KATHMANDU_CENTER.lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setTimeout(() => {
          map.invalidateSize();
          console.log('Map size invalidated');
        }, 0);
      } else if (!height) {
        // Try again after a short delay if height is 0
        console.log('Height is 0, retrying...');
        setTimeout(checkAndInit, 100);
      }
    };

    checkAndInit();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log('Map cleaned up');
      }
    };
  }, [isLoading]);

  // Update markers when locations or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    let filteredLocations = locations;
    if (focusHospital) {
      filteredLocations = locations.filter(
        loc =>
          loc._id === focusHospital.id ||
          (loc.position?.lat === focusHospital.lat &&
           loc.position?.lng === focusHospital.lng)
      );
      if (filteredLocations.length && mapInstanceRef.current) {
        mapInstanceRef.current.setView(
          [focusHospital.lat, focusHospital.lng],
          16
        );
      }
    }

    filteredLocations.forEach(location => {
      const marker = L.marker([location.position.lat, location.position.lng], {
        icon: location.type === 'hospital' ? hospitalIcon : bloodBankIcon
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="info-window">
            <h3>${location.name}</h3>
            <p><strong>Type:</strong> ${location.type}</p>
            <p><strong>Address:</strong> ${location.address}</p>
            <p><strong>Contact:</strong> ${location.contact}</p>
            <p><strong>Status:</strong> ${location.available ? 'Available' : 'Busy'}</p>
          </div>
        `);

      marker.on('click', () => {
        setSelectedLocation(location);
      });

      markersRef.current.push(marker);
    });
  }, [locations, filter, focusHospital]);

  if (isLoading) {
    return (
      <div className="map-container">
        <div className="loading">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-controls">
        <h2>Healthcare Locations in Kathmandu</h2>
        <div className="filter-controls">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'hospital' ? 'active' : ''} 
            onClick={() => setFilter('hospital')}
          >
            Hospitals
          </button>
          <button 
            className={filter === 'bloodbank' ? 'active' : ''} 
            onClick={() => setFilter('bloodbank')}
          >
            Blood Banks
          </button>
        </div>
      </div>

      <div ref={mapRef} id="map"></div>
    </div>
  );
}

export default Map;