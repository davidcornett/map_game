import React, { useState } from 'react';


const NationalPark = ({ park }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{park.fullName}</div>
          <p className="mt-1 text-lg leading-tight font-medium text-black hover:underline">{park.name}</p>
        </div>
        <p className={`mt-2 text-gray-500 ${isOpen ? 'block' : 'line-clamp-3'}`}>{park.description}</p>
      </div>
      {isOpen && park.images.length > 0 && (
        <img className="w-full" src={park.images[0].url} alt={park.images[0].altText} />
      )}
    </div>
  );
};

const NationalParksList = ({ parks }) => {
  return (
    <div className="national-parks-list">
      {parks.map(park => (
        <NationalPark key={park.id} park={park} />
      ))}
    </div>
  );
};

export default NationalParksList;
