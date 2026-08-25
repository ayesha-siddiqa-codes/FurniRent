const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// DATABASE INDEXES
// =========================================================

// Quickly filter furniture by category
furnitureSchema.index({ category: 1 });

// Quickly find available furniture
furnitureSchema.index({ available: 1 });

// Quickly search furniture by name
furnitureSchema.index({ name: 1 });

module.exports = mongoose.model("Furniture", furnitureSchema);