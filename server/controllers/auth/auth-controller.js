const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register a new user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check if user already exists with the same email
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    // Hash the password for secure storage
    const hashPassword = await bcrypt.hash(password, 12);

    // Determine if the new user should be an admin (first user in the database)
    const userCount = await User.countDocuments();

    // Create the new user
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      role: userCount === 0 ? "admin" : "user", // First user gets the "admin" role
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during registration.",
    });
  }
};

// Log in an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    // Verify the password
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY", // Replace with environment variable in production
      { expiresIn: "60m" }
    );

    // Send the token as an HTTP-only cookie for security
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during login.",
    });
  }
};

// Log out the user by clearing the authentication cookie
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Middleware to authenticate requests
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY"); // Replace with environment variable in production
    req.user = decoded; // Attach user information to the request
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
