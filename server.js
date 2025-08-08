const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many form submissions, please try again later.'
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const createDemoEmailTemplate = (formData) => {
  return {
    subject: `Demo Request from ${formData.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">New Demo Request - CryptoCardly</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${formData.company}</p>
          <p><strong>Role:</strong> ${formData.role}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Project Details</h3>
          <p><strong>Timeline:</strong> ${formData.timeline || 'Not specified'}</p>
          <p><strong>Project Description:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px;">${formData.message}</p>
        </div>
        
        <div style="background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0;"><strong>Follow up with this lead within 24 hours!</strong></p>
        </div>
      </div>
    `
  };
};

const createContactEmailTemplate = (formData) => {
  return {
    subject: `Contact Form: ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">New Contact Message - CryptoCardly</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
          <p><strong>Name:</strong> ${formData.contactName}</p>
          <p><strong>Email:</strong> ${formData.contactEmail}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Message</h3>
          <p style="background: white; padding: 15px; border-radius: 4px; line-height: 1.6;">${formData.contactMessage}</p>
        </div>
        
        <div style="background: #059669; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0;"><strong>Reply to: ${formData.contactEmail}</strong></p>
        </div>
      </div>
    `
  };
};

const createQuoteEmailTemplate = (formData) => {
  const services = Array.isArray(formData.services) ? formData.services.join(', ') : 'None selected';
  
  return {
    subject: `Quote Request from ${formData.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">New Quote Request - CryptoCardly</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Company Information</h3>
          <p><strong>Company:</strong> ${formData.companyName}</p>
          <p><strong>Contact:</strong> ${formData.contactName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Project Requirements</h3>
          <p><strong>Expected Cards:</strong> ${formData.expectedCards || 'Not specified'}</p>
          <p><strong>Launch Timeline:</strong> ${formData.launchTimeline || 'Not specified'}</p>
          <p><strong>Required Services:</strong> ${services}</p>
        </div>
        
        ${formData.additionalRequirements ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Additional Requirements</h3>
          <p style="background: white; padding: 15px; border-radius: 4px; line-height: 1.6;">${formData.additionalRequirements}</p>
        </div>
        ` : ''}
        
        <div style="background: #7c3aed; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0;"><strong>Prepare detailed quote and respond within 24 hours!</strong></p>
        </div>
      </div>
    `
  };
};

// API Routes
app.post('/api/demo', async (req, res) => {
  try {
    const formData = req.body;
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = createDemoEmailTemplate(formData);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'contact@cryptocardly.com',
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Demo request sent successfully! We\'ll contact you within 24 hours.' 
    });
    
  } catch (error) {
    console.error('Demo form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send demo request. Please try again.' 
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const formData = req.body;
    
    // Basic validation
    if (!formData.contactName || !formData.contactEmail || !formData.subject || !formData.contactMessage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = createContactEmailTemplate(formData);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'contact@cryptocardly.com',
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
});

app.post('/api/quote', async (req, res) => {
  try {
    const formData = req.body;
    
    // Basic validation
    if (!formData.companyName || !formData.contactName || !formData.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = createQuoteEmailTemplate(formData);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'contact@cryptocardly.com',
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Quote request sent successfully! We\'ll send you a detailed proposal within 24 hours.' 
    });
    
  } catch (error) {
    console.error('Quote form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send quote request. Please try again.' 
    });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/*.html', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CryptoCardly server running on http://localhost:${PORT}`);
  console.log(`📧 Emails will be sent to: ${process.env.EMAIL_TO || 'contact@cryptocardly.com'}`);
});

module.exports = app; 