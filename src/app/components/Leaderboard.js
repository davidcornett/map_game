import React, { useState, useEffect } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

function toTitleCase(str) {
  return str
    .toLowerCase()  // First, make all characters lowercase
    .split(' ')  // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first character of each word
    .join(' ');  // Join the words back into a string
}


const ChallengeResult = ({ userScore, maxArea }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { selectedChallenge } = useSelectedChallenge(); // Access the selected challenge from context

  const getLeaderboard = async () => {
    if (!selectedChallenge) return; // Ensure there is a selected challenge
    console.log(selectedChallenge)

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
      <h3>Allowed Area (sq. miles): <span className="font-semibold text-customTeal">{selectedChallenge.max_area.toLocaleString()}</span></h3>


      <div className="w-full max-w-xl mx-auto">
      <h4 className="text-center text-2xl font-bold">Top 10 Leaderboard</h4>
      <ul className="w-full max-w-xl">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <li key={index} className="flex items-center w-full mb-2">
            <div className="min-w-[100px] mr-3 text-right font-mono">{displayScore(entry.score, selectedChallenge)}</div>
            <div className="flex-grow overflow-hidden">{entry.display_name}</div>
          </li>
        ))}
      </ul>
      </div>




    </div>
  );
};

export default ChallengeResult;
