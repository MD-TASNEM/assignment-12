"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  useEffect(() => {
    fetchBooking();
  }, [params.booking_id]);

  const fetchBooking = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");

      // Create payment intent
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: params.booking_id,
          amount: booking.totalCost,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        alert(paymentData.message || "Payment failed");
        return;
      }

      // Simulate Stripe payment (in production, use Stripe.js)
      // This is a mock payment processing
      setTimeout(async () => {
        try {
          // Update payment status
          const updateResponse = await fetch(
            `/api/payments?id=${paymentData.payment._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: "completed",
              }),
            },
          );

          if (updateResponse.ok) {
            alert("Payment successful!");
            router.push("/my-bookings");
          }
        } catch (error) {
          console.error("Error updating payment:", error);
        } finally {
          setProcessing(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
      setProcessing(false);
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
        <h1 className="text-3xl font-bold mb-8 text-primary">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold">{booking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{booking.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-semibold">
                  ৳{booking.serviceCharge}/hour
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">৳{booking.totalCost}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
              <p className="font-semibold mb-1">Payment Status</p>
              <p>Status: {booking.paymentStatus}</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Enter Card Details</h2>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    maxLength="5"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    maxLength="3"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 mb-4">
                <p>
                  ⚠️ Test Mode: Use any card details to complete the payment
                </p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary w-full disabled:opacity-50 text-lg"
              >
                {processing
                  ? "Processing Payment..."
                  : `Pay ৳${booking.totalCost}`}
              </button>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-semibold mb-1">Test Payment Details</p>
              <p>Card: 4242 4242 4242 4242</p>
              <p>Expiry: Any future date</p>
              <p>CVV: Any 3 digits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
