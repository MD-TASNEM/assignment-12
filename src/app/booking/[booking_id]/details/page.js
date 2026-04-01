"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [params.booking_id]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings?id=${params.booking_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      } else {
        router.push("/my-bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Booking not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-primary font-semibold hover:underline"
        >
          ← Back to Bookings
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-primary">
            Booking Details
          </h1>

          {/* Status Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`p-4 rounded border-l-4 ${getStatusColor(booking.status)}`}
            >
              <p className="text-sm text-gray-600 mb-1">Booking Status</p>
              <p className="font-bold text-lg">{booking.status}</p>
            </div>
            <div
              className={`p-4 rounded border-l-4 ${getPaymentStatusColor(
                booking.paymentStatus,
              )}`}
            >
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <p className="font-bold text-lg">{booking.paymentStatus}</p>
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Booking Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-semibold">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold">{booking.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{booking.duration} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Rate</p>
                <p className="font-semibold">৳{booking.serviceCharge}/hour</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date & Time</p>
                <p className="font-semibold">
                  {new Date(booking.startDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date & Time</p>
                <p className="font-semibold">
                  {booking.endDate
                    ? new Date(booking.endDate).toLocaleString()
                    : "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Service Location
            </h2>

            <div className="bg-gray-50 p-4 rounded">
              <p className="mb-2">
                <span className="text-gray-600 text-sm">Address:</span>
                <br />
                <span className="font-semibold">
                  {booking.location?.address}
                </span>
              </p>
              <p className="mb-2">
                <span className="text-gray-600 text-sm">Area:</span>
                <br />
                <span className="font-semibold">{booking.location?.area}</span>
              </p>
              <p className="mb-2">
                <span className="text-gray-600 text-sm">City:</span>
                <br />
                <span className="font-semibold">{booking.location?.city}</span>
              </p>
              <p className="mb-2">
                <span className="text-gray-600 text-sm">District:</span>
                <br />
                <span className="font-semibold">
                  {booking.location?.district}
                </span>
              </p>
              <p>
                <span className="text-gray-600 text-sm">Division:</span>
                <br />
                <span className="font-semibold">
                  {booking.location?.division}
                </span>
              </p>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="mb-8 bg-primary text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Cost Breakdown</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{booking.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Rate per hour:</span>
                <span>৳{booking.serviceCharge}</span>
              </div>
              <hr className="my-3 border-primary-light" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>৳{booking.totalCost}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Timeline</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary mb-2"></div>
                  <div className="w-1 h-8 bg-gray-300"></div>
                </div>
                <div>
                  <p className="font-semibold text-primary">Booking Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {booking.status !== "Pending" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        booking.status !== "Pending"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      } mb-2`}
                    ></div>
                    {booking.status === "Completed" && (
                      <div className="w-1 h-8 bg-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Status: {booking.status}</p>
                    <p className="text-sm text-gray-600">
                      {booking.status === "Confirmed"
                        ? "Service confirmed and scheduled"
                        : booking.status === "Completed"
                          ? "Service completed"
                          : "Booking cancelled"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={() => router.push("/my-bookings")}
              className="btn btn-outline flex-1"
            >
              Back to Bookings
            </button>

            {booking.paymentStatus === "Unpaid" &&
              booking.status === "Pending" && (
                <button
                  onClick={() => router.push(`/payment/${booking._id}`)}
                  className="btn btn-primary flex-1"
                >
                  Complete Payment
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
