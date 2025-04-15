import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Kathmandu coordinates
const KATHMANDU_CENTER = {
  lat: 27.7172,
  lng: 85.3240
};

// Sample data - Replace with your actual data from backend
const healthcareLocations = [
  {
    id: 1,
    name: "Bir Hospital",
    type: "hospital",
    position: { lat: 27.7044, lng: 85.3174 },
    address: "Kathmandu 44600",
    contact: "+977-1-4221110",
    available: true
  },
  {
    id: 2,
    name: "Tribhuvan University Teaching Hospital",
    type: "hospital",
    position: { lat: 27.7324, lng: 85.3184 },
    address: "Maharajgunj, Kathmandu",
    contact: "+977-1-4412503",
    available: true
  },
  {
    id: 3,
    name: "Central Blood Bank",
    type: "bloodbank",
    position: { lat: 27.7044, lng: 85.3174 },
    address: "Teku, Kathmandu",
    contact: "+977-1-4221110",
    available: true
  }
];

const containerStyle = {
  width: '100%',
  height: '80vh'
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
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map('map').setView([KATHMANDU_CENTER.lat, KATHMANDU_CENTER.lng], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers = [];

    // Add new markers
    const filteredLocations = healthcareLocations.filter(location => {
      if (filter === 'all') return true;
      return location.type === filter;
    });

    filteredLocations.forEach(location => {
      const marker = L.marker([location.position.lat, location.position.lng], {
        icon: location.type === 'hospital' ? hospitalIcon : bloodBankIcon
      })
        .addTo(map)
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

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, filter]);

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

      <div id="map" style={containerStyle}></div>
    </div>
  );
}

export default Map;