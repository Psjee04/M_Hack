import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LearnMore() {
  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <div className="container mx-auto px-6 md:px-8 py-28 pt-52 md:pt-60 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight">
            Learn More About Campus Carpool
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Campus Carpool is revolutionizing the way students travel around campus. Our platform connects drivers and passengers, making transportation more efficient, cost-effective, and environmentally friendly.
            </p>

            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Why Choose Campus Carpool?</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">Convenient scheduling that fits your academic timetable</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">Cost-effective transportation with shared expenses</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">Verified student community for safe travel</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">Reduced carbon footprint for a greener campus</span>
              </li>
            </ul>

            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">How to Get Started</h2>
            <ol className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span className="text-gray-600 dark:text-gray-300">Create your student profile with your university email</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span className="text-gray-600 dark:text-gray-300">Browse available rides or post your own</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span className="text-gray-600 dark:text-gray-300">Connect with fellow students and start carpooling</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 