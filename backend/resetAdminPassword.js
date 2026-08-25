const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await connectDB();

    // New password
    const newPassword = "Admin@123";

    // Find admin account
    const admin = await User.findOne({
      email: "admin@furniturerental.com"
    });

    if (!admin) {
      console.log("Admin account not found.");
      process.exit(1);
    }

    // Set new password
    admin.password = newPassword;

    // Make sure role remains admin
    admin.role = "admin";

    // User model will automatically hash the password
    await admin.save();

    console.log("");
    console.log("=================================");
    console.log("ADMIN PASSWORD RESET SUCCESSFUL");
    console.log("=================================");
    console.log("Email: admin@furniturerental.com");
    console.log("Password: Admin@123");
    console.log("Role:", admin.role);
    console.log("=================================");
    console.log("");

    process.exit(0);

  } catch (error) {

    console.error(
      "Password reset failed:",
      error.message
    );

    process.exit(1);
  }
}

resetAdminPassword();