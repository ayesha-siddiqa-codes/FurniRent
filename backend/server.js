const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const furnitureRoutes = require("./routes/furnitureRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

connectDB();

const app = express();

// ======================================================
// SECURITY
// ======================================================

app.use(helmet());

// ======================================================
// CORS
// ======================================================

app.use(cors());

// ======================================================
// JSON BODY PARSER
// ======================================================

app.use(express.json());

// ======================================================
// RATE LIMITING
// ======================================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/furniture", furnitureRoutes);
app.use("/api/v1/rentals", rentalRoutes);

// ======================================================
// API TEST ROUTE
// ======================================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "API test route is working",
  });
});

// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "FurniRent API is running",
  });
});

// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    errorCode: "ROUTE_NOT_FOUND",
    message: "The requested route was not found.",
  });
});

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});