"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Booking cancelled successfully");
        fetchBookings();
      } else {
        alert("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-primary">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No bookings yet</p>
          <Link href="/" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {booking.serviceId?.name || "Service"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Booking ID: {booking.bookingId}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    booking.status,
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{booking.duration} hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">
                    {booking.location?.city}, {booking.location?.district}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="font-semibold text-primary">
                    ৳{booking.totalCost}
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-sm">{booking.location?.address}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/booking/${booking._id}/details`}
                  className="btn btn-secondary flex-1 text-center"
                >
                  View Details
                </Link>

                {booking.status === "Pending" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel Booking
                  </button>
                )}

                {booking.paymentStatus === "Unpaid" &&
                  booking.status === "Pending" && (
                    <Link
                      href={`/payment/${booking._id}`}
                      className="btn btn-primary flex-1 text-center"
                    >
                      Pay Now
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
