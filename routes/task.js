// Import necessary modules and controllers for tasks
const express = require("express"); // Importing Express for routing
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  completeTask,
} = require("../controllers/taskCtrl"); // Importing controller functions for tasks
const {
  verifyToken,
  verifyTokenOnlyUser,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken"); // Importing middleware functions for token verification

// Create an Express router
const router = express.Router();

// Route: Get all tasks for the logged-in user (requires authentication)
router.get("/", verifyToken, getAllTasks); // GET request to '/' endpoint calls getAllTasks controller function with token verification

// Route: Get all tasks for a specific user (requires authentication)
router.get("/user/:userId", verifyToken, getTasksByUserId); // GET request to '/user/:userId' endpoint calls getTasksByUserId controller function with token verification

// Route: Get, Update, and Delete a task by ID (requires authentication)
router
  .route("/:id")
  .get(verifyToken, getTaskById) // GET request to '/:id' endpoint calls getTaskById controller function with token verification
  .put(verifyToken, updateTask) // PUT request to '/:id' endpoint calls updateTask controller function with token verification
  .delete(verifyToken, deleteTask); // DELETE request to '/:id' endpoint calls deleteTask controller function with token verification

// Route: Create a new task (requires authentication)
router.post("/", verifyToken, createTask); // POST request to '/' endpoint calls createTask controller function with token verification

// Export the router
module.exports = router; // Exporting the router for use in the application
