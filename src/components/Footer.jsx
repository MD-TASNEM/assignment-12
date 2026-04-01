"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Care.xyz</h3>
            <p className="text-gray-400">
              Trusted care services for your family members.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/?category=baby-care" className="hover:text-white">
                  Baby Care
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=elderly-service"
                  className="hover:text-white"
                >
                  Elderly Service
                </Link>
              </li>
              <li>
                <Link href="/?category=sick-care" className="hover:text-white">
                  Sick Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/#about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400">
              Email: info@care-xyz.com
              <br />
              Phone: +880-1-XXX-XXX-XXX
            </p>
          </div>
        </div>

        <hr className="border-gray-700 mb-4" />
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Care.xyz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
