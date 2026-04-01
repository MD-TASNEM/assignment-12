import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendInvoiceEmail(userEmail, bookingData) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Booking Invoice - ${bookingData.serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B6B;">Care.xyz - Booking Invoice</h2>
        <hr>
        <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
        <p><strong>Service:</strong> ${bookingData.serviceName}</p>
        <p><strong>Duration:</strong> ${bookingData.duration} hours</p>
        <p><strong>Service Charge (per hour):</strong> ৳${bookingData.serviceCharge}</p>
        <p><strong>Total Cost:</strong> <span style="color: #FF6B6B; font-weight: bold;">৳${bookingData.totalCost}</span></p>
        <hr>
        <p><strong>Location:</strong></p>
        <p>${bookingData.location.address}</p>
        <p>${bookingData.location.area}, ${bookingData.location.city}</p>
        <p>${bookingData.location.district}, ${bookingData.location.division}</p>
        <hr>
        <p><strong>Status:</strong> ${bookingData.status}</p>
        <p><strong>Booking Date:</strong> ${new Date(bookingData.createdAt).toLocaleDateString()}</p>
        <hr>
        <p>Thank you for using Care.xyz. We are committed to providing you with reliable care services.</p>
        <p style="color: #666; font-size: 12px;">© Care.xyz - Trusted Care Services</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendBookingConfirmationEmail(userEmail, bookingData) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: "Booking Confirmed - Care.xyz",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4ECDC4;">Your booking has been confirmed!</h2>
        <p>Hello ${bookingData.userName},</p>
        <p>Your booking for <strong>${bookingData.serviceName}</strong> has been confirmed.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingData.bookingId}</li>
          <li><strong>Duration:</strong> ${bookingData.duration} hours</li>
          <li><strong>Start Date:</strong> ${new Date(bookingData.startDate).toLocaleDateString()}</li>
          <li><strong>Total Cost:</strong> ৳${bookingData.totalCost}</li>
        </ul>
        <p>We will contact you shortly to confirm the service details.</p>
        <p>Best regards,<br>Care.xyz Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(userEmail, userName) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: "Welcome to Care.xyz",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B6B;">Welcome to Care.xyz!</h2>
        <p>Hello ${userName},</p>
        <p>Welcome to Care.xyz - Your trusted platform for reliable care services.</p>
        <p>You can now explore our services and book caregivers for:</p>
        <ul>
          <li>Baby Care & Babysitting</li>
          <li>Elderly Care Services</li>
          <li>Special Care for Sick People</li>
        </ul>
        <p>Start booking your care services today!</p>
        <p>Best regards,<br>Care.xyz Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
