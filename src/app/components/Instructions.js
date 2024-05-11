import React, { useState, useEffect } from 'react';
import { useMode } from '../SelectedChallengeContext';

const Instructions = () => {
    const { mode } = useMode();

    const cardStyle = {
        backgroundColor: 'rgb(20, 22, 28)', // Light grey background
        padding: '20px',
        margin: '20px auto', // Centered with vertical spacing
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Slight shadow for depth
        border: '1px solid #ddd', // Subtle border
        maxWidth: '800px', // Limits card width for better readability
    };

    const headingStyle = {
        borderBottom: '2px solid #eee', // Light line for visual separation
        paddingBottom: '10px', // Space below the heading
    };

    return (
        <div> 
            <div style={cardStyle}>
            {mode === 'sandbox' && (
                <>
                <h2 className="text-5xl font-bold" style={headingStyle}>Build your country from a unique canvas - US counties.</h2>
                <ul>
                    <li>Click any county to start, and build up from there. Click a county again to deselect.</li>
                    <li>Will you focus on population size or economic strength? Natural beauty?</li>
                    <li>The counties must be contiguous. No islands allowed (yet).</li>
                </ul>
                </>
            )}

            {mode === 'challenge' && (
                <>
                <h2 className="text-5xl font-bold" style={headingStyle}>Challenge the leaderboard.</h2>
                <ul>
                    <li>Select a country size and a challenge - will you focus on population or economics?</li>
                    <li>Click any county to start, and build up from there. Click a county again to deselect.</li>
                    <li>The counties must be contiguous. No islands allowed (yet).</li>
                    <li>Submit your country and check if you made the leaderboard.</li>
                </ul>
                </>
            )}
            </div>

        </div>
    );
}

export default Instructions;
