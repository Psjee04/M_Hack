import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar'; // Adjust path based on actual components folder location
import { Geist, Geist_Mono } from "next/font/google";
import { useAuth } from '../../contexts/AuthContext'; // Adjust path
import { useRides } from '../../contexts/RideContext'; // Adjust path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RideChatPage() {
  const router = useRouter();
  const { rideId } = router.query; // Get rideId from the URL query parameters
  const { isAuthenticated } = useAuth();
  const { rides } = useRides();

  // Find the specific ride details (optional, but good for context)
  const ride = rides.find(r => r.id === rideId);

  // Placeholder for chat messages state and send message function
  // const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState("");
  // const handleSendMessage = () => { /* ... */ }

  if (!isAuthenticated) {
    // Optionally, redirect to login if trying to access chat without being logged in
    // useEffect(() => { router.push('/auth'); }, [router]);
    return (
        <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
            <Navbar />
            <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
                <p className="text-center text-xl p-10">Please <Link href="/auth" legacyBehavior><a className="text-blue-600 hover:underline">login</a></Link> to chat.</p>
            </main>
        </div>
    );
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <div className="max-w-xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-50 mb-8 text-center">
            Chat for Ride ID: <span className="text-blue-600">{rideId}</span>
          </h1>
          
          {ride && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h2 className="text-lg font-semibold">Ride Details:</h2>
              <p>From: {ride.origin} To: {ride.destination} ({ride.university})</p>
              <p>Date: {ride.date} at {ride.time} | Driver: {ride.driver}</p>
            </div>
          )}

          <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 overflow-y-auto">
            {/* Placeholder for messages */}
            <p className="text-gray-500 dark:text-gray-400 text-center italic">Chat messages will appear here. (Feature not implemented)</p>
            {/* Example messages:
            <div className="mb-2 text-sm"><span className="font-semibold">User1:</span> Hello! Is this ride still available?</div>
            <div className="mb-2 text-sm text-right"><span className="font-semibold">You:</span> Yes, it is!</div> 
            */}
          </div>

          <div className="flex space-x-3">
            <input 
              type="text" 
              // value={newMessage}
              // onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-grow mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
            <button 
              // onClick={handleSendMessage}
              className="btn-primary py-3 px-6 text-base self-end"
            >
              Send
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link href="/search-ride" legacyBehavior>
              <a className="text-sm text-blue-600 hover:underline dark:text-blue-400">Back to Search Results</a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 