const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    furniture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    deliveryAddress: {
      street: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// DATABASE INDEXES
// =========================================================

// Quickly find rentals belonging to a particular user
rentalSchema.index({ user: 1 });

// Quickly filter rentals by status
rentalSchema.index({ status: 1 });

// Quickly sort rentals by newest first
rentalSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Rental", rentalSchema);