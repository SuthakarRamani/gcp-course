const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// Set your SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, payment_id } = req.body;

  const msg = {
    to: 'sutha11nov@gmail.com',
    from: 'sutha11nov@gmail.com', // Must be verified in SendGrid
    subject: 'New Payment Submission',
    text: `Name: ${name}\nEmail: ${email}\nPayment Reference ID: ${payment_id}`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Email sent');
      res.send(`
        <h2>Thank you!</h2>
        <p>Your payment reference has been received. We'll verify and send your access links shortly.</p>
      `);
    })
    .catch(error => {
      console.error('Error sending email:', error);
      res.send('There was an error sending the email. Please try again.');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

