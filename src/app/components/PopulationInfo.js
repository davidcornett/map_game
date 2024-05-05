import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'; 

const PopulationInfo = ({ newCountryStats }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="max-w-lg mx-auto my-8 p-6 bg-customVeryDark rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Demographics</h2>

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
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">Demographic Breakdown</div>
                </div>
                <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-full bg-gray-500 hover:bg-gray-300 transition duration-150"
                aria-expanded={isOpen} // ARIA attribute for accessibility
                >
                {isOpen ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/>}
                </button>
            </div>

            {/* Show racial percentages in descending order */}
            {isOpen && (
                <div className="p-4 text-gray-600">
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Racial Group</th>
                                <th className="px-4 py-2">Population %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries({
                                'Black': newCountryStats.pop_black,
                                'White (non-Hispanic)': newCountryStats.pop_white,
                                'Hispanic (any race)': newCountryStats.pop_hispanic,
                                'Asian': newCountryStats.pop_asian,
                                'Native American': newCountryStats.pop_native,
                                'Pacific Islander': newCountryStats.pop_pac_isl,
                                'Two+ Races': newCountryStats.pop_two_plus
                            })
                            .map(([group, percentage]) => ({ group, percentage: Math.round(percentage * 100) }))
                            .sort((a, b) => b.percentage - a.percentage) // Sorting in descending order
                            .map(({ group, percentage }) => (
                                <tr key={group}>
                                    <td>{group}</td>
                                    <td className="pl-8">{percentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    </div>

    );
};

export default PopulationInfo;
