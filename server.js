// Require necessary modules
const express = require("express");
const dotenv = require("dotenv");
const { connectWithDb } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config({ path: ".env" });

// Connect to the database
connectWithDb();

// Parse JSON data in request body
app.use(express.json());

// Enhance security headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Routes for entities

// Mount routes with base path
app.use(`${process.env.API_VERSION}users`, require("./routes/user"));
app.use(`${process.env.API_VERSION}tasks`, require("./routes/task"));
app.use(`${process.env.API_VERSION}auth`, require("./routes/auth"));

// Serving Static Files (if applicable)
// Add configuration for serving static files if needed
// app.use(express.static(path.join(__dirname, 'public')));  // Example

// Error handling middleware (should come after all routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
