const express = require("express");

const {
  getFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
} = require("../controllers/furnitureController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view furniture
router.get("/", getFurniture);

// Anyone can view one furniture item
router.get("/:id", getFurnitureById);

// Only admin can add furniture
router.post("/", protect, adminOnly, createFurniture);

// Only admin can update furniture
router.put("/:id", protect, adminOnly, updateFurniture);

// Only admin can delete furniture
router.delete("/:id", protect, adminOnly, deleteFurniture);

module.exports = router;