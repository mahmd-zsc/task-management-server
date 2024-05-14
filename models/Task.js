const mongoose = require("mongoose"); // Importing Mongoose for schema definition
const joi = require("joi"); // Importing Joi for input validation

// Define the User schema (assuming it exists elsewhere)
const UserSchema = mongoose.Schema(/* User schema definition */);

// Define the Task schema using Mongoose
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date, // Assuming due date is a date
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User schema
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Define the Task model using the Task schema
const Task = mongoose.model("Task", TaskSchema);

// Validation schemas using Joi (adjusted to match Task schema)
const createTaskValidation = (obj) => {
  const schema = joi.object({
    title: joi.string().required().trim(), // Title is required and trimmed
    description: joi.string().trim(), // Description is optional and trimmed
    dueDate: joi.date(), // Due date is optional and must be a date
    isComplete: joi.boolean().default(false), // isComplete is optional and defaults to false
    category: joi.string().trim(), // Category is optional and trimmed
  });
  return schema.validate(obj);
};

const updateTaskValidation = (obj) => {
  const schema = joi
    .object({
      title: joi.string().trim(), // Title is optional and trimmed
      description: joi.string().trim(), // Description is optional and trimmed
      dueDate: joi.date(), // Due date is optional and must be a date
      isComplete: joi.boolean(), // isComplete is optional
      category: joi.string().trim(), // Category is optional and trimmed
    })
    .min(1); // At least one property required for update
  return schema.validate(obj);
};

// Export the Task model and validation functions
module.exports = {
  Task,
  createTaskValidation,
  updateTaskValidation,
};
