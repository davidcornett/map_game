"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [countyCount, setCountyCount] = useState(0);
  const [selectedCounties, setSelectedCounties] = useState(new Set());
  const [currentCounty, setCurrentCounty] = useState('');
  const [area, setArea] = useState(0);
  const maxArea = 10000; // Adjust this as necessary

  useEffect(() => {
    fetch('/counties.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => console.error('Error loading the GeoJSON data:', error));
  }, []);


  const toggleCountySelection = (countyId) => {
    setSelectedCounties(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(countyId)) {
        newSelected.delete(countyId);
      } else {
        newSelected.add(countyId);
      }
      return newSelected;
    });
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const countyId = feature.properties.GEOID;
        toggleCountySelection(countyId);
        layer.setStyle(getStyle(feature, selectedCounties.has(countyId)));
      },
    });
  };
  /*
  const onEachFeature = (feature, layer) => {
    // Define interactions for each feature here
    layer.on({
      click: () => alert(`Clicked on ${feature.properties.NAME}`), // Example interaction
    });
  };
  */


  const getStyle = (feature, isSelected = false) => {
    // Define the default style for the GeoJSON features
    return {
      fillColor: isSelected ? 'green' : 'white',
      weight: 0.5,
      opacity: .5,
      color: 'black', // Border color
      fillOpacity: 0.6
    };
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO
    console.log(Array.from(selectedCounties));
  };

  const handleCountyClick = (countyId) => {
    setSelectedCounties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(countyId)) {
        newSet.delete(countyId);
      } else {
        newSet.add(countyId);
      }
      return newSet;
    });
  };

  return (
    <MapContainer center={[37.8, -96.9]} zoom={4} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={(feature) => getStyle(feature, selectedCounties.has(feature.properties.GEOID))}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default Map;

