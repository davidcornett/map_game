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
