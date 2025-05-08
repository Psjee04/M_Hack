import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';
import { useRides } from '../contexts/RideContext';
import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Data for states and universities (can be moved to a shared file later)
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

export default function AddRidePage() {
  const { addRide } = useRides();
  const router = useRouter();

  const [selectedState, setSelectedState] = useState("");
  const [universitiesInState, setUniversitiesInState] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [formKey, setFormKey] = useState(Date.now()); // To reset the form

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rideDetails = {
      origin: formData.get('origin'),
      destination: formData.get('destination'),
      state: selectedState,
      university: selectedUniversity,
      date: formData.get('date'),
      time: formData.get('time'),
      price: formData.get('price'),
      seats: formData.get('seats'),
      // Add driver name from auth context if available, or a placeholder
      driver: 'Guest Driver', // Placeholder
    };
    addRide(rideDetails);
    alert('Ride added successfully!');
    // router.push('/search-ride'); // Removed auto-redirect
    // Reset form fields after successful submission
    event.target.reset();
    setSelectedState("");
    setSelectedUniversity("");
    setFormKey(Date.now()); // Change key to force re-render of form with fresh state if needed
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-50 mb-12 text-center">
            Offer a Ride
          </h1>
          <form key={formKey} onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                <input type="text" name="origin" id="origin" required className="input-field" placeholder="e.g., My Apartment Name" />
              </div>
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specific Destination within University/Area</label>
                <input type="text" name="destination" id="destination" required className="input-field" placeholder="e.g., Main Library, Block C"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select id="state" name="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required className="input-field">
                  <option value="">Select State</option>
                  {malaysianStates.map(state => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University / Main Area</label>
                <select id="university" name="university" value={selectedUniversity} onChange={(e) => setSelectedUniversity(e.target.value)} disabled={!selectedState || universitiesInState.length === 0} required className="input-field disabled:bg-gray-200 dark:disabled:bg-gray-700/50">
                  <option value="">{selectedState ? "Select University" : "Select state first"}</option>
                  {universitiesInState.map(uni => (<option key={uni.name} value={uni.name}>{uni.name}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" name="date" id="date" required className="input-field" />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input type="time" name="time" id="time" required className="input-field" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (RM)</label>
                <input type="number" name="price" id="price" min="0" step="0.50" required className="input-field" placeholder="e.g., 5.00"/>
              </div>
            </div>
            
            <div className="mb-8">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Seats</label>
                <input type="number" name="seats" id="seats" min="1" max="10" required className="input-field" placeholder="e.g., 3"/>
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-base">Add My Ride</button>
          </form>
        </div>
      </main>
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