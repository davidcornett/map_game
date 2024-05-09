import React, { useState, useEffect } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';
import { formatGDP } from './EconomicInfo'; // Import the formatGDP function from EconomicInfo.js

function toTitleCase(str) {
  // return phrase in title case
  return str
    .toLowerCase()  // make all characters lowercase
    .split(' ')  // split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // capitalize 1st char of each word
    .join(' ');  // join words back into string
}

const ChallengeResult = ({ userScore, maxArea }) => {
  const { selectedChallenge } = useSelectedChallenge(); // Access the selected challenge from context

  // Dynamic metric display based on selectedChallenge
  const metricDisplay = toTitleCase(selectedChallenge?.criteria?.criteria_type.toUpperCase() || 'SCORE');

  function displayScore(score) {
    // Check if the challenge is a GDP challenge
    if (selectedChallenge.criteria.criteria_type === 'gdp') {
      // Format the score as GDP
      return formatGDP(score);
    } else {
      // For other types of scores, return as is or format differently
      return score.toLocaleString(); // Basic formatting to include commas in large numbers
    }
  }
  

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      backgroundColor: '#f9f9f9',
      color: '#333',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.1)',
      fontSize: '14px',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      zIndex: 1000,
      width: '250px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    }}>
      <h4 className='text-2xl font-bold text-customTeal'>Challenge Results</h4>
      <h3>{metricDisplay} Score: <span className="font-semibold text-customTeal">{userScore.toLocaleString()}</span></h3>
      <h3>Challenge: <span className="font-semibold text-customTeal">{selectedChallenge.name}</span></h3>
      <h3>Allowed Area (sq. miles): <span className="font-semibold text-customTeal">{maxArea.toLocaleString()}</span></h3> 
    </div>
  );
};

export default ChallengeResult;
