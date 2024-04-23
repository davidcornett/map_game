import React, { useState, useEffect } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

const Leaderboard = ({ userScore, maxArea }) => {
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

<div className="flex justify-center items-center p-4"> 
      <div className="w-full max-w-xl mx-auto">
      <h4 className="text-center text-2xl font-bold">Top 10 Leaderboard</h4>
      <ul className="w-full max-w-xl">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <li key={index} className="flex items-center w-full mb-2">
            <div className="min-w-[100px] mr-3 text-right font-mono">{entry.score}</div>
            <div className="flex-grow overflow-hidden">{entry.display_name}</div>
          </li>
        ))}
      </ul>
      </div>

    </div>
  );
};

export default Leaderboard;
