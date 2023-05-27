const express = require('express');
const { OTP, sendEmail }= require('./otp');
const cors = require('cors');
// const sendEmail = require('./sendEmail');
const app = express();

require('./middlewares/mongoDB')

// Parse incoming JSON data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle form submission
app.post('/submit', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

  try {
    // Save OTP to MongoDB
    const otpData = new OTP({
      email,
      otp: otp.toString(),
    });
    await otpData.save();

    // Send OTP email
    await sendEmail(email, otp);

    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpData = await OTP.findOneAndDelete({ email, otp });
    if (otpData) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Hosting
const path = require('path'); 
 app.use(express.static('./dist/frontend')); 
 app.get('/*', function(req, res) { 
  res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
 }); 

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
