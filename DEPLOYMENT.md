# Deploy Care.xyz

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account

### Step 2: Connect Repository

1. Click "New Project"
2. Select your GitHub repository
3. Vercel auto-detects Next.js

### Step 3: Add Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add all from `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`
   - `EMAIL_USER`, `EMAIL_PASSWORD`
   - `STRIPE_*` keys
   - Others from `.env.local`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Get your live URL

## 🌐 Domain Setup

### Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add custom domain
3. Follow DNS instructions
4. Update `NEXTAUTH_URL` in environment variables

### Update Environment

```
NEXTAUTH_URL=https://your-domain.com
API_URL=https://your-domain.com/api
```

## 📦 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] All secrets in `.env.local` are strong
- [ ] `.env.local` is in `.gitignore`
- [ ] README.md updated with live link
- [ ] Stripe set to production keys
- [ ] Email configured with production account
- [ ] NEXTAUTH_SECRET generated (32+ chars)
- [ ] Repository pushed to GitHub

## 🔒 Security Best Practices

1. **Never commit secrets**

   ```bash
   git rm --cached .env.local
   ```

2. **Generate strong secrets**

   ```bash
   openssl rand -base64 32  # For NEXTAUTH_SECRET
   ```

3. **Use environment-specific values**
   - Dev: Test Stripe/Email keys
   - Production: Live keys

4. **Enable GitHub Secrets**
   - For CI/CD pipelines
   - For automated deployments

## ✅ Post-Deployment

1. **Test functionality**
   - Register account
   - Book service
   - Process payment
   - Check email

2. **Monitor errors**
   - Check Vercel logs
   - Monitor MongoDB usage
   - Review Stripe transactions

3. **Update README**

   ```markdown
   ## 🌐 Live Demo

   [Visit Care.xyz](https://your-app-url.vercel.app)

   ## 📚 GitHub Repository

   [GitHub Repo](https://github.com/yourname/care-xyz)
   ```

## 💾 Database Backups

### MongoDB Atlas Backups

1. Dashboard → Backup
2. Enable daily snapshots
3. Configure retention policy

## 🚨 Troubleshooting

### Build Fails on Vercel

```bash
# Test locally first
npm run build
npm start
```

### Environment Variables Not Working

1. Verify variable names match
2. Restart deployment
3. Clear browser cache

### Email Not Sending in Production

1. Check MongoDB records
2. Review Gmail settings
3. Verify SMTP credentials

---

**📝 Note:** Keep `.env.local` secure and never commit to Git!
