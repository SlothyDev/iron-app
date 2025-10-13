import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

// Settings Provicer allowing users to set imperial or metric
export const SettingsProvider = ({ children }) => {
  const [units, setUnits] = useState('imperial'); 

  return (
    <SettingsContext.Provider value={{ units, setUnits }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};