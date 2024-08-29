const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s if no connection is established
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if there is a connection error
  });

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  emailOrPhone: { type: String, required: true },
  password: { type: String, required: true }
}));

// API endpoint to handle login
app.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = new User({ emailOrPhone, password });
    await user.save();
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).send('Error saving user data.');
  }
});

// Export the Express app as a serverless function
module.exports = app;
