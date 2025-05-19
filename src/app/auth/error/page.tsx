'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-400 mb-6">
          {error === 'Configuration' 
            ? 'There is a problem with the server configuration.'
            : 'An error occurred during authentication. Please try again.'}
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 