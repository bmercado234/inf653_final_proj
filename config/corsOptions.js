// Import allowed origins
const allowedOrigins = require('./allowedOrigins');

// Define CORS options
const corsOptions = {
    origin: (origin, callback) => {
        // Check if the request origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // If origin is allowed or is not provided, allow the request
            callback(null, true);
        } else {
            // If origin is not allowed, return an error
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Set the status for preflight requests to 200
};

// Export CORS options
module.exports = corsOptions;
