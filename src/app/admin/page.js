"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab) {
      fetchData();
    }
  }, [activeTab]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      let url = "/api/admin/dashboard?type=dashboard";
      if (activeTab === "bookings") {
        url = "/api/admin/dashboard?type=bookings";
      } else if (activeTab === "payments") {
        url = "/api/admin/dashboard?type=payments";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (activeTab === "dashboard") {
        setStats(data.stats);
        setBookings(data.recentBookings);
      } else if (activeTab === "bookings") {
        setBookings(data);
      } else if (activeTab === "payments") {
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "update-booking-status",
          bookingId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        alert("Booking status updated");
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "dashboard"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "bookings"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600"
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "payments"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600"
          }`}
        >
          Payments
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === "dashboard" ? (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-primary">
                {stats?.totalBookings || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Successful Payments</p>
              <p className="text-3xl font-bold text-secondary">
                {stats?.totalPayments || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-500">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-500">
                ৳{stats?.totalRevenue || 0}
              </p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Booking ID</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{booking.bookingId}</td>
                      <td className="py-2">{booking.userId?.name}</td>
                      <td className="py-2">{booking.serviceId?.name}</td>
                      <td className="py-2">৳{booking.totalCost}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === "bookings" ? (
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Booking ID</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Service</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{booking.bookingId}</td>
                  <td className="py-2">{booking.userId?.name}</td>
                  <td className="py-2">{booking.serviceId?.name}</td>
                  <td className="py-2">৳{booking.totalCost}</td>
                  <td className="py-2">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() =>
                        updateBookingStatus(booking._id, "Confirmed")
                      }
                      className="text-primary font-semibold hover:underline"
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Payment ID</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Booking</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{payment._id.substring(0, 8)}</td>
                  <td className="py-2">{payment.userId?.name}</td>
                  <td className="py-2">{payment.bookingId?.bookingId}</td>
                  <td className="py-2">৳{payment.amount}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
