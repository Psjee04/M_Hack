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

export default function NextPage() {
  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
      <Navbar />
      <div className="container mx-auto px-6 md:px-8 py-28 pt-52 md:pt-60 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight">
            Next Step
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            This is the next page after posting a ride. You can add more content here.
          </p>
        </div>
      </div>
    </div>
  );
} 