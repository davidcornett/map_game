"use client";
import React, { useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import Map from './components/Map';
import Instructions from "./components/Instructions";
import ModeSelection from './components/ModeSelection';
import { SelectedChallengeProvider, useSelectedChallenge, NewCountryProvider, useNewCountry, ModeProvider, RefreshProvider } from './SelectedChallengeContext';

export default function setChallengeContext() {
  return (
    <SelectedChallengeProvider>
      <NewCountryProvider>
        <ModeProvider>
          <RefreshProvider>
      <Home />
          </RefreshProvider>
        </ModeProvider>
      </NewCountryProvider>
    </SelectedChallengeProvider>
  );
}

function Home() {
  const { selectedChallenge } = useSelectedChallenge(); 
  const { newCountry, setNewCountry } = useNewCountry();

  const sandboxStyle = {
    backgroundColor: '#f0f0f0',
  };

  const challengeStyle = {
    backgroundColor: '#d0e0f0',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // place child components on opposite ends of the container
    alignItems: 'center', // aligns items at  start of the cross axis
    flexWrap: 'wrap', // wrap for smaller screens
    padding: '20px', // padding around entire container

  };

  // Style for the Instructions card to control its width and margin
  const instructionsStyle = {
      maxWidth: '60%', // Limits the width of the instructions card to 60% of the container
      flex: '1 1 auto', // Allows the card to grow and shrink but respects the maxWidth
      margin: '10px', // Adds some space around the card
  };

  const logoStyle = {
    maxWidth: '30%', // Limits the width of the logo area to 30% of the container
    flex: '1 1 auto', // Allows the logo to grow and shrink but respects the maxWidth
    margin: '10px', // Adds some space around the logo
    display: 'flex', // Enables flex properties for centering the image
    justifyContent: 'center', // Centers the logo horizontally
    alignItems: 'center', // Centers the logo vertically
  };

  return (
    <>
      <div style={containerStyle}>
      
        { !newCountry && (
          <>
          <div style={instructionsStyle}>
          <Instructions />
          </div>
          <div style={logoStyle}>
            <Image 
              src="/logo3.png" // Path to the image in the public folder
              alt="Logo"
              width={200} // Set the width of the logo
              height={200} // Set the height of the logo
            />
          </div>
          </>
        )}
        <div>
          <ModeSelection/>
        </div>
        
      </div>
      
      <div> 
        <Map/>
      </div>
    </>
);
}
