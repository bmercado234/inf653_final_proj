const mongoose = require('mongoose');

/**
 * Connect to the MongoDB database.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // Options for the database connection
            useUnifiedTopology: true, // Set to true to opt in to using the MongoDB driver's new connection management engine
            useNewUrlParser: true // Set to true to opt in to using the new topology engine
        });
        console.log('MongoDB connected successfully'); // Log successful connection
    } catch (err) {
        console.error('MongoDB connection error:', err); // Log connection error
    }
};

module.exports = connectDB;
