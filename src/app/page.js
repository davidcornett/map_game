"use client";
import React, { useState } from 'react';
import Map from './components/Map';
import Instructions from "./components/Instructions";
import ModeSelection from './components/ModeSelection';

export default function Home() {
  const [mode, setMode] = useState('sandbox');

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

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
};

  return (
    <>
      <div style={containerStyle}>
          <div style={instructionsStyle}>
              <Instructions />
          </div>
          <div style={modeSelectionStyle}>
              <ModeSelection mode={mode} setMode={setMode}/>
          </div>

      </div>
      <div>
      {mode === 'sandbox' && <Map />}
      </div>
    </>
);
}
