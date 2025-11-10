const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <h2>Scan to Pay ₹50 via GPay</h2>
    <img src="/gpay_qr.png" alt="GPay QR Code" width="300">
    <p>After payment, you'll receive your access links via email.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
