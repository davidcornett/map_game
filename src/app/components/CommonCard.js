
import React from 'react';

const CommonCard = ({ title, children }) => {
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-blue-100 rounded-xl shadow-md overflow-hidden mb-4 md:w-full lg:max-w-md">
      <div className="p-4 flex justify-between items-center">
        <div>
          <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{title}</div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CommonCard;
