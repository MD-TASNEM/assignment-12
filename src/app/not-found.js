"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-dark mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary text-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
