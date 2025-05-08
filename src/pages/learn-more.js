import Link from 'next/link';
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

export default function LearnMorePage() {
  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-50 mb-10 text-center">
            Learn More About Campus Carpool
          </h1>

          <div className="space-y-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">What is Campus Carpool?</h2>
              <p>
                Campus Carpool is a dedicated platform designed to connect students and faculty within the university community 
                for ride-sharing. Whether you need a ride to campus, back home for the weekend, or just across town, 
                our goal is to make travel more affordable, sustainable, and convenient.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">How It Benefits You</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold">Save Money:</span> Split fuel and parking costs with fellow travelers.</li>
                <li><span className="font-semibold">Reduce Environmental Impact:</span> Fewer cars on the road means less pollution and traffic.</li>
                <li><span className="font-semibold">Convenience:</span> Find rides that match your schedule and destination easily.</li>
                <li><span className="font-semibold">Build Community:</span> Connect with other students and staff during your commute.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Safety First</h2>
              <p>
                Your safety is our priority. We encourage users to verify university affiliations (where possible) and 
                communicate clearly before sharing a ride. Always arrange to meet in well-lit, public places.
                (Further safety features and guidelines would be detailed here in a full version).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Getting Started</h2>
              <p>
                Ready to join? Simply search for available rides using the 'Find a Ride' feature, or offer your own ride via the 'Add a Ride' page 
                (available after logging in). Let's make campus travel better, together!
              </p>
            </section>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/" legacyBehavior>
                <a className="btn-secondary">
                  Back to Home
                </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 