const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for the State model
const stateSchema = new Schema({
    stateCode: { // State code (e.g., CA for California)
        type: String,
        required: true, // State code is required
        unique: true // State code must be unique
    },
    funfacts: [String] // Array of fun facts about the state
});

// Export the State model
module.exports = mongoose.model('State', stateSchema);
