"use client";
import React, { useState } from 'react';
import { useSelectedChallenge, useNewCountry, useMode, useRefresh } from '../SelectedChallengeContext';

const ModeSelection = () => {

    const { setSelectedChallenge } = useSelectedChallenge();
    const { newCountry, setNewCountry } = useNewCountry();
    const { mode, setMode } = useMode();
    const { refresh } = useRefresh();
    
    const buttonStyle = {
        backgroundColor: 'rgb(20, 22, 28)',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '150px', // Ensuring buttons have the same width
    };

    // Style for the currently active mode button
    const activeButtonStyle = {
        ...buttonStyle,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Adds a shadow effect for emphasis
        fontWeight: 'bold', // Makes text bold to indicate it's active
        backgroundColor: 'rgb(40, 44, 52)'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <button
                onClick={() => {
                    setMode('sandbox');
                    refresh();
                    setSelectedChallenge(null);
                    setNewCountry(null);
                }}
                style={mode === 'sandbox' ? activeButtonStyle : buttonStyle}
            >
                Sandbox Mode
            </button>
            <button
                onClick={() => {
                    refresh();
                    setMode('challenge');
                    setNewCountry(null);
                }}
                style={mode === 'challenge' ? activeButtonStyle : buttonStyle}
            >
                Challenge Mode
            </button>
        </div>
    );
}

export default ModeSelection;
