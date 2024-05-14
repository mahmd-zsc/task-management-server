const asyncHandler = require("express-async-handler"); // Importing async handler middleware for handling asynchronous errors
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const { User, createUserValidation } = require("../models/User"); // Importing User model and validation function

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  // Validate the request body using the Joi schema
  const { error } = createUserValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ email }] });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user instance
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the new user to the database
  const savedUser = await newUser.save();

  // Generate authentication token
  let token = savedUser.generateAuthToken();

  // Exclude _doc and $__ properties from user response
  const userResponse = savedUser.toJSON({ virtuals: true, getters: true });

  // Send the response without _doc and $__ properties, including the authentication token
  res.status(201).json({ ...userResponse, token });
});

/**
 * @desc Login a user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if the password is correct using bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate authentication token
  let token = user.generateAuthToken();

  // Send user data and authentication token in response
  res.status(200).json({
    id: user._id,
    username: user.username,
    token,
  });
});

// Exporting authentication controller functions
module.exports = {
  register,
  login,
  // Add other authentication-related controller exports as needed
};
