import React from 'react';

function formatGDP(gdp) {

    // helper removes trailing 0s after decimal point and formats number
    function format(value, divisor, suffix) {


        const number = value / divisor;
        // Check if the number is an integer
        if (number % 1 === 0) {
            return `${number} ${suffix}`;
        } else {
            // If not, format to 1 decimal place
            return `${number.toFixed(1)}${suffix}`;
        }
    }

    if (gdp >= 1e12) {
        return format(gdp, 1e12, "T");
    } else if (gdp >= 1e9) {
        return format(gdp, 1e9, "B");
    } else if (gdp >= 1e6) {
        return format(gdp, 1e6, "M");
    } else if (gdp >= 1e3) {
        return format(gdp, 1e3, "K");
    } else {
        return `${gdp}`;
    }
}



const EconomicInfo = ({ newCountryStats }) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '340px', // Adjust this value based on your layout needs
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
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                New Country Economics
            </div>
            <div style={{ fontSize: '12px' }}>
                <div>
                    GDP: <span style={{ fontWeight: 'normal' }}>${formatGDP(newCountryStats.gdp) || 'N/A'}</span>
                </div>
                <div>
                    Per Capita Income: <span style={{ fontWeight: 'normal' }}>${newCountryStats.perCapIncome.toLocaleString() || 'N/A'}</span>
                </div>
                <div>
                    Unemployment Rate: <span style={{ fontWeight: 'normal' }}>{newCountryStats.unemploymentRate || 'N/A'}%</span>
                </div>
            </div>
        </div>
    );
}

export default EconomicInfo;
