const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const { EmailClient } = require('@azure/communication-email');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Basic Auth setup (username/password from environment variables)
app.use(basicAuth({
  users: { [process.env.AUTH_USER]: process.env.AUTH_PASS },
  challenge: true   // forces browser popup for credentials
}));

// Set up Azure Email client
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, payment_id } = req.body;

  // Server-side validation
  if (!name || !email || !payment_id) {
    return res.send(`
      <h2>Error</h2>
      <p>All fields are required. Please go back and fill out the form completely.</p>
    `);
  }

  const message = {
    senderAddress: "DoNotReply@77158898-0355-496e-8d6a-2591edb5ead8.azurecomm.net", // must be verified in Azure
    content: {
      subject: "New Payment Submission",
      plainText: `Name: ${name}\nEmail: ${email}\nPayment Reference ID: ${payment_id}`
    },
    recipients: {
      to: [{ address: "sutha11nov@gmail.com" }]
    }
  };

  try {
    const poller = await emailClient.beginSend(message);
    const response = await poller.pollUntilDone();

    console.log("Email send status:", response.status);
    res.send(`
      <h2>Thank you!</h2>
      <p>Your payment reference has been received. We'll verify and send your access links shortly.</p>
    `);
  } catch (error) {
    console.error("Error sending email:", error);
    res.send("There was an error sending the email. Please try again.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

