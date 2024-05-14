const jwt = require("jsonwebtoken"); // Importing JWT for token verification

// Middleware to verify the presence and validity of a JWT token in the request headers
const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  // Check if token is provided in the request headers
  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }

  try {
    // Verify the JWT token using the secret key
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach decoded user information to the request object
    req.user = decodedUser;
    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle invalid token
    return res.status(404).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user matches the requested user ID
const verifyTokenOnlyUser = (req, res, next) => {
  // Call verifyToken middleware to verify token presence and validity
  verifyToken(req, res, () => {
    const { id } = req.user;
    // Check if the authenticated user matches the requested user ID
    if (id === req.params.id) {
      // Proceed to the next middleware if user matches
      next();
    } else {
      // If user does not match, deny access
      return res.status(406).json({
        message: "Access denied. Only the owner has access",
      });
    }
  });
};

// Exporting token verification middleware functions
module.exports = {
  verifyToken,
  verifyTokenOnlyUser,
};
