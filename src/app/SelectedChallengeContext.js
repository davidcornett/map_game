import React, { createContext, useContext, useState } from 'react';

const SelectedChallengeContext = createContext();
export const useSelectedChallenge = () => useContext(SelectedChallengeContext);
export const SelectedChallengeProvider = ({ children }) => {
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    return (
        <SelectedChallengeContext.Provider value={{ selectedChallenge, setSelectedChallenge }}>
            {children}
        </SelectedChallengeContext.Provider>
    );
};


// New NewCountryContext
const NewCountryContext = createContext();
export const useNewCountry = () => useContext(NewCountryContext);
export const NewCountryProvider = ({ children }) => {
    const [newCountry, setNewCountry] = useState(null);

    return (
        <NewCountryContext.Provider value={{ newCountry, setNewCountry }}>
            {children}
        </NewCountryContext.Provider>
    );
};


const ModeContext = createContext();
export const useMode = () => useContext(ModeContext);
export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState('sandbox');

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
};


const RefreshContext = createContext();
export const useRefresh = () => useContext(RefreshContext);
export const RefreshProvider = ({ children }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedCounties, setSelectedCounties] = useState(new Set());
  const [area, setArea] = useState(0);

  const refresh = ( mapChoice ) => {
    console.log("refreshing...")
    setGeoJsonData(null);
    setSelectedCounties(new Set());
    setArea(0);
    fetchGeoJsonData(mapChoice);
  };

  const fetchGeoJsonData = async ( mapChoice ) => {
    const url = mapChoice === 'nps' ? '/nps_boundary.geojson' : '/counties.geojson';
    //const url = '/counties.geojson'

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('Error loading the GeoJSON data:', error);
    }
  };

  return (
    <RefreshContext.Provider value={{
      geoJsonData,
      setGeoJsonData,
      selectedCounties,
      setSelectedCounties,
      area,
      setArea,
      refresh,
      fetchGeoJsonData
    }}>
      {children}
    </RefreshContext.Provider>
  );
};