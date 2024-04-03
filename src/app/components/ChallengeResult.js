import React, { useState, useEffect } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

const ChallengeResult = ({ newCountryStats, maxArea }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { selectedChallenge } = useSelectedChallenge(); // Access the selected challenge from context

  const getLeaderboard = async () => {
    if (!selectedChallenge) return; // Ensure there is a selected challenge

    try {
      // Adjusted to use selectedChallenge from context
      const params = new URLSearchParams({
        name: selectedChallenge.name,
        maxArea: maxArea 
      });

      const response = await fetch(`http://127.0.0.1:6205/leaderboard?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Could not fetch leaderboard:", error);
    }
  };

  // Automatically refresh leaderboard when the selectedChallenge changes
  useEffect(() => {
    getLeaderboard();
  }, [selectedChallenge]); // React to changes in selectedChallenge

  // Dynamic metric display based on selectedChallenge
  const metricDisplay = selectedChallenge?.criteria?.criteria_type.toUpperCase() || 'SCORE';

  // returns the key in the newCountryStats object for the selected challenge's criteria
  const getStatKeyForCriteria = (criteriaType) => {
    const criteriaToStatKeyMap = {
      population: 'total_population',
      perCapIncome: 'perCapIncome',
      unemploymentRate: 'unemploymentRate',
      gdp: 'gdp',
      // todo - add more as needed
    };
  
    return criteriaToStatKeyMap[criteriaType] || null;
  };
  
  // get user's country metric based on challenge's metric
  const statKey = getStatKeyForCriteria(selectedChallenge?.criteria?.criteria_type);
  const userScore = newCountryStats?.[statKey] || 'N/A';

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
      {/* Display dynamic metric */}
      <h4>Player Score</h4>
      <h3>{metricDisplay}: {userScore.toLocaleString()}</h3>
      <h4>Leaderboard</h4>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.display_name}: {entry.score.toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeResult;
