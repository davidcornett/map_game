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
      <div className="flex flex-col md:flex-row justify-between items-start p-5 space-y-4 md:space-y-0 md:space-x-4">
        {/* Instructions Conditionally Rendered */}
        {!newCountry && (
          <div style={instructionsStyle}>
            <Instructions />
          </div>
        )}

        {/* Logo and Mode Selection Container */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center space-y-4">
          
          {/* Logo */}
          {!newCountry && (
          <div className="flex justify-center">
            <Image 
              src="/logo3.png" 
              alt="Logo"
              width={200} 
              height={200} 
            />
          </div>
          )}

          {/* Mode Selection Component Always Visible */}
          <div className="w-full">
            <ModeSelection/>
          </div>
        </div>
      </div>

      {/* Map Component */}
      <div> 
        <Map/>
      </div>
    </>
);
}
