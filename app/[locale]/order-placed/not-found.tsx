import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center animate-fade-in">
        <AlertTriangle className="mx-auto text-red-500 w-16 h-16 mb-4 " />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Oops! Order Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          We couldn’t find the order you’re looking for. It might have been removed or the ID is incorrect.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}