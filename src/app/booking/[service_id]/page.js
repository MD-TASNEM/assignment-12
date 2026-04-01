"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLocationData } from "@/lib/locations";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(null);

  const [formData, setFormData] = useState({
    duration: 1,
    startDate: "",
    division: "",
    district: "",
    city: "",
    area: "",
    address: "",
  });

  const [totalCost, setTotalCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchService();
    loadLocations();
  }, []);

  useEffect(() => {
    if (service) {
      setTotalCost(formData.duration * service.serviceCharge);
    }
  }, [formData.duration, service]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push(`/service/${params.service_id}`);
      return;
    }

    setUser(JSON.parse(userData));
  };

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services?id=${params.service_id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    const data = getLocationData();
    setLocations(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: params.service_id,
          duration: parseInt(formData.duration),
          startDate: new Date(formData.startDate).toISOString(),
          location: {
            division: formData.division,
            district: formData.district,
            city: formData.city,
            area: formData.area,
            address: formData.address,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Booking successful! Redirecting to payment...");
      router.push(`/payment/${data.booking._id}`);
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (!service || !user || !locations) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Service not found or not authenticated</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Book {service.name}
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Summary */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-bold mb-2">Service Details</h3>
              <p className="text-sm text-gray-600">
                Service: <span className="font-semibold">{service.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Rate:{" "}
                <span className="font-semibold">
                  ৳{service.serviceCharge}/hour
                </span>
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-bold">Location Details</h3>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Division
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Division</option>
                  {locations.divisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {formData.division && locations.districts[formData.division] && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select District</option>
                    {locations.districts[formData.division].map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Area / Sector
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input h-20 resize-none"
                  required
                ></textarea>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-primary text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span>Duration:</span>
                <span>{formData.duration} hour(s)</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Rate:</span>
                <span>৳{service.serviceCharge}/hour</span>
              </div>
              <hr className="my-2 border-primary-light" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span>৳{totalCost}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-50 text-lg"
            >
              {submitting ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
