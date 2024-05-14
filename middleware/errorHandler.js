// error-handler.middleware.js

// Define an error handling middleware function
const errorHandler = (err, req, res, next) => {
  // Set default status code and error message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Customize error handling based on error type
  if (err.name === "ValidationError") {
    // Handle Mongoose validation errors
    statusCode = 400; // Bad Request status code
    message = "Validation Error";
  }

  // Log the error for debugging purposes
  console.error(err);

  // Send error response with appropriate status code and message
  res.status(statusCode).json({ error: message });
};

// Export the error handling middleware function
module.exports = errorHandler;
