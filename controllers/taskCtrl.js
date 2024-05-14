const asyncHandler = require("express-async-handler"); // Importing async handler middleware for handling asynchronous errors
const {
  Task,
  createTaskValidation,
  updateTaskValidation,
} = require("../models/Task"); // Importing Task model and validation functions
const { User } = require("../models/User"); // Importing User model

/**
 * @desc Create a new task
 * @route /api/tasks/
 * @method POST
 * @access Private
 */
const createTask = asyncHandler(async (req, res) => {
  // Validate the request body using Joi schema
  const { error } = createTaskValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { title, description, dueDate, isComplete, category } = req.body;

  // Create a new task instance
  const newTask = new Task({
    title,
    description,
    dueDate,
    isComplete,
    category, // Include category in Task creation
    user: req.user.id, // Assuming user data is available from middleware
  });

  // Save the new task to the database
  const savedTask = await newTask.save();
  res.status(201).json(savedTask);
});

/**
 * @desc Get all tasks for the logged-in user
 * @route /api/tasks/
 * @method GET
 * @access Private
 */
const getAllTasks = asyncHandler(async (req, res) => {
  // Find all tasks associated with the logged-in user
  const tasks = await Task.find({ user: req.user._id });
  res.status(200).json(tasks);
});

/**
 * @desc Get a task by ID
 * @route /api/tasks/:id
 * @method GET
 * @access Private
 */
const getTaskById = asyncHandler(async (req, res) => {
  // Find the task by ID
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Authorization check can be added here to ensure user owns the task

  res.status(200).json(task);
});

/**
 * @desc Update a task by ID
 * @route /api/tasks/:id
 * @method PUT
 * @access Private
 */
const updateTask = asyncHandler(async (req, res) => {
  // Validate the request body using Joi schema
  const { error } = updateTaskValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Find and update the task by ID
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedTask) return res.status(404).json({ message: "Task not found" });

  // Authorization check can be added here

  res.status(200).json(updatedTask);
});

/**
 * @desc Delete a task by ID
 * @route /api/tasks/:id
 * @method DELETE
 * @access Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  // Find and delete the task by ID
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) return res.status(404).json({ message: "Task not found" });

  // Authorization check can be added here

  res.status(200).json({ message: "Task deleted successfully" });
});

/**
 * @desc Get all tasks for a specific user
 * @route /api/tasks/user/:userId
 * @method GET
 * @access Private
 */
const getTasksByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find the user by ID
  let user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  // Find tasks by user ID
  const tasks = await Task.find({ user: userId });

  res.status(200).json(tasks);
});

/**
 * @desc Complete a task by ID
 * @route /api/tasks/complete/:id
 * @method PUT
 * @access Private
 */
const completeTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  // Find the task by ID
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Update the task to mark it as complete
  task.isComplete = true;
  await task.save();

  res.status(200).json({ message: "Task completed successfully", task });
});

// Exporting task controller functions
module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId,
  completeTask,
};
