const express = require('express');
const router = express.Router();
const path = require('path');

// Route for serving index.html for root and /index paths
router.get('^/$|/index(.html)?', (req, res) => {
    // Send index.html file located in the views directory
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
