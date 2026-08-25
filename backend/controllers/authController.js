const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
// Create JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message: "Name, email and password are required.",
      });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_NAME",
        message: "Name must contain at least 2 characters.",
      });
    }

    // Validate email
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_EMAIL",
        message: "Please enter a valid email address.",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        status: 400,
        errorCode: "WEAK_PASSWORD",
        message: "Password must contain at least 8 characters.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        errorCode: "EMAIL_EXISTS",
        message: "An account with this email already exists.",
      });
    }

    // IMPORTANT:
    // Public registration can ONLY create a normal user.
    // Admin accounts must be created separately.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "user",
    });

    const token = generateToken(user);

    return res.status(201).json({
      status: 201,
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "REGISTRATION_FAILED",
      message: "Registration failed. Please try again later.",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 401,
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      status: 200,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "LOGIN_FAILED",
      message: "Login failed. Please try again later.",
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        errorCode: "USER_NOT_FOUND",
        message: "No account found with this email.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    // Token expires after 15 minutes
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Password reset token generated successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "FORGOT_PASSWORD_FAILED",
      message: "Failed to process forgot password request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message: "New password is required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 400,
        errorCode: "WEAK_PASSWORD",
        message: "Password must contain at least 8 characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_RESET_TOKEN",
        message: "Reset token is invalid or expired.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "RESET_PASSWORD_FAILED",
      message: "Failed to reset password.",
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};