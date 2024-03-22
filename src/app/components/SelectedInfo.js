import React from 'react';

const SelectedInfo = ({ selectedCounty, selectedCount, totalArea }) => {
    return (
<div style={{
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#f9f9f9',
  color: '#333',
  padding: '10px', // Reduced padding
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
<div style={{ fontSize: '12px' }}>
    Current County: <span style={{ fontWeight: 'normal' }}>
    {selectedCounty ? `${selectedCounty} County` : 'None'}
</span>
</div>

<div style={{ fontSize: '12px' }}>
    Selected Counties: <span style={{ fontWeight: 'normal' }}>{selectedCount}</span>
</div>
<div style={{ fontSize: '12px' }}>
    Total Area: <span style={{ fontWeight: 'normal' }}>{totalArea} square miles</span>
</div>
</div>
);
};

  export default SelectedInfo;