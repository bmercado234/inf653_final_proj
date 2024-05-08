// Import required modules
const express = require('express');

// Import states data
const statesArray = require('../model/statesData.json');

// Define custom verifying middleware 
const verifyState = () => {
    return (req, res, next) => {
        // Check if state abbreviation parameter exists in the request
        if (!req?.params?.state) {
            return res.status(400).json({"message": "Invalid state abbreviation parameter"});
        }

        // Convert state abbreviation to uppercase for consistency
        const shorthand = req.params.state.toUpperCase();

        // Extract state codes from the states data
        const codes = statesArray.map(state => state.code);

        // Check if the provided state abbreviation exists in the list of state codes
        const codeExists = codes.includes(shorthand);

        // If the state abbreviation does not exist, return a 400 (Bad Request) status
        if (!codeExists) {
            return res.status(400).json({"message": "Invalid state abbreviation parameter"});
        }

        // Attach the verified state code to the request object for further use
        req.code = shorthand;

        // Call the next middleware function
        next();
    };
};

// Export the verifyState middleware function
module.exports = verifyState;
