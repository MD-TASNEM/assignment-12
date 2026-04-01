# Care.xyz - Trusted Care Services Platform

A comprehensive web application for providing reliable and trusted care services for children, elderly, and other family members. Users can easily find and hire caretakers for different purposes such as babysitting, elderly care, or special care at home.

## 🎯 Features

### Core Features

- ✅ **Responsive Design** - Mobile, tablet, and desktop supported
- ✅ **User Authentication** - Email & Password, Google Social Login
- ✅ **Dynamic Booking System** - Duration, Location selection, Address input
- ✅ **Cost Calculation** - Automatically calculated (duration × service charge)
- ✅ **Booking Management** - Track booking status (Pending/Confirmed/Completed/Cancelled)
- ✅ **Service Categories** - Baby Care, Elderly Service, Sick People Service
- ✅ **Email Invoices** - Automated invoice sending to users
- ✅ **Metadata Implementation** - SEO optimized home and service pages

### Optional Features

- ✅ **Stripe Payment Integration** - Secure payment processing
- ✅ **Admin Dashboard** - View payment histories, booking statistics, and manage services

## 📋 Pages & Routes

### Public Pages

- **Homepage** (`/`) - Banner, About section, Services overview, Testimonials
- **Service Detail** (`/service/:service_id`) - Detailed information about services
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **404 Error** - Not found page

### Private Pages (Requires Authentication)

- **Booking** (`/booking/:service_id`) - Book a service with location and duration selection
- **My Bookings** (`/my-bookings`) - Manage and track all user bookings
- **Payment** (`/payment/:booking_id`) - Process payment for booking
- **Admin Dashboard** (`/admin`) - Admin panel for managing bookings and payments

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with built-in routing
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library
- **@react-icons** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** (via Next.js API routes) - Server
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

### Additional Libraries

- **NextAuth** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client

## 🚀 Installation

### Prerequisites

- Node.js 18+
- MongoDB database
- Stripe account (optional for payment)
- Gmail account for email (with app password)

### Setup Steps

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd assignment-012
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create `.env.local` file with:

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/care-xyz

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@care-xyz.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# API
API_URL=http://localhost:3000/api
NEXT_PUBLIC_SERVICE_CHARGE=500
```

4. **Run development server**

```bash
npm run dev
```

5. **Open browser**
   Navigate to `http://localhost:3000`

## 📦 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── register/route.js
│   │   ├── services/route.js
│   │   ├── bookings/route.js
│   │   ├── payments/route.js
│   │   └── admin/dashboard/route.js
│   ├── booking/[service_id]/page.js
│   ├── my-bookings/page.js
│   ├── service/[service_id]/page.js
│   ├── login/page.js
│   ├── register/page.js
│   ├── admin/page.js
│   ├── not-found.js
│   ├── page.js (Homepage)
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── lib/
│   ├── db.js - Database connection
│   ├── auth.js - Authentication utilities
│   ├── email.js - Email service
│   ├── stripe.js - Stripe integration
│   └── locations.js - Location data
└── models/
    ├── User.js
    ├── Service.js
    ├── Booking.js
    └── Payment.js
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Services Endpoints

- `GET /api/services` - Get all services
- `GET /api/services?id=SERVICE_ID` - Get single service
- `POST /api/services` - Create service (admin)

### Bookings Endpoints

- `GET /api/bookings` - Get user bookings
- `GET /api/bookings?id=BOOKING_ID` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings?id=BOOKING_ID` - Update booking status
- `DELETE /api/bookings?id=BOOKING_ID` - Cancel booking

### Payments Endpoints

- `GET /api/payments` - Get user payments
- `GET /api/payments?bookingId=BOOKING_ID` - Get payment for booking
- `POST /api/payments` - Create payment intent
- `PATCH /api/payments?id=PAYMENT_ID` - Update payment status

### Admin Endpoints

- `GET /api/admin/dashboard?type=dashboard` - Dashboard stats
- `GET /api/admin/dashboard?type=bookings` - All bookings
- `GET /api/admin/dashboard?type=payments` - Payment history
- `POST /api/admin/dashboard` - Update booking status

## 🔐 Security Features

- Password encryption with bcryptjs
- JWT token authentication
- Environment variables for sensitive data
- Protected private routes
- Admin authorization checks
- Input validation and sanitization

## 📧 Email Features

The application sends automated emails for:

- Welcome email on registration
- Booking invoice with details
- Booking confirmation
- Payment notifications

## 💳 Payment Integration

### Stripe Setup

1. Create Stripe account at https://stripe.com
2. Get publishable and secret keys
3. Add keys to `.env.local`
4. Implement payment processing

### Test Card Numbers

- Visa: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

## 📝 User Flow

1. **Registration** → User creates account with NID, name, email, phone
2. **Browse Services** → View available care services
3. **Select Service** → Click on service to view details
4. **Book Service** → Select duration, location, date/time
5. **Payment** → Process payment using Stripe
6. **Track Booking** → View booking status in My Bookings
7. **Receive Invoice** → Email invoice sent automatically

## 🧪 Testing

### Test Account

- Email: test@example.com
- Password: TestPass123

### Test Booking Flow

1. Create account and login
2. Browse services on homepage
3. Click "Book Service" on any service
4. Fill booking details
5. Complete payment with test card
6. View booking in My Bookings

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

### Deploy to Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💼 Support

For issues and questions, please open an issue on GitHub or contact support.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Stripe API](https://stripe.com/docs/api)
- [NextAuth.js](https://next-auth.js.org)

---

**Happy Coding! 🚀**
#   a s s i g n m e n t - 1 2  
 