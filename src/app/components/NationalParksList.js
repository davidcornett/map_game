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
    <div className="max-w-lg mx-auto my-8 p-6 bg-customVeryDark rounded-lg shadow-md">
      <div className="flex items-center justify-center space-x-3 mb-6"> {/* Flex container for H2 and SVG */}
        <img src="/nps.svg" alt="Park Icon" className="w-6 h-6 fill-current text-white" /> {/* SVG Image from public */}
        <h2 className="text-2xl font-bold text-white">National Parks</h2>
      </div>
      {parks.map(park => (
        <NationalPark key={park.id} park={park} />
      ))}
    </div>
  );
};




export default NationalParksList;
