import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';



const NationalPark = ({ park }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="max-w-md w-full mx-auto bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
      <div className="p-4 flex justify-between items-center">
        <div>
          <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{park.fullName}</div>
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
        <>
          <div className="p-4">
            <p className="text-gray-500">{park.description}</p>
          </div>
          {park.images.length > 0 && (
            <img className="w-full" src={park.images[0].url} alt={park.images[0].altText} />
          )}
        </>
      )}
    </div>
  );
};

const NationalParksList = ({ parks }) => {
  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">National Parks in Your Country</h2>
        {parks.map(park => (
          <NationalPark key={park.id} park={park} />
        ))}
    </div>
  );
};




export default NationalParksList;
