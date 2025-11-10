const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { email, payment_id } = req.body;

  console.log(`Received submission:`);
  console.log(`Email: ${email}`);
  console.log(`Payment Reference ID: ${payment_id}`);

  // You can add email sending logic here using Nodemailer or SendGrid

  res.send(`
    <h2>Thank you!</h2>
    <p>We have received your payment reference. You will receive your access links shortly at <strong>${email}</strong>.</p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

