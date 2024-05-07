import React from 'react';

const SelectedInfo = ({ selectedCounty, selectedCount, totalArea, maxArea, showParks, selectedPark }) => {
    return (
    <div style={{
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    zIndex: 1000,
    width: '250px', // Increased width
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    }}>


    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        Country-in-Progress
    </div>

    {/* Display selected park in indicator if available, otherwise selected county */}
    {showParks && (
    <div style={{ fontSize: '12px' }}>
        National Park/Monument: 
        <div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
            {selectedPark || 'None'}
            </span>
        </div>
    </div>
    )}

    <div style={{ fontSize: '12px' }}>
        Current County: <span style={{ fontWeight: 'bold' }}>
            {selectedCounty ? `${selectedCounty} County` : 'None'}
        </span>
    </div>
    

    <div style={{ fontSize: '12px' }}>
        Selected Counties: <span style={{ fontWeight: 'bold' }}>{selectedCount}</span>
    </div>
    <div style={{ fontSize: '12px' }}>
        Total Sq. Miles: <span style={{ fontWeight: 'bold', color: totalArea > maxArea ? 'red' : 'black' }}>
            {totalArea.toLocaleString()} / {maxArea.toLocaleString()}
        </span>
        {totalArea > maxArea && (
            <span style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}>
            Warning: Area exceeds limit!
            </span>
        )}
    </div>

    </div>
    );
    };

  export default SelectedInfo;