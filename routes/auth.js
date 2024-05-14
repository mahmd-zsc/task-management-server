const express = require("express"); // Importing Express for routing
const router = express.Router(); // Creating an instance of Express router
const { register, login } = require("../controllers/authCtrl"); // Importing controller functions for authentication

// Route: Register a new user
router.post("/register", register); // POST request to '/register' endpoint calls register controller function

// Route: Login
router.post("/login", login); // POST request to '/login' endpoint calls login controller function

module.exports = router; // Exporting the router for use in the application
