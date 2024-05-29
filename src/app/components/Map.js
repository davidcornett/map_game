"use client";
import React, { useState, useEffect } from 'react';
//import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectedInfo from './SelectedInfo';
import PopulationInfo from './PopulationInfo';
import EconomicInfo from './EconomicInfo';
import ChallengeResult from './ChallengeResult';
import Challenges from './Challenges'; 
import { useSelectedChallenge, useNewCountry, useMode, useRefresh } from '../SelectedChallengeContext';
import NationalParksList from './NationalParksList';
import CountryShape from './CountryShape';
import Leaderboard from './Leaderboard';
import dynamic from 'next/dynamic';

// dynamic imports to prevent window is not defined error
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((mod) => mod.GeoJSON), { ssr: false });

const baseURL = process.env.NEXT_PUBLIC_BORDER_CANVAS_BASE_URL;

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
  const { refresh, geoJsonData, geoJsonParkData, setGeoJsonData, selectedCounties, setSelectedCounties, area, setArea, population, setPopulation, showParks, setShowParks, countryName, setCountryName } = useRefresh();

  const { newCountry, setNewCountry } = useNewCountry();
  const [selectedSize, setSelectedSize] = useState('small');
  const [maxArea, setMaxArea] = useState(countrySizes.small.maxSize); // square miles
  const { mode } = useMode(); // challenge or sandbox

  // states for selected info indicator
  const [currentCounty, setCurrentCounty] = useState(null);
  const [currentCountyID, setCurrentCountyID] = useState(null);
  const [currentPark, setCurrentPark] = useState(null);

  // states for country size and adjacency validation
  const [validationMessages, setValidationMessages] = useState([]);
  const [sizeWarning, setSizeWarning] = useState(false);

  // states for new country stats
  const [countryStats, setCountryStats] = useState({});
  const { selectedChallenge, requiredPopulation } = useSelectedChallenge();
  const [displayName, setDisplayName] = useState('');
  const [userScore, setUserScore] = useState(null);

  // states for nps
  const [nationalParks, setNationalParks] = useState('');


  useEffect(() => {
    // Prepare for new data when mode changes or on component mount
    refresh();
    setValidationMessages([]); // Clear any previous validation messages
  
  }, [mode, selectedChallenge]);

  const fetchNationalParkData = async (selectedCountyIds) => {
    const url = `${baseURL}/get_national_parks`;
    const body = JSON.stringify({ selected_county_ids: selectedCountyIds });
    setNationalParks(''); // Clear any previous national park data

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      const result = await response.json();
      if (response.ok) {        
        if (result.data.length === 0) {
          console.log(result.message); // Logs "No matching national parks found" or other server messages
        }
        else {
          // returned at least 1 NP
          setNationalParks(result.data);
        }
      } else {
        throw new Error(result.message || 'Failed to load national parks');
      }
    } catch (error) {
      console.error('Error fetching national park data:', error);
    }
  };

  const toggleShowParks = () => {
    // flip true/false
    setShowParks(prev => !prev);
  };

  const fetchArea = async (countyId) => {
    const url = `${baseURL}/get_area/${countyId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data; // Assuming this returns the area directly
    } catch (error) {
      console.error('Error fetching area data:', error);
      return 0; // Return 0 in case of error
    }
  };

  const fetchPopulation = async (countyId) => {
    const url = `${baseURL}/get_pop/${countyId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      return data; // Assuming this returns the population directly
    } catch (error) {
      console.error('Error fetching population data:', error);
      return 0; // Return 0 in case of error
    }
  };

  // Display current stats in the info indicator
  useEffect(() => {
    const updateMetrics = async () => {
      if (currentCountyID === null) return;
  
      const area = await fetchArea(currentCountyID);
      setArea((prevArea) => {
        if (selectedCounties.has(currentCountyID)) {
          // Newly added, increment the area
          return prevArea + area;
        } else {
          // Previously added, now removed, subtract the area
          return prevArea - area;
        }
      });
  
      // Only fetch and update population if the mode is 'challenge' and the current challenge has min_pop criteria
      if (mode === 'challenge' && selectedChallenge?.criteria?.min_pop) {
        const population = await fetchPopulation(currentCountyID);
        setPopulation((prevPopulation) => {
          if (selectedCounties.has(currentCountyID)) {
            // Newly added, increment the population
            return prevPopulation + population;
          } else {
            // Previously added, now removed, subtract the population
            return prevPopulation - population;
          }
        });
      }
    };
  
    updateMetrics();
  }, [selectedCounties]);



  /*
  // handle area updates each time selectedCounties changes
  useEffect(() => {
    const updateArea = async () => {
      if (currentCountyID === null) return;

      const area = await fetchArea(currentCountyID);
      setArea((prevArea) => {
        if (selectedCounties.has(currentCountyID)) {
          // Newly added, increment the area
          return prevArea + area;
        } else {
          // Previously added, now removed, subtract the area
          return prevArea - area;
        }
      });
    };
    updateArea();
  }, [selectedCounties]);
  */

  const toggleCountySelection = async (countyId) => {

    setSelectedCounties(prevSelected => {
      const newSelected = new Set(prevSelected);

      // DESELECT if already selected - subtract area, clear formatting, remove from array, and decrement counter
      if (newSelected.has(countyId)) {
        newSelected.delete(countyId);
      
      // SELECT if not selected yet - add area, apply special formatting, add to array, and increment counter
      } else {
        newSelected.add(countyId);
      }

      // Clear validation messages whenever a county is clicked
      setValidationMessages([]);

      return newSelected;
    });
  };

  const onEachCountyFeature = (feature, layer) => {
    layer.on({
      mouseover: () => {
        setCurrentCounty(feature.properties.NAME); // display the name in the info indicator
        setCurrentCountyID(feature.properties.GEOID);
      },
      mouseout: () => {
        setCurrentCounty(null); // clear the name in the info indicator
        setCurrentCountyID(null);
      },

      click: () => {
        const countyId = feature.properties.GEOID;
        toggleCountySelection(countyId);
        layer.setStyle(getStyle(feature, selectedCounties.has(countyId)));
      },
    });
  };

  const onEachParkFeature = (feature, layer) => {

    layer.on({
      mouseover: (e) => {
        // concatenate the park name and type for display (e.g., ["Yellowstone"] + ["National Park"])
        setCurrentPark(`${feature.properties.UNIT_NAME} ${feature.properties.UNIT_TYPE}`); // display the park name in the info indicator
        e.target.setStyle({
          weight: 2
        });
      },
      mouseout: (e) => {
        setCurrentPark(null); // clear the name in the info indicator
        e.target.setStyle({
          weight: 0.5
        });
      }
    });
  };

  const getStyle = (feature, isSelected = false) => {
    // Define the default style for the GeoJSON features

    const isHovered = currentCountyID === feature.properties.GEOID;
    return {
      fillColor: isSelected ? 'green' : 'white',
      weight: isHovered? 2 : 0.5,
      opacity: .5,
      color: 'black', // Border color
      fillOpacity: 0.4
    };
  };

  const handleSizeSelection = (size) => {
    if (size === 'large' || size === 'medium') {
      setSizeWarning(true);
    } else {
      setSizeWarning(false);
    }
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
      getCountry(Array.from(selectedCounties));

      // only fetch nps data in sandbox mode
      if (mode === 'sandbox'){
        fetchNationalParkData(Array.from(selectedCounties));
      }

      setCountryName(''); 
      setDisplayName('');
    }
  };

  const getCountry = async (selectedCountyIds) => {
    const statKey = getStatKeyForCriteria(selectedChallenge?.criteria?.criteria_type);

    try {
      const url = `${baseURL}/get_new_country`;
      const body = JSON.stringify({ 
        selected_county_ids: selectedCountyIds,
        maxArea: maxArea,
        displayName: displayName.trim() || generateRandomName(),
        countryName: countryName.trim() || 'New Country',
        challenge: selectedChallenge,
        statKey: statKey
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

      // set states
      setGeoJsonData(data.geojson); 
      setCountryStats(data.stats);
      setCountryName(data.stats.name); // reset this from back end
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

  const baseContainerStyle = {
    backgroundColor: 'rgb(20, 22, 28)',
    borderRadius: '10px', // Rounded edges for the container
    padding: '20px', // Padding inside the container, around the heading and buttons
    margin: '20px auto', // Margin for top, bottom, and auto on the sides for center alignment
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    display: 'flex',
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Center-align children
    gap: '1em', // Space between children
  }

  const outerContainerStyle = {
    ...baseContainerStyle,
    width: '80%',
    maxWidth: '100%', // Ensure the container does not exceed the width of its parent
  };

  const landCoverDivStyle = {
    ...baseContainerStyle,
    width: '100%',
    maxWidth: '100%', // Ensure the container does not exceed the width of its parent
  };

  // STYLE FOR THE INPUT FIELD AND SUBMIT BUTTON ---------------------------------------------------
  const submitContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Maintain space-between to align the button and input properly.
    alignItems: 'center',
    padding: '10px', // Increased overall padding inside the container
    backgroundColor: 'rgb(20, 22, 28)',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // subtle shadow for depth
    margin: '20px auto', // Centered horizontally
    maxWidth: mode === 'sandbox' ? '600px' : '900px', // Appropriate maximum width
  };
  
  // Style for the input field
  const inputStyle = {
    flexGrow: 1,
    marginRight: '10px',
    padding: '10px',
    backgroundColor: 'rgb(60, 66, 72)',
    color: 'white',
  };
  
  // Style for the submit button, keeping it similar to your size selection buttons
  const submitButtonStyle = {
    backgroundColor: 'rgb(40, 44, 52)',
    fontWeight: 'bold',
    color: '#8fdaff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer', // Cursor pointer to indicate it's clickable
    transition: 'background-color 0.3s', // Smooth transition for hover effects
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const parksButtonStyle = {
    position: 'absolute',
    top: '20px',
    left: '75px',
    zIndex: 1000, // Ensure it's above the map layers
    backgroundColor: '#C56C39',
    border: '1px solid #ccc',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    color: 'white',
    fontSize: '16px',
    display: 'flex', // Aligns items horizontally
    alignItems: 'center', // Vertically centers items in the button
    justifyContent: 'center' // Centers the content inside the button
  };

  // returns the key in the CountryStats object for the selected challenge's criteria
  const getStatKeyForCriteria = (criteriaType) => {
    const criteriaToStatKeyMap = {
      population: 'total_population',
      per_capita_income: 'per_capita_income',
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
        <h2 className="text-4xl text-white" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>Choose Country Size </h2>

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
        {sizeWarning && (
          <span className="text-customBlue mb-2 text-center">
            Warning: Creating larger countries can take several seconds to load.
          </span>
        )}

      </div>
    )}

    {/* CHALLENGE MODE SELECTION (if applicable) ------------------------------------------------*/}
    {mode === 'challenge' && !newCountry && <Challenges maxArea={maxArea} />}

    {/* NEW COUNTRY NAME AND SUBMIT BUTTON -----------------------------------------------------*/}
      { (mode === 'sandbox' || selectedChallenge) && !newCountry && (
        <div style={submitContainerStyle}>
          <input
            type="text"
            placeholder="Enter country name (optional)"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            style={inputStyle}
          />
      
        {/* DISPLAY NAME INPUT FOR LEADERBOARD (if applicable) --------------------------------------*/}
        {selectedChallenge && (
        <input
          type="text"
          placeholder="Enter name for leaderboard (optional)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={inputStyle}
        />
        )}

        {/* SUBMIT BUTTON ------------------------------------------------------------------------*/}
        <button
          onClick={handleBuildClick}
          style={submitButtonStyle}
          onMouseOver={e => e.target.style.backgroundColor = 'rgb(60, 66, 72)'} // lighter teal
          onMouseOut={e => e.target.style.backgroundColor = 'rgb(40, 44, 52)'} // Back to original on mouse out
        >
          Click to Create Country
        </button>
      </div>
    )}

    {/* VALIDATION MESSAGES ----------------------------------------------------------------------*/}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      {/* Validation messages */}
      {validationMessages.length > 0 && (
      <div style={{
        padding: '10px',
        backgroundColor: '#ffdddd',
        border: '1px solid #ffcccc',
        borderRadius: '5px',
        color: '#D8000C',
        maxWidth: '400px',
        textAlign: 'center' // Center-aligns the text inside the div
      }}>
          {validationMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      )}
    </div>


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
          onEachFeature={onEachCountyFeature}
        />
      )}
      {geoJsonParkData && showParks && !selectedChallenge && (
        <GeoJSON
          data={geoJsonParkData}
          //style={() => ({ color: 'darkgreen', weight: 2, fillColor: '#33a02c', fillOpacity: 0.5 })}
          style={() => ({ color: 'darkgreen', weight: 2, fillColor: '#C56C39', fillOpacity: 0.5 })}
          onEachFeature={onEachParkFeature}
        />
      )}

      {/* Display mouseover info and selected counties--------------------------------------------*/}
      <SelectedInfo selectedCounty={currentCounty} selectedCount={selectedCounties.size} totalArea={area} maxArea={maxArea} totalPop={population} requiredPop={requiredPopulation} showParks={showParks} selectedPark={currentPark}/>

      {/* Show National Parks button (sandbox only)-----------------------------------------------*/}
      {mode === 'sandbox' && (
      <button onClick={toggleShowParks} style={parksButtonStyle}>
      {showParks ? 'Hide National Parks' : 'Show National Parks'}
        <img src="/nps.svg" alt="Park" style={{ marginLeft: '8px', width: '16px', height: '16px' }} />
      </button>
      )}

    </MapContainer>
    )}

{/* COUNTRY SHAPE IMAGE -------------------------------------------------------------------------*/}
{
newCountry && (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:col-span-1 p-4 text-center"> {/* Added text-center for horizontal alignment */}
      <div className="flex flex-col justify-start items-center " style={{ height: '100%' }}> {/* This div centers the content vertically */}
      {mode === 'sandbox' && (
        <>
        <h2 className="text-3xl font-semibold text-white mb-4">{countryName || 'New Country'}</h2>
        <CountryShape geojsonData={geoJsonData} width={500} height={400} />
        <div style={landCoverDivStyle}>
          <h2 className="text-2xl font-bold text-white">Land Types</h2>

          {/* LAND COVER stats --------------------------------------------------------------------*/}
          <div className="flex flex-wrap justify-center gap-2 mt-4">

          {/* FOREST */}
          {countryStats.landCover.hasOwnProperty('Forest') && (
          <div className="p-2 bg-gray-800 text-white rounded shadow flex items-center">
            <img src="/lc_forest.svg" alt="Forest" className="w-12 h-12 mr-2" />
            <div className="text-sm">
              <span className="block">Forest</span>
              <span className="block font-bold">{Math.round(countryStats.landCover.Forest).toLocaleString()} sq. miles</span>
            </div>
          </div>
          )}
          
          {/* AGRICULTURAL */}
          {countryStats.landCover.hasOwnProperty('Agriculture') && (
          <div className="p-2 bg-gray-800 text-white rounded shadow flex items-center">
            <img src="/lc_agriculture.svg" alt="Agriculture" className="w-12 h-12 mr-2" />
            <div className="text-sm">
              <span>Agriculture</span>
              <span className="block font-bold">{Math.round(countryStats.landCover.Agriculture).toLocaleString()} sq. miles</span>
            </div>
          </div>
          )}

          {/* DEVELOPED */}
          {countryStats.landCover.hasOwnProperty('Developed') && (
          <div className="p-2 bg-gray-800 text-white rounded shadow flex items-center">
            <img src="lc_developed.svg" alt="Developed" className="w-12 h-12 mr-2" />
            <div className="text-sm">
              <span className="block">Developed</span>
              <span className="block font-bold">{Math.round(countryStats.landCover.Developed).toLocaleString()} sq. miles</span>
            </div>
          </div>
          )}
        </div>
        
        </div>

        {/* NATIONAL PARKS LIST -----------------------------------------------------------------*/}
        {nationalParks && (
          <NationalParksList parks={nationalParks}  />
        )}

        </>
      )}
      {mode === 'challenge' && (
        <div className="p-4 md:p-6 lg:p-8">
          <Leaderboard maxArea={maxArea}/>
        </div>
        )}
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
        {mode === 'challenge' && (
          <ChallengeResult userScore={userScore} maxArea={maxArea}/> // Render ChallengeResult in challenge mode
        )}
      </MapContainer>

      {/* DEMOGRAPHIC and ECONOMIC INFO -------------------------------------------------------------*/}
      { newCountry && mode === 'sandbox' && (
        <div className="flex flex-col sm:flex-row justify-around items-start p-4">

          <PopulationInfo newCountryStats={countryStats} />
          <EconomicInfo newCountryStats={countryStats} />
          
        </div>
      )}
    </div>
   </div>
  )
}

</div>
  );
};

export default Map;

