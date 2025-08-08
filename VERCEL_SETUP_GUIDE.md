# Vercel Deployment Guide for CryptoCardly

This guide will help you deploy your CryptoCardly project to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Ensure you have Node.js installed locally

## Step 1: Prepare Your Repository

Make sure your project is pushed to GitHub with the following structure:

```
cryptocardly/
├── index.html
├── server.js
├── package.json
├── vercel.json (newly created)
├── styles.css
├── script.js
├── form-handler.js
├── about.html
├── contact.html
├── features.html
├── how-it-works.html
├── pricing.html
├── privacy-policy.html
├── terms-conditions.html
└── env.example
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub**:

   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"

2. **Import Repository**:

   - Select your `cryptocardly` repository
   - Vercel will automatically detect it's a Node.js project

3. **Configure Project**:

   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (not needed for this project)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add the following environment variables in the Vercel dashboard:

   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_TO=contact@cryptocardly.com
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your project

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set environment variables when prompted

## Step 3: Configure Email Settings

### For Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update Environment Variables**:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: The app password (not your regular password)

### For Other Email Providers

Update the environment variables according to your provider:

- **Outlook**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's settings

## Step 4: Test Your Deployment

1. **Check the deployed URL** (provided by Vercel)
2. **Test the contact forms**:
   - Demo request form
   - Contact form
   - Quote request form
3. **Verify email delivery** to your configured email address

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**:

   - Go to your Vercel project dashboard
   - Settings → Domains
   - Add your domain (e.g., `cryptocardly.com`)

2. **Configure DNS**:
   - Add the CNAME record provided by Vercel
   - Wait for DNS propagation (up to 48 hours)

## Troubleshooting

### Common Issues

1. **Build Errors**:

   - Check that all dependencies are in `package.json`
   - Ensure `server.js` is the main entry point

2. **Email Not Working**:

   - Verify environment variables are set correctly
   - Check Gmail app password is correct
   - Test with a simple email first

3. **Static Files Not Loading**:

   - Ensure all HTML, CSS, and JS files are in the root directory
   - Check that `vercel.json` routes are configured correctly

4. **API Routes Not Working**:
   - Verify the `/api/` routes in `vercel.json`
   - Check that `server.js` handles the routes properly

### Environment Variables Checklist

Make sure these are set in your Vercel dashboard:

- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`
- [ ] `EMAIL_TO`
- [ ] `NODE_ENV=production`

## Project Structure Explanation

- **`vercel.json`**: Configuration file for Vercel deployment
- **`server.js`**: Main Node.js/Express server
- **Static files**: HTML, CSS, JS files served directly
- **API routes**: `/api/demo`, `/api/contact`, `/api/quote` for form handling

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Monitor function logs in Vercel dashboard
3. **Performance**: Check Core Web Vitals in Vercel analytics

## Security Considerations

1. **Rate Limiting**: Already implemented in `server.js`
2. **CORS**: Configured for cross-origin requests
3. **Helmet**: Security headers enabled
4. **Environment Variables**: Never commit sensitive data to Git

## Support

If you encounter issues:

1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Test locally with `npm start` first
4. Check the Vercel documentation for specific error messages

Your CryptoCardly project should now be successfully deployed on Vercel! 🚀
