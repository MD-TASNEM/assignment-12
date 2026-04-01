"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Care.xyz
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          <div className={`${isOpen ? "block" : "hidden"} md:block`}>
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/" className="hover:opacity-80">
                Home
              </Link>
              <Link href="/#services" className="hover:opacity-80">
                Services
              </Link>
              <Link href="/my-bookings" className="hover:opacity-80">
                My Bookings
              </Link>

              {user ? (
                <>
                  <span className="text-sm">{user.name}</span>
                  {user.role === "admin" && (
                    <Link href="/admin" className="hover:opacity-80">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-secondary px-3 py-1 rounded hover:opacity-80"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
