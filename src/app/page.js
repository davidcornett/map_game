"use client";
import React, { useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import Map from './components/Map';
import Instructions from "./components/Instructions";
import ModeSelection from './components/ModeSelection';
import Footer from './components/Footer';
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

const baseURL = process.env.NEXT_PUBLIC_BORDER_CANVAS_BASE_URL;

const LogoText = () => (
  <div className="flex flex-col items-center font-raleway">
    <div className="text-white">Border</div>
    <div className="w-5/6 border-t-2 border-dashed my-0.25"></div>
    <div className="text-[#8fdaff] font-bold">Canvas</div>
  </div>
);


function Home() {
  const { newCountry, setNewCountry } = useNewCountry();

  // pre-warm Neon DB
  useEffect(() => {
    const url = `${baseURL}/wake_neon`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.error('Warm-up request failed:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Warm-up request error:', error);
      });
  }, []); // run once on mount

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
        <div className={`w-full md:w-1/3 lg:w-1/4 ${newCountry ? 'flex flex-row justify-between items-center space-x-8' : 'flex flex-col items-center space-y-4'}`}>          
          <div className={`flex ${newCountry ? 'flex-row items-center space-x-4' : 'justify-center text-5xl items-center'}`}>
            {!newCountry && (
            <>
              <LogoText />
              <Image 
                src="/logo3.png" 
                alt="Logo"
                width={150} 
                height={150} 
              />
            </>
            )}

            {newCountry && (
              <div className="text-5xl">
                <LogoText />
              </div>
            )}
          </div>
          
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

      {/* Footer Component */}
      <Footer />

    </>
);
}
