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
    const [geoJsonParkData, setGeoJsonParkData] = useState(null);
    const [showParks, setShowParks] = useState(false);
    const [selectedCounties, setSelectedCounties] = useState(new Set());
    const [area, setArea] = useState(0);
    const [countryName, setCountryName] = useState('');

    const refresh = () => {
        setGeoJsonData(null);
        setGeoJsonParkData(null);
        setShowParks(false);
        setSelectedCounties(new Set());
        setArea(0);
        setCountryName('');
        fetchCountyGeoJsonData();
        fetchParkGeoJsonData();
    };

    const fetchCountyGeoJsonData = async () => {
        try {
            const response = await fetch('/counties.geojson');
            const data = await response.json();
            setGeoJsonData(data);
        } catch (error) {
            console.error('Error loading the county GeoJSON data:', error);
        }
    };
    
    
    const fetchParkGeoJsonData = async () => {
        if (!geoJsonParkData) {  // Fetch only if park data is not already loaded
            console.log("loading nps data");
            try {
                const response = await fetch('/nps_boundary.geojson');
                const data = await response.json();
                const filteredData = {
                    ...data,
                    features: data.features.filter(feature =>
                        feature.properties.UNIT_TYPE === 'National Park' || feature.properties.UNIT_TYPE === 'National Monument'
                    )
                };
                setGeoJsonParkData(filteredData);
            } catch (error) {
                console.error('Error loading the park GeoJSON data:', error);
            }
        }
    };


    return (
        <RefreshContext.Provider value={{
        geoJsonData,
        geoJsonParkData,
        setGeoJsonData,
        selectedCounties,
        setSelectedCounties,
        area,
        setArea,
        refresh,
        fetchParkGeoJsonData,
        fetchCountyGeoJsonData,
        showParks,
        setShowParks,
        countryName,
        setCountryName
        }}>
        {children}
        </RefreshContext.Provider>
    );
    };