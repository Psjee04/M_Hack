import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';
import { useRides } from '../contexts/RideContext'; // Import useRides
import { useRouter } from 'next/router'; // Import useRouter

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Data for states and universities (subset for example)
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

export default function SearchRidePage() {
  const { rides } = useRides(); // Get rides from context
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const router = useRouter(); // Initialize router

  const [selectedState, setSelectedState] = useState("");
  const [universitiesInState, setUniversitiesInState] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  useEffect(() => {
    if (selectedState) {
      setUniversitiesInState(
        allUniversities.filter(uni => uni.state === selectedState)
      );
      setSelectedUniversity("");
    } else {
      setUniversitiesInState([]);
    }
  }, [selectedState]);

  // Effect to set initial filtered rides to all rides if not search performed yet
  useEffect(() => {
    if (!searchPerformed) {
      setFilteredRides(rides); 
    }
  }, [rides, searchPerformed]);

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = {
      destination: event.target.destination.value?.toLowerCase(),
      date: event.target.date.value,
      priceRange: event.target.priceRange.value,
      state: selectedState,
      university: selectedUniversity,
      timeOfDay: event.target.timeOfDay.value,
    };

    console.log("Search Criteria:", formData);
    setSearchPerformed(true);

    const results = rides.filter(ride => {
      let match = true;
      if (formData.state && ride.state !== formData.state) match = false;
      if (formData.university && ride.university !== formData.university) match = false;
      if (formData.date && ride.date !== formData.date) match = false;
      
      if (formData.destination && 
          (!ride.destination?.toLowerCase().includes(formData.destination) && 
           !ride.origin?.toLowerCase().includes(formData.destination))) { // Check both origin and destination for keyword
        match = false;
      }

      if (formData.priceRange !== 'any') {
        const price = parseFloat(ride.price);
        const [minStr, maxStr] = formData.priceRange.split('-');
        const min = parseFloat(minStr);
        const max = maxStr ? parseFloat(maxStr) : null;

        if (max !== null) { 
          if (price < min || price > max) match = false;
        } else { 
          if (price < min) match = false;
        }
      }
      
      // Basic time of day matching (can be made more precise)
      if (formData.timeOfDay !== 'any' && ride.time) {
        const rideHour = parseInt(ride.time.split(':')[0]);
        if (formData.timeOfDay === 'morning' && (rideHour < 6 || rideHour >= 12)) match = false;
        if (formData.timeOfDay === 'afternoon' && (rideHour < 12 || rideHour >= 17)) match = false;
        if (formData.timeOfDay === 'evening' && (rideHour < 17 || rideHour >= 21)) match = false;
        if (formData.timeOfDay === 'night' && !((rideHour >= 21 && rideHour <=23) || (rideHour >=0 && rideHour < 6))) match = false;
      }
      return match;
    });
    setFilteredRides(results);
  };
  
  const handleChatRedirect = (rideId) => {
    router.push(`/chat/${rideId}`);
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-50 mb-12 text-center">
            Find Your Ride
          </h1>
          <form onSubmit={handleSearch} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keyword (Origin/Destination)
                </label>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Library, Engineering Faculty, Town"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input type="date" name="date" id="date" className="input-field" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Location & Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select id="state" name="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="input-field">
                  <option value="">All States</option>
                  {malaysianStates.map(state => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                <select id="university" name="university" value={selectedUniversity} onChange={(e) => setSelectedUniversity(e.target.value)} disabled={!selectedState || universitiesInState.length === 0} className="input-field disabled:bg-gray-200 dark:disabled:bg-gray-700/50">
                  <option value="">{selectedState ? "All Universities in State" : "Select state first"}</option>
                  {universitiesInState.map(uni => (<option key={uni.name} value={uni.name}>{uni.name}</option>))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select id="priceRange" name="priceRange" className="input-field">
                  <option value="any">Any</option>
                  <option value="0-5">RM0 - RM5</option>
                  <option value="5-10">RM5 - RM10</option>
                  <option value="10-20">RM10 - RM20</option>
                  <option value="20+">RM20+</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time of Day</label>
                <select id="timeOfDay" name="timeOfDay" className="input-field">
                  <option value="any">Any</option>
                  <option value="morning">Morning (6am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-9pm)</option>
                  <option value="night">Night (9pm-6am)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-3 text-base">Search Rides</button>
          </form>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">Available Rides</h2>
            {searchPerformed && filteredRides.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No rides found matching your criteria.</p>
            )}
            {!searchPerformed && rides.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No rides posted yet. Be the first to <Link href="/add-ride" legacyBehavior><a className="text-blue-600 hover:underline">add one</a></Link> or try a search!</p>
            )}
            <div className="space-y-4">
              {filteredRides.map(ride => (
                <div key={ride.id} className="bg-white dark:bg-gray-700/70 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">From: {ride.origin}</h3>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">To: {ride.destination} ({ride.university})</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">State: {ride.state}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Date: {ride.date} at {ride.time}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Driver: {ride.driver} | Seats Available: {ride.seats}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">RM{parseFloat(ride.price).toFixed(2)}</p>
                    <button onClick={() => handleChatRedirect(ride.id)} className="btn-secondary py-2 px-4 text-sm">Chat with Driver</button>
                  </div>
                </div>
              ))}
               {/* Display all rides if no search performed yet and rides exist (optional initial view) */}
              {!searchPerformed && rides.length > 0 && filteredRides.length === 0 && (
                rides.map(ride => (
                    <div key={ride.id} className="bg-white dark:bg-gray-700/70 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">From: {ride.origin}</h3>
                        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">To: {ride.destination} ({ride.university})</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">State: {ride.state}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Date: {ride.date} at {ride.time}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Driver: {ride.driver} | Seats Available: {ride.seats}</p>
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">RM{parseFloat(ride.price).toFixed(2)}</p>
                            <button onClick={() => handleChatRedirect(ride.id)} className="btn-secondary py-2 px-4 text-sm">Chat with Driver</button>
                        </div>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Re-use local JSX styles if input-field class is needed from AddRidePage, or define globally */}
      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          margin-top: 0.25rem;
          padding: 0.75rem 1rem;
          border: 1px solid #D1D5DB; /* Tailwind gray-300 */
          border-radius: 0.375rem; /* Tailwind rounded-md */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Tailwind shadow-sm */
        }
        .dark .input-field {
          background-color: #374151; /* Tailwind gray-700 */
          border-color: #4B5563; /* Tailwind gray-600 */
          color: #F3F4F6; /* Tailwind gray-100 */
        }
        .input-field:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3B82F6; /* Tailwind blue-500 */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Tailwind ring-blue-500 with opacity */
        }
      `}</style>
    </div>
  );
} 