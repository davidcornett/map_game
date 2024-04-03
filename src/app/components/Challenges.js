import React, { useEffect, useState } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

const Challenges = ({ maxArea }) => {
    const [challenges, setChallenges] = useState([]);
    const { selectedChallenge, setSelectedChallenge } = useSelectedChallenge();

    useEffect(() => {
        const fetchChallenges = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:6205/challenges`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Fetched challenges:", data);
            setChallenges(data);
        } catch (error) {
            console.error("Could not fetch challenges:", error);
        }
        };

        fetchChallenges();
    }, []);

    const handleSelectChallenge = (challengesGroup) => {
        const matchingChallenge = challengesGroup.find(challenge => challenge.max_area === maxArea);
        console.log(challengesGroup)
        if (matchingChallenge) {
            console.log("match")
            // If a matching challenge is found, set it as the selected challenge
            setSelectedChallenge(matchingChallenge);
          } else {
            // Optionally handle the case where no challenge matches the selectedMaxArea
            console.error("No challenge found for the selected area size.");
            // This might involve setting an error state, displaying a message to the user, etc.
          }
    };

    // Function to determine image based on challenge criteria
    const getImageSrcForChallenge = (criteriaType) => {
        switch (criteriaType) {
        case 'gdp':
            return '/coins.svg';
        case 'population':
            return '/city.svg'; // Replace with your actual SVG file for population
        default:
            return null; // No image for unmatched criteria
        }
    };

    // Button style based on whether the challenge is selected
    const buttonStyle = (challengeName) => ({
        backgroundColor: selectedChallenge && selectedChallenge.name === challengeName ? 'rgb(60, 66, 72)' : 'rgb(40, 44, 52)',
        //backgroundColor: selectedChallenge && selectedChallenge.challenge_id === challenge.challenge_id ? 'rgb(40, 44, 52)' : '#05386B',

        color: 'white',
        padding: '1em 1.2em',
        border: 'none',
        borderRadius: '0.5em',
        fontSize: '1em',
        cursor: 'pointer',
        margin: '0.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        maxWidth: '100%',
      });
    
    const textStyle = {
    marginRight: 'auto',
    textAlign: 'left',
    };

    const imageStyle = {
    width: '3em',
    height: 'auto',
    marginLeft: '1em',
    };


    const outerContainerStyle = {
        backgroundColor: 'rgb(20, 22, 28)',
        //backgroundColor: '#333',
        //backgroundColor: '#5CDB95', // Less dark background color
        //backgroundColor: '#05386B',
        //backgroundColor: '#659DBD',
        borderRadius: '10px', // Rounded edges for the container
        padding: '20px', // Padding inside the container, around the heading and buttons
        margin: '20px auto', // Margin for top, bottom, and auto on the sides for center alignment
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center-align children
        gap: '1em', // Space between children
        width: '80%', // Adjust width as necessary
        maxWidth: '100%', // Ensure the container does not exceed the width of its parent
      };

    const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow buttons to wrap
    gap: '1em', // Space between buttons
    width: '100%', // Take the full width of the outer container
    };

    const groupedChallenges = challenges.reduce((acc, challenge) => {
        // Initialize the array for the challenge name if it doesn't already exist
        if (!acc[challenge.name]) {
            acc[challenge.name] = [];
        }
        // Add the challenge to its respective group
        acc[challenge.name].push(challenge);
        return acc;
    }, {});

    return (
        <div style={outerContainerStyle}>
            <h2 className="text-4xl" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>Select a Challenge</h2>
            <div style={buttonContainerStyle}>
                {Object.entries(groupedChallenges).map(([name, challengesGroup]) => (
                    <button
                        key={name}
                        style={buttonStyle(name)} // Apply styling as before, using the first challenge for reference
                        onClick={() => handleSelectChallenge(challengesGroup)} // Modify to handle group selection if needed
                    >
                        <span style={textStyle}>{name}</span>
                        {getImageSrcForChallenge(challengesGroup[0].criteria.criteria_type) && (
                            <img
                                src={getImageSrcForChallenge(challengesGroup[0].criteria.criteria_type)}
                                alt={name}
                                style={imageStyle}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
    

};

export default Challenges;
