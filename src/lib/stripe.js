import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(amount, metadata) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: metadata,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`);
  }
}

export async function retrievePaymentIntent(paymentIntentId) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`);
  }
}

export async function createCheckoutSession(
  bookingData,
  successUrl,
  cancelUrl,
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: bookingData.serviceName,
              description: `${bookingData.duration} hours of ${bookingData.serviceName}`,
            },
            unit_amount: Math.round(bookingData.totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: bookingData._id,
        userId: bookingData.userId,
      },
    });
    return session;
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`);
  }
}
