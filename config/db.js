// Import the mongoose module
const mongoose = require("mongoose");

// Define an asynchronous function to connect to the MongoDB database
async function connectWithDb() {
  try {
    // Connect to the MongoDB database using the URL specified in the environment variables
    await mongoose.connect(process.env.MONGODB_URL);
    // Log a success message if the connection is established
    console.log("Connected successfully to MongoDB ^-^");
  } catch (error) {
    // Log an error message if the connection fails and include the error details
    console.log("Failed to connect to MongoDB -_-", error);
  }
}

// Export the connectWithDb function as a named export
module.exports = { connectWithDb };
