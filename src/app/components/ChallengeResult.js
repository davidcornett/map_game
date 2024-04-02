import React, { useState, useEffect } from 'react';

const ChallengeResult = ({ challengeName, newCountryStats, maxArea }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  const getLeaderboard = async () => {
    try {
      const url = `http://127.0.0.1:6205/leaderboard`; // Adjust this URL as necessary
      // Assuming `maxArea` is part of `newCountryStats`

      const body = JSON.stringify({
        name: challengeName, // Use challengeName from props
        maxArea: maxArea, 
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  // Invoke getLeaderboard when component mounts or when challengeName/newCountryStats changes
  useEffect(() => {
    getLeaderboard();
  }, [challengeName, newCountryStats]); // Updated to use challengeName instead of challengeId

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
      <h3>GDP: ${newCountryStats.gdp} Billion</h3>
      <h4>Leaderboard</h4>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.display_name}: ${entry.score} Billion</li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeResult;

