"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectedInfo from './SelectedInfo';
import CountryInfo from './CountryInfo';
import EconomicInfo from './EconomicInfo';
import ChallengeResult from './ChallengeResult';
import { useSelectedChallenge } from '../SelectedChallengeContext';


const countrySizes = {
  small: {
    maxSize: 25000, // Example max size for a small country in square miles
    description: "Up to 25,000 square miles",
    image: "/netherlands-green.svg",
    name: "The Netherlands (small)"
  },
  medium: {
    maxSize: 100000,
    description: "Up to 100,000 square miles",
    image: "/vietnam-green.svg",
    name: "Vietnam (medium)"
  },
  large: {
    maxSize: 350000,
    description: "Up to 350,000 square miles",
    image: "/nigeria-green.svg",
    name: "Nigeria (large)"
  }
};

const Map = ({ mode } ) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedCounties, setSelectedCounties] = useState(new Set());
  const [newCountry, setNewCountry] = useState(0);
  const [selectedSize, setSelectedSize] = useState('small');
  const [maxArea, setMaxArea] = useState(countrySizes.small.maxSize); // square miles

  // states for selected info indicator
  const [currentCounty, setCurrentCounty] = useState(null);
  const [area, setArea] = useState(0);

  // states for country size and adjacency validation
  const [validationMessages, setValidationMessages] = useState([]);

  // state for new country stats
  const [countryStats, setCountryStats] = useState({});

  const { selectedChallenge, setSelectedChallenge } = useSelectedChallenge();


  useEffect(() => {
    fetch('/counties.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => console.error('Error loading the GeoJSON data:', error));
  }, []);

  const fetchArea = async (countyId) => {
    const url = `http://127.0.0.1:6205/get_area/${countyId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data; // Assuming this returns the area directly
    } catch (error) {
      console.error('Error fetching area data:', error);
      return 0; // Return 0 in case of error
    }
  };

  const toggleCountySelection = async (countyId) => {
    const area = await fetchArea(countyId);

    setSelectedCounties(prevSelected => {
      const newSelected = new Set(prevSelected);
      let newTotalArea = area;

      // DESELECT if already selected - subtract area, clear formatting, remove from array, and decrement counter
      if (newSelected.has(countyId)) {
        //setArea(5);
        setArea(prevArea => prevArea - newTotalArea);
        newSelected.delete(countyId);
      
      // SELECT if not selected yet - add area, apply special formatting, add to array, and increment counter
      } else {
        //setArea(25);
        setArea(prevArea => prevArea + newTotalArea);
        newSelected.add(countyId);
      }

      // Clear validation messages whenever a county is clicked
      setValidationMessages([]);

      return newSelected;
    });
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        setCurrentCounty(feature.properties.NAME); // display the name in the info indicator
        e.target.setStyle({
          weight: 2
        });
      },
      mouseout: (e) => {
        setCurrentCounty(null); // clear the name in the info indicator
        e.target.setStyle({
          weight: 0.5
        });
      },

      click: () => {
        const countyId = feature.properties.GEOID;
        toggleCountySelection(countyId);
        layer.setStyle(getStyle(feature, selectedCounties.has(countyId)));
      },
    });
  };

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

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    setMaxArea(countrySizes[size].maxSize);
  };

  const handleBuildClick = () => {
    const messages = [];
  
    // Check for area size
    if (area > maxArea) {
      messages.push(`The selected area exceeds the maximum allowed size of ${maxArea} square miles.`);
    }
  
    // Future validation checks can add more messages here...
    setValidationMessages(messages);
  
    // If there are no issues, proceed with the action
    if (messages.length === 0) {
      //console.log(Array.from(selectedCounties));
      getCountry(Array.from(selectedCounties));
    }
  };

  const getCountry = async (selectedCountyIds) => {
    try {
      const url = `http://127.0.0.1:6205/get_new_country`;
      const body = JSON.stringify({ 
        selected_county_ids: selectedCountyIds,
        maxArea: maxArea
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });
      if (!response.ok) {
        // If the server response is not OK, attempt to read the error message
        const errorData = await response.json(); // Assume the server sends back an object with an "error" key
        console.log(errorData);
        throw new Error(errorData.error || 'Unknown error occurred'); // Use the server's error message or a default one
      }
      
      const data = await response.json();
      setGeoJsonData(data.geojson); 
      setCountryStats(data.stats);
      setNewCountry(1);

    } catch (error) {
      console.error('Error:', error.message);
    
      // Update the validationMessages state with the new error message
      setValidationMessages([error.message]);
    }
  };
  
  const sizeButtonStyle = (size) => ({
    backgroundColor: selectedSize === size ? 'rgb(40, 44, 52)' : 'rgb(20, 22, 28)',
    color: 'white',
    padding: '1em 1.2em',
    border: 'none',
    borderRadius: '0.5em',
    fontSize: '1em',
    cursor: 'pointer',
    margin: '0.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'auto',
    maxWidth: '100%',
  });
  
  const sizeTextStyle = {
    marginRight: 'auto',
    textAlign: 'left', // Ensure text aligns to the left, useful if the button width grows
  };
  
  const sizeImageStyle = {
    width: '3em',
    height: 'auto',
    marginLeft: '1em',
  };
  
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1em',
  };
  

  return (
    <div>
      <div style={buttonContainerStyle}>
        {Object.entries(countrySizes).map(([size, { description, image, name }]) => (
          <button key={size} onClick={() => handleSizeSelection(size)} style={sizeButtonStyle(size)}>
            <div style={sizeTextStyle}>
              <h4 style={{margin: 0}}>{name}</h4>
              <p style={{margin: 0, fontSize: 12}}>{description}</p> 
            </div>
            <img src={image} alt={`${name} map`} style={sizeImageStyle} />
          </button>
        ))}
      </div>
    {!newCountry && (
    <MapContainer center={[37.8, -96.9]} zoom={4} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={(feature) => getStyle(feature,  selectedCounties.has(feature.properties.GEOID))}
          onEachFeature={onEachFeature}
        />
      )}
      <SelectedInfo selectedCounty={currentCounty} selectedCount={selectedCounties.size} totalArea={area} maxArea={maxArea} />
    </MapContainer>
    )}

{
  newCountry && (
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
        {mode === 'challenge' ? (
         <ChallengeResult newCountryStats={countryStats} maxArea={maxArea} /> // Render ChallengeResult in challenge mode
        ) : (
          <>
            <CountryInfo newCountryStats={countryStats} />
            <EconomicInfo newCountryStats={countryStats} />
          </>
        )}
    </MapContainer>
  )
}

    <div style={{ 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Centers the children horizontally in the container
  marginTop: '10px',
}}>
  <button
    onClick={handleBuildClick}
    style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
    }}
  >
    BUILD COUNTRY
  </button>
  {validationMessages.length > 0 && (
    <div style={{
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#ffdddd',
      border: '1px solid #ffcccc',
      borderRadius: '5px',
      color: '#D8000C',
      fontSize: '14px',
      width: 'auto',
      maxWidth: '400px', // Ensures the box doesn't grow too wide while still allowing it to be centered
      display: 'flex', // This ensures that the content inside the div can also be aligned according to the flexbox rules
      flexDirection: 'column', // Stacks the validation messages vertically
      alignItems: 'center', // Centers the validation messages horizontally within the div
    }}>
      {validationMessages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  )}

</div>

    </div>

    
  );
};

export default Map;

