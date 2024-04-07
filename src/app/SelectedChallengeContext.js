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