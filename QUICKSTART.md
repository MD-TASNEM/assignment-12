# 🚀 Care.xyz - Quick Start Guide

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB Atlas account ([Create Free](https://www.mongodb.com/cloud/atlas))
- Stripe account (optional) ([Create](https://stripe.com))
- Gmail account (for email functionality)

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Copy connection string
5. Update `MONGODB_URI` in `.env.local`

### 3. Configure Email

1. Go to [Gmail](https://myaccount.google.com)
2. Enable 2-factor authentication
3. Create App Password (16 characters)
4. Add to `.env.local`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### 4. Configure Stripe (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your Publishable & Secret keys
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📝 First Steps

### Initialize Database

1. Visit `http://localhost:3000/api/init`
2. Wait for success message
3. Services are now loaded

### Create Admin Account

1. Register on `/register`
2. Use NID: `1234567890`
3. Password must have uppercase + lowercase + number

### Access Admin Dashboard

1. Login with admin account
2. Navigate to `/admin`
3. View dashboard, bookings, and payments

## 🧪 Test Booking Flow

### Test Account

```
Email: test@example.com
Password: TestPass123
Phone: 01700000000
NID: 1234567890
```

### Test Stripe Payment

```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

## 📚 Important Files

- `.env.local` - Environment variables
- `src/models/` - Database schemas
- `src/app/api/` - API endpoints
- `src/components/` - React components

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check `MONGODB_URI` in `.env.local`
- Ensure IP is whitelisted in MongoDB Atlas
- Check network connectivity

### Email Not Sending

- Verify `EMAIL_USER` and `EMAIL_PASSWORD`
- Check Gmail App Password (16 chars)
- Ensure "Less secure apps" is OFF (use App Password instead)

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📞 Support

- Check README.md for full documentation
- Review API docs in README
- Check console for error messages

## 🎓 Next Steps

1. Read full [README.md](./README.md)
2. Explore API documentation
3. Customize styling in `tailwind.config.js`
4. Add more services to database
5. Deploy to Vercel

---

**Ready to start? Run `npm run dev` now!** 🚀
