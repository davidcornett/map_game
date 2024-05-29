import React, { useEffect, useState } from 'react';
import { useSelectedChallenge } from '../SelectedChallengeContext';

const baseURL = process.env.NEXT_PUBLIC_BORDER_CANVAS_BASE_URL;

const Challenges = ({ maxArea }) => {
    const [challenges, setChallenges] = useState([]);
    const { selectedChallenge, setSelectedChallenge, requiredPopulation, setRequiredPopulation } = useSelectedChallenge();

    useEffect(() => {
        const fetchChallenges = async () => {
        try {
            const response = await fetch(`${baseURL}/challenges`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setChallenges(data);
        } catch (error) {
            console.error("Could not fetch challenges:", error);
        }
        };

        fetchChallenges();
    }, []);

    const handleSelectChallenge = (challenge) => {
        setSelectedChallenge(challenge);
        if (challenge.criteria.min_pop) {
            setRequiredPopulation(challenge.criteria.min_pop);
        }
    };

    // Function to determine image based on challenge criteria
    const getImageSrcForChallenge = (criteriaType) => {
        switch (criteriaType) {
        case 'gdp':
            return '/coins.svg';
        case 'population':
            return '/city.svg'; 
        case 'per_capita_income':
            return '/mansion.svg';
        default:
            return null; // No image for unmatched criteria
        }
    };

    // Button style based on whether the challenge is selected
    const buttonStyle = (challengeName) => ({
        backgroundColor: selectedChallenge && selectedChallenge.name === challengeName ? 'rgb(60, 66, 72)' : 'rgb(40, 44, 52)',
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
            <h2 className="text-4xl text-white" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>Select a Challenge</h2>
            <div style={buttonContainerStyle}>
            {challenges.map((challenge) => (
                    <button
                        key={challenge.name}
                        style={buttonStyle(challenge.name)}
                        onClick={() => handleSelectChallenge(challenge)}
                    >
                        <div style={textStyle}>
                            <span>{challenge.name}</span>

                            {/* other challenge criteria if applicable */}
                            <div>

                                {challenge.criteria.min_pop && (
                                    <p style={{margin: 0, fontSize: 12}}> Min. Population: {challenge.criteria.min_pop.toLocaleString()}</p>
                                )}
                            </div>
                        </div>



                        {getImageSrcForChallenge(challenge.criteria.criteria_type) && (
                            <img
                                src={getImageSrcForChallenge(challenge.criteria.criteria_type)}
                                alt={challenge.name}
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
