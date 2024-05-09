import React, { useState, useEffect } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

const Leaderboard = ({ maxArea }) => {
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
      console.log(maxArea);

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

    <div className="flex justify-center items-center text-gray-800 p-4 bg-white rounded-lg shadow-md">
        <div className="w-full max-w-xl mx-auto">
            <h4 className="text-center text-2xl font-bold">Top 10 Leaderboard</h4>
            <table className="w-full max-w-xl text-left border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2 text-right">Score</th>
                        <th className="px-4 py-2">Player</th>
                        <th className="px-4 py-2">Country</th>
                    </tr>
                </thead>
                <tbody className="divide-y-4 divide-white bg-blue-100 font-mono font-semibold">
                    {leaderboard.slice(0, 10).map((entry, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2 text-right">{entry.score.toLocaleString()}</td>
                            <td className="px-4 py-2">{entry.display_name}</td>
                            <td className="px-4 py-2">{entry.country_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

  );
};

export default Leaderboard;
