import React, { createContext, useContext, useState } from 'react';

const RideContext = createContext(undefined);

export function RideProvider({ children }) {
  const [rides, setRides] = useState([]); // Initialize with an empty array of rides

  const addRide = (newRide) => {
    // Add a unique ID to the ride for key purposes if not present
    const rideWithId = { ...newRide, id: newRide.id || Date.now() + Math.random().toString(36) };
    setRides((prevRides) => [...prevRides, rideWithId]);
    console.log("Ride added:", rideWithId);
    console.log("All rides:", [...rides, rideWithId]);
  };

  return (
    <RideContext.Provider value={{ rides, addRide }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRides() {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
} 