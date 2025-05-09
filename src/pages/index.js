import Image from "next/image";
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

export default function Home() {
  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      {/* Main content wrapper for animation and refined padding */}
      <div className="container mx-auto px-6 md:px-8 py-28 pt-52 md:pt-60 animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-32 md:mb-40 max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <span className="badge badge-blue">
              University Carpool Platform
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight">
            Smart Campus <span className="text-blue-600 dark:text-blue-400">Carpooling</span> Made Simple
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Connect with fellow students, share rides, and make campus travel sustainable
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/learn-more" legacyBehavior>
              <a className="btn-secondary">
                Learn More
              </a>
            </Link>
            <Link href="/add-ride" legacyBehavior>
              <a className="btn-secondary">
                Offer a Ride
              </a>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-10 mb-32 md:mb-40">
          <div className="feature-card">
            <div className="text-blue-600 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Save Time</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Find rides that match your schedule and avoid waiting for campus shuttles</p>
          </div>
          <div className="feature-card">
            <div className="text-blue-600 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Save Money</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Split costs with fellow students and reduce your transportation expenses</p>
          </div>
          <div className="feature-card">
            <div className="text-blue-600 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Go Green</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Reduce carbon footprint and contribute to a sustainable campus environment</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-32 md:mb-40">
          <div className="inline-block mb-8">
            <span className="badge badge-purple">
              Simple Process
            </span>
          </div>
          <h2 className="section-title">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="how-it-works-step-icon-container">
                <span className="how-it-works-step-number">1</span>
              </div>
              <h3 className="how-it-works-step-title">Post a Ride</h3>
              <p className="how-it-works-step-description">Share your route and schedule</p>
            </div>
            <div className="text-center group">
              <div className="how-it-works-step-icon-container">
                <span className="how-it-works-step-number">2</span>
              </div>
              <h3 className="how-it-works-step-title">Find Rides</h3>
              <p className="how-it-works-step-description">Search for available rides</p>
            </div>
            <div className="text-center group">
              <div className="how-it-works-step-icon-container">
                <span className="how-it-works-step-number">3</span>
              </div>
              <h3 className="how-it-works-step-title">Connect</h3>
              <p className="how-it-works-step-description">Book and ride together</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-3xl p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <div className="relative z-10">
            <h2 className="section-title mb-6 text-gray-50">Ready to Start Carpooling?</h2>
            <p className="text-2xl mb-10 text-blue-100/80 max-w-2xl mx-auto leading-relaxed">Join thousands of students already saving time and money while making campus travel more sustainable</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100/70 dark:bg-slate-900/70 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="footer-title">Campus Carpool</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">Making campus travel smarter and more sustainable.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/about" legacyBehavior><a className="footer-link">About Us</a></Link></li>
                <li><a href="#" className="footer-link">How It Works</a></li>
                <li><a href="#" className="footer-link">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">FAQs</a></li>
                <li><a href="/learn-more" className="footer-link">Learn More</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 pt-10 text-center">
            <p className="text-base text-gray-600 dark:text-gray-400">© 2025 Campus Carpool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
