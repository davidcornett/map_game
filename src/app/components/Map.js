"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectedInfo from './SelectedInfo';
import CountryInfo from './CountryInfo';
import EconomicInfo from './EconomicInfo';
import ChallengeResult from './ChallengeResult';
import Challenges from './Challenges'; 
import { useSelectedChallenge, useNewCountry, useMode, useRefresh } from '../SelectedChallengeContext';
import NationalParksList from './NationalParksList';
import CountryShape from './CountryShape';

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

const Map = () => {
  const { refresh, fetchGeoJsonData, geoJsonData, setGeoJsonData, selectedCounties, setSelectedCounties, area, setArea } = useRefresh();

  //const [geoJsonData, setGeoJsonData] = useState(null);
  //const [selectedCounties, setSelectedCounties] = useState(new Set());
  const { newCountry, setNewCountry } = useNewCountry();
  const [selectedSize, setSelectedSize] = useState('small');
  const [maxArea, setMaxArea] = useState(countrySizes.small.maxSize); // square miles
  const [countryName, setCountryName] = useState('');
  const [inputCountryValue, setInputCountryValue] = useState('');

  const { mode } = useMode();

  // states for selected info indicator
  const [currentCounty, setCurrentCounty] = useState(null);
  //const [area, setArea] = useState(0);

  // states for country size and adjacency validation
  const [validationMessages, setValidationMessages] = useState([]);

  // state for new country stats
  const [countryStats, setCountryStats] = useState({});

  const { selectedChallenge, setSelectedChallenge } = useSelectedChallenge();
  const [displayName, setDisplayName] = useState('');
  const [userScore, setUserScore] = useState(null);

  const [nationalParks, setNationalParks] = useState([]);


  useEffect(() => {
    // Prepare for new data when mode changes or on component mount.
    refresh();
  
    // Fetch GeoJSON and national park data.
    fetchGeoJsonData();
  
  }, [mode]); // Depend on 'mode', triggers on mode change and component mount.

  const fetchNationalParkData = async (selectedCountyIds) => {
    const url = `http://127.0.0.1:6205/get_national_parks`;
    const body = JSON.stringify({ selected_county_ids: selectedCountyIds });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      const result = await response.json();
      if (response.ok) {
        setNationalParks(result.data);
        if (result.data.length === 0) {
          console.log(result.message); // Logs "No matching national parks found" or other server messages
        }
      } else {
        throw new Error(result.message || 'Failed to load national parks');
      }
    } catch (error) {
      console.error('Error fetching national park data:', error);
    }
  };


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

    // Handle empty country case
    if (selectedCounties.size === 0) {
      messages.push('Please select at least one county to build your country.');
    }
  

    // Future validation checks can add more messages here...
    setValidationMessages(messages);
  
    // If there are no issues, proceed with the action
    if (messages.length === 0) {
      setCountryName(inputCountryValue); 
      setInputCountryValue('');
      getCountry(Array.from(selectedCounties));
      fetchNationalParkData(Array.from(selectedCounties));
    }
  };

  // Handler for input changes
  const handleInputCountryChange = (event) => {
    setInputCountryValue(event.target.value);
  };

  const getCountry = async (selectedCountyIds) => {
    const statKey = getStatKeyForCriteria(selectedChallenge?.criteria?.criteria_type);

    try {
      const url = `http://127.0.0.1:6205/get_new_country`;
      const body = JSON.stringify({ 
        selected_county_ids: selectedCountyIds,
        maxArea: maxArea,
        displayName: displayName.trim() || generateRandomName(),
        challenge: selectedChallenge,
        statKey: statKey
      });
      console.log(statKey);

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
      
      //const score = data.stats?.[statKey] || 'N/A'; // Update the user's score based on the new country's stats
      setUserScore(data.stats.challengeScore);
      setNewCountry(1);

    } catch (error) {
      console.error('Error:', error.message);
    
      // Update the validationMessages state with the new error message
      setValidationMessages([error.message]);
    }
  };
  
  const sizeButtonStyle = (size) => ({
    backgroundColor: selectedSize === size ? 'rgb(60, 66, 72)' : 'rgb(40, 44, 52)',
    //backgroundColor: selectedSize === size ? 'rgb(40, 44, 52)' : 'rgb(20, 22, 28)',
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

  const outerContainerStyle = {
    backgroundColor: 'rgb(20, 22, 28)',
    borderRadius: '10px', // Rounded edges for the container
    padding: '20px', // Padding inside the container, around the heading and buttons
    margin: '20px auto', // Margin for top, bottom, and auto on the sides for center alignment
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    display: 'flex',
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Center-align children
    gap: '1em', // Space between children
    width: '80%', // Adjust width as necessary
    maxWidth: '100%', // Ensure the container does not exceed the width of its parent
  };

  // Style for the ModeSelection component to control its width
  const modeSelectionStyle = {
    maxWidth: '35%', // Limits the width to 35% of the container
    flex: '1 1 auto', // Allows the component to grow and shrink but respects the maxWidth
    margin: '10px', // Adds some space around the buttons

  };

  
  // returns the key in the CountryStats object for the selected challenge's criteria
  const getStatKeyForCriteria = (criteriaType) => {
    const criteriaToStatKeyMap = {
      population: 'total_population',
      perCapIncome: 'perCapIncome',
      unemploymentRate: 'unemploymentRate',
      gdp: 'gdp',
      // todo - add more as needed
    };
  
    return criteriaToStatKeyMap[criteriaType] || null;
  };
  
  // Function to generate a random display name (simplified example)
  const generateRandomName = () => `User_${Math.floor(Math.random() * 1000)}`;

  return (
    

    // COUNTRY SIZE SELECTION ----------------------------------------------
    <div>

      {!newCountry &&  (
      <div style={outerContainerStyle}>
        <h2 className="text-4xl" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>Choose Country Size </h2>

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
      </div>
    )}

    {/* CHALLENGE MODE SELECTION (if applicable) ------------------------------------------------*/}
    {mode === 'challenge' && !newCountry && <Challenges maxArea={maxArea} />}


    {/* MAP DISPLAY -----------------------------------------------------------------------------*/}
    {!newCountry && ( mode === 'sandbox' || selectedChallenge) && (
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

{/* COUNTRY SHAPE IMAGE -------------------------------------------------------------------------*/}
{
newCountry && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:col-span-1 p-4 text-center"> {/* Added text-center for horizontal alignment */}
      <div className="flex flex-col justify-center items-center " style={{ height: '100%' }}> {/* This div centers the content vertically */}
        <h2 className="text-3xl font-semibold text-white mb-4">{countryName || 'New Country'}</h2>
        <CountryShape geojsonData={geoJsonData} width={500} height={400} />
      </div>
    </div>

{/* MAP DISPLAY - showing new country -------------------------------------------------------------*/}
    <div className="md:col-span-2 p-4">
      <MapContainer center={[37.8, -96.9]} zoom={4} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={(feature) => getStyle(feature, selectedCounties.has(feature.properties.GEOID))}
          />
        )}

{/* CHALLENGE RESULT & LEADERBOARD (if challenge) ------------------------------------------------ */}
{/* ECONOMIC INFO (if sandbox) ------------------------------------------------------------------- */}
        {mode === 'challenge' ? (
          <ChallengeResult userScore={userScore} maxArea={maxArea}/> // Render ChallengeResult in challenge mode
        ) : (
          <EconomicInfo newCountryStats={countryStats} />
        )}
      </MapContainer>
    </div>
    </div>
  )
}


<div style={{ 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Centers the children horizontally in the container
  marginTop: '10px',
}}>

  {/* DISPLAY NAME INPUT FOR LEADERBOARD ----------------------------------------------------------------------*/}
    {selectedChallenge && (
      <input
        type="text"
        placeholder="Enter name for leaderboard (optional)"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        style={{
          width: '50%', // Make input take the full width of its parent container
          padding: '10px', // Add some padding for visual comfort
          margin: '10px 0', // Add some margin above and below the input
          color: 'black', // Ensure text color is visible against the input's background
          backgroundColor: 'white', // A light background color for the input
          border: '1px solid #ccc', // A subtle border
          borderRadius: '4px', // Slightly rounded corners
        }}
      />
      )}

  {/* NEW COUNTRY NAME AND SUBMIT BUTTON ----------------------------------------------------------------------*/}
  { (mode === 'sandbox' || selectedChallenge) && !newCountry && (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between', // Adjust this as needed for alignment
      alignItems: 'center', // Aligns items vertically in the center
      padding: '10px 0', // Add some vertical padding
    }}>
      <input
        type="text"
        placeholder="Enter country name"
        value={inputCountryValue}
        onChange={handleInputCountryChange}
        style={{
          flexGrow: 1, // Allows the input to take up the remaining space
          marginRight: '10px', // Adds a right margin to separate from the button
          padding: '10px', // Pads the input for better touch interaction
          border: '1px solid #ccc', // Gives the input a subtle border
          borderRadius: '5px', // Rounds the corners of the input
          color: 'black', // Ensures the text color is visible against the input's background
        }}
      />
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
    </div>
  )}

  {/* VALIDATION MESSAGES ----------------------------------------------------------------------*/}
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

{/* COUNTRY INFO AND NATIONAL PARKS LIST -------------------------------------------------------------*/}
{ newCountry && mode === 'sandbox' && (
  <div className="flex flex-col sm:flex-row justify-around items-start p-4">

    <CountryInfo newCountryStats={countryStats} />
    {nationalParks && (
      <NationalParksList parks={nationalParks}  />
    )}    
  </div>
)}

</div>
  );
};

export default Map;

