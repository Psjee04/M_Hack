'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Data for states and universities (from test2 template, duplicated for now)
const malaysianStates = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Malacca", "Negeri Sembilan", 
  "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu"
];

const allUniversities = [
  { name: "Universiti Teknologi Malaysia (UTM)", state: "Johor" },
  { name: "Universiti Tun Hussein Onn Malaysia (UTHM)", state: "Johor" },
  { name: "Universiti Utara Malaysia (UUM)", state: "Kedah" },
  { name: "AIMST University", state: "Kedah" },
  { name: "Universiti Malaysia Kelantan (UMK)", state: "Kelantan" },
  { name: "Universiti Malaya (UM)", state: "Kuala Lumpur" },
  { name: "Universiti Pertahanan Nasional Malaysia (UPNM)", state: "Kuala Lumpur" },
  { name: "Asia Pacific University of Technology & Innovation (APU)", state: "Kuala Lumpur" },
  { name: "Universiti Teknikal Malaysia Melaka (UTeM)", state: "Malacca" },
  { name: "Multimedia University (MMU) - Melaka", state: "Malacca" },
  { name: "Universiti Sains Islam Malaysia (USIM)", state: "Negeri Sembilan" },
  { name: "INTI International University", state: "Negeri Sembilan" },
  { name: "Universiti Malaysia Pahang (UMP)", state: "Pahang" },
  { name: "Universiti Sains Malaysia (USM)", state: "Penang" },
  { name: "Wawasan Open University (WOU)", state: "Penang" },
  { name: "Universiti Pendidikan Sultan Idris (UPSI)", state: "Perak" },
  { name: "Universiti Teknologi Petronas (UTP)", state: "Perak" },
  { name: "Universiti Malaysia Perlis (UniMAP)", state: "Perlis" },
  { name: "Universiti Malaysia Sabah (UMS)", state: "Sabah" },
  { name: "Universiti Malaysia Sarawak (UNIMAS)", state: "Sarawak" },
  { name: "Curtin University Malaysia", state: "Sarawak" },
  { name: "Universiti Kebangsaan Malaysia (UKM)", state: "Selangor" },
  { name: "Universiti Putra Malaysia (UPM)", state: "Selangor" },
  { name: "Universiti Teknologi MARA (UiTM) - Shah Alam", state: "Selangor" },
  { name: "Monash University Malaysia", state: "Selangor" },
  { name: "Sunway University", state: "Selangor" },
  { name: "Taylor's University", state: "Selangor" },
  { name: "Universiti Sultan Zainal Abidin (UniSZA)", state: "Terengganu" },
  { name: "Universiti Malaysia Terengganu (UMT)", state: "Terengganu" },
];

// Ride type (duplicated for now)
interface Ride {
  id: string;
  origin: string;
  destination: string;
  state: string;
  university: string;
  date: string;
  time: string;
  price: string;
  seats: string;
  driver: string;
}

export default function FindRidePage() {
  // --- State for Carpool Features ---
  // In a real app, rides would come from a global context or API
  const [rides, setRides] = useState<Ride[]>([]); 
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // State for search form
  const [searchState, setSearchState] = useState("");
  const [searchUniversitiesInState, setSearchUniversitiesInState] = useState<{name: string, state: string}[]>([]);
  const [searchUniversity, setSearchUniversity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchPriceRange, setSearchPriceRange] = useState("any");
  const [searchTimeOfDay, setSearchTimeOfDay] = useState("any");

  // --- Effects for Carpool Features ---
  useEffect(() => {
    // Populate universities based on selected state for Search form
    if (searchState) {
      setSearchUniversitiesInState(
        allUniversities.filter(uni => uni.state === searchState)
      );
      setSearchUniversity("");
    } else {
      setSearchUniversitiesInState([]);
    }
  }, [searchState]);

  useEffect(() => {
    // Initialize filtered rides or update if rides change and no search performed
    if (!searchPerformed) {
      setFilteredRides(rides); 
    }
  }, [rides, searchPerformed]);

  // --- Handlers for Carpool Features ---
  const handleRideSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Criteria:", { searchKeyword, searchDate, searchPriceRange, searchState, searchUniversity, searchTimeOfDay });
    setSearchPerformed(true);

    const results = rides.filter(ride => {
      let match = true;
      if (searchState && ride.state !== searchState) match = false;
      if (searchUniversity && ride.university !== searchUniversity) match = false;
      if (searchDate && ride.date !== searchDate) match = false;
      
      if (searchKeyword && 
          (!ride.destination?.toLowerCase().includes(searchKeyword.toLowerCase()) && 
           !ride.origin?.toLowerCase().includes(searchKeyword.toLowerCase()))) {
        match = false;
      }

      if (searchPriceRange !== 'any') {
        const price = parseFloat(ride.price);
        const [minStr, maxStr] = searchPriceRange.split('-');
        const min = parseFloat(minStr);
        const max = maxStr ? parseFloat(maxStr) : null;

        if (max !== null) { 
          if (price < min || price > max) match = false;
        } else { 
          if (price < min) match = false;
        }
      }
      
      if (searchTimeOfDay !== 'any' && ride.time) {
        const rideHour = parseInt(ride.time.split(':')[0]);
        if (searchTimeOfDay === 'morning' && (rideHour < 6 || rideHour >= 12)) match = false;
        if (searchTimeOfDay === 'afternoon' && (rideHour < 12 || rideHour >= 17)) match = false;
        if (searchTimeOfDay === 'evening' && (rideHour < 17 || rideHour >= 21)) match = false;
        if (searchTimeOfDay === 'night' && !((rideHour >= 21 && rideHour <=23) || (rideHour >=0 && rideHour < 6))) match = false;
      }
      return match;
    });
    setFilteredRides(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <section id="find-ride" className="my-16 md:my-24 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-12 text-center">
            Find a Ride
          </h1>
          <form onSubmit={handleRideSearch} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="search-keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keyword (Origin/Destination)
                </label>
                <input
                  type="text"
                  name="search-keyword"
                  id="search-keyword"
                  className="input-field-page"
                  placeholder="e.g., Library, Town"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="search-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input type="date" name="search-date" id="search-date" className="input-field-page" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="search-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select id="search-state" name="search-state" value={searchState} onChange={(e) => setSearchState(e.target.value)} className="input-field-page">
                  <option value="">All States</option>
                  {malaysianStates.map(state => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="search-university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                <select id="search-university" name="search-university" value={searchUniversity} onChange={(e) => setSearchUniversity(e.target.value)} disabled={!searchState || searchUniversitiesInState.length === 0} className="input-field-page disabled:bg-gray-200 dark:disabled:bg-gray-700/50">
                  <option value="">{searchState ? "All Universities in State" : "Select state first"}</option>
                  {searchUniversitiesInState.map(uni => (<option key={uni.name} value={uni.name}>{uni.name}</option>))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div>
                <label htmlFor="search-priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select id="search-priceRange" name="search-priceRange" className="input-field-page" value={searchPriceRange} onChange={(e) => setSearchPriceRange(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="0-5">RM0 - RM5</option>
                  <option value="5-10">RM5 - RM10</option>
                  <option value="10-20">RM10 - RM20</option>
                  <option value="20+">RM20+</option>
                </select>
              </div>
              <div>
                <label htmlFor="search-timeOfDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time of Day</label>
                <select id="search-timeOfDay" name="search-timeOfDay" className="input-field-page" value={searchTimeOfDay} onChange={(e) => setSearchTimeOfDay(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="morning">Morning (6am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-9pm)</option>
                  <option value="night">Night (9pm-6am)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600">
              Search Rides
            </button>
          </form>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">Available Rides</h3>
            {searchPerformed && filteredRides.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No rides found matching your criteria.</p>
            )}
            {!searchPerformed && rides.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No rides currently available. <Link href="/add-ride" legacyBehavior><a className="text-blue-600 hover:underline">Offer a ride</a></Link> or try a search later!</p>
            )}
            <div className="space-y-4">
              {filteredRides.map(ride => (
                <div key={ride.id} className="bg-white dark:bg-gray-700/70 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-400">From: {ride.origin}</h4>
                  <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-400">To: {ride.destination} ({ride.university})</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">State: {ride.state}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Date: {ride.date} at {ride.time}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Driver: {ride.driver} | Seats Available: {ride.seats}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">RM{parseFloat(ride.price).toFixed(2)}</p>
                    <button onClick={() => alert(`Chat with ${ride.driver} for ride ${ride.id} - (feature coming soon)`)} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400">
                        Chat with Driver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Duplicating styles for now, consider moving to globals.css */}
      <style jsx global>{`
        .input-field-page {
          display: block;
          width: 100%;
          margin-top: 0.25rem;
          padding: 0.75rem 1rem; 
          border: 1px solid #D1D5DB; 
          border-radius: 0.375rem; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
          background-color: #FFF; 
          color: #111827; 
        }
        .dark .input-field-page {
          background-color: #374151; 
          border-color: #4B5563; 
          color: #F3F4F6; 
        }
        .input-field-page:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3B82F6; 
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); 
        }
        .input-field-page.disabled\:bg-gray-200:disabled {
            background-color: #E5E7EB; 
        }
        .dark .input-field-page.dark\:disabled\:bg-gray-700\/50:disabled {
            background-color: rgba(55, 65, 81, 0.5); 
        }
      `}</style>
    </div>
  );
} 