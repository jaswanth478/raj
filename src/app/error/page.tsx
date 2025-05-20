'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  // Get the 'error' query parameter from the URL.
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Function to return an appropriate error message based on the error type.
  const getErrorMessage = (error: string | null) => {
    if (!error) {
      return 'An unexpected error occurred. Please try again later.'; // If no error parameter, provide a generic message.
    }
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You may not have permission to access this resource.';
      case 'Verification':
        return 'The verification process failed. Please try again.';
      default:
        return 'An unexpected authentication error occurred. Please try again.'; // Default error message for unknown errors.
    }
  };

  // Log the error for debugging purposes (optional but useful for debugging).
  console.error('AuthError:', error);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-400 mb-6">
          {getErrorMessage(error)} {/* Display the appropriate error message based on the error */}
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
          >
            Return Home
          </Link>
          <Link
            href="/auth/signin" // Link to try signing in again
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
          <p className="text-sm text-gray-500">
            If this error persists, please try clearing your browser cookies, using a different browser, or ensuring you have a stable internet connection.
          </p>
        </div>
      </div>
    </div>
  );
}
