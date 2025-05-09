import Navbar from '../components/Navbar';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function AboutPage() {
  return (
    <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <div className="container mx-auto px-6 md:px-8 py-28 pt-32 md:pt-40">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight">
          About Campus Carpool
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          Welcome to Campus Carpool! We are dedicated to making campus travel smarter, more affordable, and sustainable for students.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
          Our platform connects students who need rides with those who can offer them, fostering a community of shared transportation. By facilitating carpooling, we aim to reduce traffic congestion, lower transportation costs, and minimize the environmental impact of commuting.
        </p>
        {/* You can add more content here */}
      </div>
      {/* Consider adding a footer similar to the one on the homepage */}
    </div>
  );
} 