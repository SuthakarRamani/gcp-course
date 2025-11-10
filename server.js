const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { email, payment_id } = req.body;

  // Create email transporter using Gmail and environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // e.g., sutha11nov@gmail.com
      pass: process.env.EMAIL_PASS  // your Gmail App Password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // send to yourself
    subject: 'New Payment Submission',
    text: `Email: ${email}\nPayment Reference ID: ${payment_id}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.send('There was an error sending the email. Please try again.');
    } else {
      console.log('Email sent:', info.response);
      res.send(`
        <h2>Thank you!</h2>
        <p>Your payment reference has been received. We'll verify and send your access links shortly.</p>
      `);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

