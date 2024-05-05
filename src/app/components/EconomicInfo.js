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
        return format(gdp, 1e12, " Trillion");
    } else if (gdp >= 1e9) {
        return format(gdp, 1e9, " Billion");
    } else if (gdp >= 1e6) {
        return format(gdp, 1e6, " Million");
    } else if (gdp >= 1e3) {
        return format(gdp, 1e3, " Thousand");
    } else {
        return `${gdp}`;
    }
}



const EconomicInfo = ({ newCountryStats }) => {
    return (

        <div className="max-w-lg mx-auto my-8 p-6 bg-customVeryDark rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Economics</h2>

            <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
                <div className="p-4 flex justify-between items-center">
                    <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">GDP: ${formatGDP(newCountryStats.gdp) || 'N/A'}</div>
                </div>
            </div>


            <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
                <div className="p-4 flex justify-between items-center">
                    <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Per Capita Income: ${newCountryStats.perCapIncome.toLocaleString() || 'N/A'}</div>
                </div>
            </div>

            <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
                <div className="p-4 flex justify-between items-center">
                    <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Unemployment Rate: {newCountryStats.unemploymentRate || 'N/A'}%</div>
                </div>
            </div>
        </div>
    );
}


export { formatGDP };
export default EconomicInfo;
