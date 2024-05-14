const express = require("express"); // Importing Express for routing
const router = express.Router(); // Creating an instance of Express router
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userCtrl"); // Importing controller functions for user operations
const { verifyTokenOnlyUser } = require("../middleware/verifyToken"); // Importing middleware function for token verification

// Route: Get all users (requires authentication)
router.get("/", verifyTokenOnlyUser, getAllUsers); // GET request to '/' endpoint calls getAllUsers controller function with token verification

// Route: Get user by ID
router.get("/:id", getUserById); // GET request to '/:id' endpoint calls getUserById controller function
router.get("/:id", verifyTokenOnlyUser, getUserById); // GET request to '/:id' endpoint calls getUserById controller function with token verification

// Route: Update user by ID
router.put("/:id", verifyTokenOnlyUser, updateUser); // PUT request to '/:id' endpoint calls updateUser controller function with token verification

// Route: Delete user by ID
router.delete("/:id", verifyTokenOnlyUser, deleteUser); // DELETE request to '/:id' endpoint calls deleteUser controller function with token verification

module.exports = router; // Exporting the router for use in the application
