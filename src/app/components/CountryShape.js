import React from 'react';
import { geoPath, geoMercator } from 'd3-geo';

const CountryShape = ({ geojsonData, width = 300, height = 200 }) => {
    const projection = geoMercator()
      .fitSize([width, height], geojsonData);
    const pathGenerator = geoPath().projection(projection);
  
    return (
        <div className="flex justify-center items-center p-4">  
            <svg 
                className="max-w-full"
                width={width} 
                height={height} 
                viewBox={`-10 -10 ${width + 20} ${height + 20}`} 
                preserveAspectRatio="xMidYMid meet" 
            >
                {geojsonData.features.map((feature, i) => (
                <path
                    key={i}
                    d={pathGenerator(feature)}
                    fill="#008080"
                    stroke="#008080"
                    strokeWidth="1"
                />
                ))}
            </svg>
        </div>
    );
  };

export default CountryShape;
