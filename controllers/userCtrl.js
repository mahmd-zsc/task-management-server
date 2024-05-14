const asyncHandler = require("express-async-handler"); // Importing async handler middleware for handling asynchronous errors
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const { User, updateUserValidation } = require("../models/User"); // Importing User model and validation functions

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Find all users
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @desc Get user by ID
 * @route GET /api/users/:id
 * @access Public
 */
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Fetch user from the database, excluding password field
  const user = await User.findById(userId)
    .select("-password")
    .populate("tasks");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user });
});

/**
 * @desc Update user by ID
 * @route PUT /api/users/:id
 * @access Public
 */
const updateUser = asyncHandler(async (req, res) => {
  const { error } = updateUserValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = req.params.id;

  // Retrieve user before updating
  let updatedUser = await User.findById(userId);
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user data, including password hashing if password is provided
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  );

  res.status(200).json(updatedUser);
});

/**
 * @desc Delete user by ID
 * @route DELETE /api/users/:id
 * @access Public
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find and delete the user by ID
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
});

// Exporting user controller functions
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  // Add other user-related controller exports as needed
};
