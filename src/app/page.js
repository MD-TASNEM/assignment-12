"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Home - Care.xyz",
  description:
    "Find trusted care services for your family. Baby care, elderly care, and special care services.",
};

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Care for Your Loved Ones
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Find trusted and reliable caretakers for your family members
          </p>
          <Link href="/#services" className="btn btn-primary">
            Explore Services
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">About Care.xyz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="mb-4 text-gray-700">
                Care.xyz is a trusted platform dedicated to connecting families
                with reliable and qualified caretakers. Our mission is to make
                caregiving easy, secure, and accessible for everyone.
              </p>
              <p className="mb-4 text-gray-700">
                Whether you need assistance with baby care, elderly care, or
                special care services, we have you covered with vetted
                professionals who are passionate about providing excellent care.
              </p>
              <div className="flex gap-8 mt-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary">5000+</h3>
                  <p className="text-gray-600">Happy Families</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">2000+</h3>
                  <p className="text-gray-600">Verified Caregivers</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">10000+</h3>
                  <p className="text-gray-600">Services Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg h-80 flex items-center justify-center">
              <p className="text-gray-600">[Image Placeholder]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Services</h2>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id} className="card">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <p className="text-gray-600">{service.category}</p>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {service.description.substring(0, 100)}...
                  </p>
                  <p className="text-primary font-bold mb-4">
                    ৳{service.serviceCharge}/hour
                  </p>
                  <Link
                    href={`/service/${service._id}`}
                    className="btn btn-primary w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No services available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Fatima Ahmed",
                text: "Care.xyz helped me find a wonderful caregiver for my elderly mother. Highly recommended!",
                rating: 5,
              },
              {
                name: "Karim Hassan",
                text: "Excellent service! The babysitter was professional and caring. My kids loved her.",
                rating: 5,
              },
              {
                name: "Aisha Khan",
                text: "Professional and trustworthy platform. Best care services in Bangladesh.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="mb-4">{"⭐".repeat(testimonial.rating)}</div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-bold text-primary">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Care?</h2>
          <p className="mb-8 text-lg opacity-90">
            Book your first care service today
          </p>
          <Link
            href="/#services"
            className="btn bg-white text-primary hover:bg-gray-200"
          >
            Browse Services
          </Link>
        </div>
      </section>
    </div>
  );
}
