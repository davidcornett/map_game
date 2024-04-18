"use client";
import React, { useState } from 'react';
import Map from './components/Map';
import Instructions from "./components/Instructions";
import ModeSelection from './components/ModeSelection';
import Challenges from './components/Challenges'; 
import { SelectedChallengeProvider, useSelectedChallenge, NewCountryProvider, useNewCountry } from './SelectedChallengeContext';

export default function setChallengeContext() {
  return (
    <SelectedChallengeProvider>
      <NewCountryProvider>
      <Home />
      </NewCountryProvider>
    </SelectedChallengeProvider>
  );
}

function Home() {
  const { selectedChallenge } = useSelectedChallenge(); 
  const [mode, setMode] = useState('sandbox');
  const { newCountry, setNewCountry } = useNewCountry();

  const sandboxStyle = {
    backgroundColor: '#f0f0f0',
  };

  const challengeStyle = {
    backgroundColor: '#d0e0f0',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // This will place child components on opposite ends of the container
    alignItems: 'flex-start', // Aligns items at the start of the cross axis
    flexWrap: 'wrap', // Allows items to wrap as needed for smaller screens
    padding: '20px', // Adds some padding around the entire container

  };

  // Style for the Instructions card to control its width and margin
  const instructionsStyle = {
      maxWidth: '60%', // Limits the width of the instructions card to 60% of the container
      flex: '1 1 auto', // Allows the card to grow and shrink but respects the maxWidth
      margin: '10px', // Adds some space around the card
  };

  // Style for the ModeSelection component to control its width
  const modeSelectionStyle = {
      maxWidth: '35%', // Limits the width to 35% of the container
      flex: '1 1 auto', // Allows the component to grow and shrink but respects the maxWidth
      margin: '10px', // Adds some space around the buttons
  };


  return (
    <>
      <div style={containerStyle}>
        { !newCountry && (
          <div style={instructionsStyle}>
          <Instructions />
          </div>
        )}
          <div style={modeSelectionStyle}>
              <ModeSelection mode={mode} setMode={setMode}/>
          </div>

      </div>
      <div> 
      <Map mode={mode} />
      </div>
    </>
);
}
