// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Import custom modules
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn'); // Database connection module

// Initialize Express application
const app = express();

// Define port for the server to listen on
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
connectDB();

// Enable CORS with predefined options
app.use(cors(corsOptions));

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: false }));

// Middleware to parse incoming JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Define routes
// Root route
app.use('/', require('./routes/api/root'));

// Route for handling states data
app.use('/states', require('./routes/api/states'));

// Middleware to handle all other routes (404 Not Found)
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Once MongoDB connection is open, start the server
mongoose.connection.once('open', () => {
    console.log('Mongo DB Connected');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
