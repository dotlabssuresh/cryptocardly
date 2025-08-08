# 📧 CryptoCardly Email Setup Guide

## ✅ **Implementation Complete!**

Your CryptoCardly website now has **full email functionality** for all forms. Here's what was implemented:

---

## 🏗️ **What Was Built**

### **Backend Server (`server.js`)**
- **Express.js** server with email handling
- **3 API endpoints** for form submissions:
  - `/api/demo` - Demo requests (contact page)
  - `/api/contact` - General inquiries (contact page) 
  - `/api/quote` - Quote requests (pricing page)
- **Security features**: Rate limiting, CORS, Helmet
- **Email templates** with professional HTML formatting

### **Frontend Integration (`form-handler.js`)**
- **AJAX form submissions** (no page refresh)
- **Loading states** with spinner animations
- **Success/error messages** with auto-dismiss
- **Form validation** and user feedback

### **Email Configuration**
- **Nodemailer** for sending emails
- **Gmail SMTP** support (configurable)
- **Professional email templates** for each form type
- All emails sent to: `contact@cryptocardly.com`

---

## ⚙️ **Setup Required**

### **1. Create Environment File**
Create a `.env` file in your project root:

```bash
# Copy the example file
cp env.example .env
```

Then edit `.env` with your email credentials:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=contact@cryptocardly.com

# Server Configuration
PORT=3001
NODE_ENV=production
```

### **2. Gmail App Password Setup**
For Gmail, you need an **App Password** (not your regular password):

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **Google Account Settings** → **Security**
3. Under **2-Step Verification**, click **App passwords**
4. Generate password for **Mail**
5. Use this 16-character password in `EMAIL_PASS`

### **3. Alternative Email Services**
You can also use other email services:

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

**AWS SES:**
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-smtp-username
EMAIL_PASS=your-aws-smtp-password
```

---

## 🚀 **How to Run**

### **Development Mode**
```bash
# Install dependencies (already done)
npm install

# Start the server
npm run dev
# OR
node server.js
```

### **Production Mode**
```bash
# Start the server
npm start
```

### **Access Your Website**
- **Website**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/api/health`

---

## 📋 **Form Details**

### **Demo Form (Contact Page)**
- **Endpoint**: `/api/demo`
- **Fields**: Name, Email, Phone, Company, Role, Timeline, Message
- **Email Subject**: "Demo Request from [Company]"

### **Contact Form (Contact Page)**
- **Endpoint**: `/api/contact`
- **Fields**: Name, Email, Subject, Message
- **Email Subject**: "Contact Form: [Subject]"

### **Quote Form (Pricing Page)**
- **Endpoint**: `/api/quote`
- **Fields**: Company, Contact, Email, Phone, Cards, Timeline, Services, Requirements
- **Email Subject**: "Quote Request from [Company]"

---

## 🔧 **Testing**

### **Test Forms Without Email**
You can test form submissions even without email setup. The server will log errors but forms will still validate.

### **Test Email Functionality**
1. **Setup `.env` file** with valid credentials
2. **Submit a form** on your website
3. **Check your inbox** at `contact@cryptocardly.com`
4. **Check server logs** for any errors

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

**"Authentication failed"**
- Check Gmail App Password is correct
- Ensure 2FA is enabled on Gmail
- Verify EMAIL_USER and EMAIL_PASS in `.env`

**"Connection timeout"**
- Check EMAIL_HOST and EMAIL_PORT
- Verify internet connection
- Try different email service

**"Forms not submitting"**
- Check browser console for JavaScript errors
- Verify `form-handler.js` is loaded
- Ensure server is running on correct port

### **Debug Mode:**
Add this to your `.env` for detailed logging:
```env
NODE_ENV=development
DEBUG=nodemailer*
```

---

## 📊 **Monitoring**

### **Server Health**
Check if server is running:
```bash
curl http://localhost:3001/api/health
```

### **Email Logs**
Server logs will show:
- Form submissions
- Email sending status
- Error details

---

## 🔒 **Security Features**

- **Rate Limiting**: 10 requests per 15 minutes per IP
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers
- **Input Validation**: Server-side form validation
- **XSS Protection**: HTML email templates are safe

---

## 🚀 **Next Steps**

1. **Setup email credentials** in `.env`
2. **Test all three forms**
3. **Monitor email delivery**
4. **Deploy to production** (Vercel, Netlify, etc.)

Your email system is ready to go! 🎉 