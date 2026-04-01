"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchService();
  }, [params.service_id]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
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

  const handleBooking = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/booking/${params.service_id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-600">[Service Image]</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            {service.name}
          </h1>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Category: {service.category}
            </p>
            <p className="text-2xl font-bold text-primary mb-4">
              ৳{service.serviceCharge}/hour
            </p>

            {service.rating && (
              <div className="flex items-center gap-2 mb-4">
                <span>{"⭐".repeat(Math.floor(service.rating))}</span>
                <span className="text-gray-600">
                  ({service.reviews || 0} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="prose mb-6">
            <h2 className="text-xl font-bold mb-3">About this Service</h2>
            <p className="text-gray-700">{service.description}</p>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Features</h2>
              <ul className="list-disc list-inside space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleBooking}
            className="btn btn-primary w-full mb-4 text-lg"
          >
            Book Service
          </button>

          {!user && (
            <p className="text-center text-gray-600 text-sm">
              You need to{" "}
              <Link href="/login" className="text-primary font-semibold">
                login
              </Link>{" "}
              to book a service
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
