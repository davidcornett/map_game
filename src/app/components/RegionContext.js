import React, { createContext, useContext, useState } from "react";

const RegionContext = createContext();
export const useRegion = () => useContext(RegionContext);

/** region: 'US' | 'EU'
 */
export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState('US');   // default

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};