import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'; 

const CountryInfo = ({ newCountryStats }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">New Country Demographics</h2>
            Total Population: <span className="font-normal">{newCountryStats.total_population.toLocaleString()}</span>

            <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
            <div className="p-4 flex justify-between items-center">
                <div>
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Total Population: {newCountryStats.total_population.toLocaleString()}</div>
                </div>
            </div>
            </div>
            
            <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
            <div className="p-4 flex justify-between items-center">
                <div>
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Ethnic Breakdown</div>
                </div>
                <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-full bg-gray-500 hover:bg-gray-300 transition duration-150"
                aria-expanded={isOpen} // ARIA attribute for accessibility
                >
                {isOpen ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/>}
                </button>
            </div>
            {isOpen && (
                    <div className="p-4 text-gray-600">
                        <div>Black Population: {Math.round(newCountryStats.pop_black * 100)}%</div>
                        <div>White Population: {Math.round(newCountryStats.pop_white * 100)}%</div>
                        <div>Hispanic Population: {Math.round(newCountryStats.pop_hispanic * 100)}%</div>
                        <div>Asian Population: {Math.round(newCountryStats.pop_asian * 100)}%</div>
                        <div>Native American Population: {Math.round(newCountryStats.pop_native * 100)}%</div>
                        <div>Pacific Islander Population: {Math.round(newCountryStats.pop_pac_isl * 100)}%</div>
                        <div>Two+ Races Population: {Math.round(newCountryStats.pop_two_plus * 100)}%</div>
                    </div>
            )}
            </div>
        </div>



      );




    /*
    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">New Country Demographics</h3>
            <div>
                <div className="text-gray-700 font-medium mb-2">Total Population: <span className="font-normal">{newCountryStats.total_population.toLocaleString()}</span></div>
                <div className="p-4 flex justify-between items-center">

                <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">


                    <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Population Ethnic Breakdown</div>
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-2 rounded-full bg-gray-500 hover:bg-gray-300 transition duration-150">
                            {isOpen ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/>}
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="mt-2 text-gray-600 space-y-1">
                        <div>Black Population: {Math.round(newCountryStats.pop_black * 100)}%</div>
                        <div>White Population: {Math.round(newCountryStats.pop_white * 100)}%</div>
                        <div>Hispanic Population: {Math.round(newCountryStats.pop_hispanic * 100)}%</div>
                        <div>Asian Population: {Math.round(newCountryStats.pop_asian * 100)}%</div>
                        <div>Native American Population: {Math.round(newCountryStats.pop_native * 100)}%</div>
                        <div>Pacific Islander Population: {Math.round(newCountryStats.pop_pac_isl * 100)}%</div>
                        <div>Two+ Races Population: {Math.round(newCountryStats.pop_two_plus * 100)}%</div>
                    </div>
                )}
            </div>
        </div>
    );
    */
};

export default CountryInfo;
