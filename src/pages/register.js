import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";
// import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RegisterPage() {
  // const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    // TODO: Implement actual registration logic here
    // if (successful) router.push('/dashboard'); // or /auth to login
    // else showError();
    alert("Registration functionality not implemented.");
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4`}>
      <div className="absolute top-6 left-6">
        <Link href="/" legacyBehavior>
          <a className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            &larr; Campus Carpool
          </a>
        </Link>
      </div>
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-10 text-gray-900 dark:text-white">
          Create Account
        </h1>
        
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/auth" legacyBehavior>
            <a className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Sign In
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
} 