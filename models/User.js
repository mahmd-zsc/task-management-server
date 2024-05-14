const mongoose = require("mongoose"); // Importing Mongoose for schema definition
const joi = require("joi"); // Importing Joi for input validation
const jwt = require("jsonwebtoken"); // Importing JWT for token generation
const Task = require("./Task"); // Importing the Task model

// Define the User schema using Mongoose
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtual properties in JSON output
    toObject: { virtuals: true }, // Include virtual properties in object output
  }
);

// Define a virtual property to link User and Task models
userSchema.virtual("tasks", {
  ref: "Task", // Reference to the Task model
  localField: "_id", // Field in the User model
  foreignField: "user", // Field in the Task model
});

// Define a method to generate authentication token for user
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { email: this.email, id: this.id }, // Payload containing email and id
    process.env.JWT_SECRET_KEY // Secret key for token generation
  );
};

// Create the User model using the User schema
const User = mongoose.model("User", userSchema);

// Validation schema for creating a new user
const createUserValidation = (user) => {
  const schema = joi.object({
    username: joi.string().required().trim().min(3).max(10), // Username validation
    email: joi.string().required().email().trim(), // Email validation
    password: joi.string().required().min(8).max(20), // Password validation
  });

  return schema.validate(user); // Validate the user object against the schema
};

// Validation schema for updating user information
const updateUserValidation = (obj) => {
  const schema = joi
    .object({
      username: joi.string().trim().min(3).max(10), // Username validation (optional)
      email: joi.string().email().trim(), // Email validation (optional)
      password: joi.string().min(8).max(20), // Password validation (optional)
    })
    .min(1); // At least one property required for update

  return schema.validate(obj); // Validate the update object against the schema
};

// Export the User model and validation functions for use in other parts of the application
module.exports = {
  User,
  createUserValidation,
  updateUserValidation,
};
