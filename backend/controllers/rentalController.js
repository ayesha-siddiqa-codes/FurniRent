const Rental = require("../models/Rental");
const Furniture = require("../models/Furniture");

// ======================================================
// CREATE A RENTAL
// ======================================================

const createRental = async (req, res) => {
  try {
    const {
      furniture,
      startDate,
      endDate,
      deliveryAddress,
    } = req.body;

    // Validate required fields
    if (
      !furniture ||
      !startDate ||
      !endDate ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message:
          "Furniture, start date, end date and delivery address are required.",
      });
    }

    // Validate delivery address
    if (
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_ADDRESS",
        message: "Complete delivery address is required.",
      });
    }

    // Find furniture
    const furnitureItem = await Furniture.findById(furniture);

    if (!furnitureItem) {
      return res.status(404).json({
        status: 404,
        errorCode: "FURNITURE_NOT_FOUND",
        message: "Furniture not found.",
      });
    }

    // Check availability
    if (!furnitureItem.available) {
      return res.status(400).json({
        status: 400,
        errorCode: "FURNITURE_UNAVAILABLE",
        message: "Furniture is not available.",
      });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_DATE",
        message: "Please provide valid rental dates.",
      });
    }

    // End date must be after start date
    if (end <= start) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_DATE_RANGE",
        message: "End date must be after the start date.",
      });
    }

    // Start date cannot be in the past
    if (start < new Date()) {
      return res.status(400).json({
        status: 400,
        errorCode: "PAST_START_DATE",
        message:
          "Rental start date cannot be in the past.",
      });
    }

    // Calculate rental days
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const numberOfDays = Math.ceil(
      (end - start) / millisecondsPerDay
    );

    // Calculate total amount
    const totalAmount =
      numberOfDays *
      furnitureItem.pricePerDay;

    // Create rental
    const rental = await Rental.create({
      user: req.user._id,
      furniture,
      startDate: start,
      endDate: end,

      deliveryAddress: {
        street: deliveryAddress.street.trim(),
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state.trim(),
        pincode: deliveryAddress.pincode.trim(),
      },

      totalAmount,
      status: "pending",
    });

    return res.status(201).json({
      status: 201,
      message: "Rental created successfully.",
      data: rental,
    });
  } catch (error) {
    console.error(
      "Rental creation error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "RENTAL_CREATION_FAILED",
      message: "Rental creation failed.",
    });
  }
};

// ======================================================
// GET ALL RENTALS - ADMIN
// ======================================================

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("user", "name email")
      .populate(
        "furniture",
        "name category pricePerDay image"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      data: rentals,
    });
  } catch (error) {
    console.error("Get rentals error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "FETCH_RENTALS_FAILED",
      message: "Failed to get rentals.",
    });
  }
};

// ======================================================
// GET RENTALS OF LOGGED-IN USER
// ======================================================

const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      user: req.user._id,
    })
      .populate(
        "furniture",
        "name category pricePerDay image"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      data: rentals,
    });
  } catch (error) {
    console.error(
      "Get my rentals error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "FETCH_MY_RENTALS_FAILED",
      message: "Failed to get your rentals.",
    });
  }
};

// ======================================================
// CANCEL RENTAL - USER
// ======================================================

const cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(
      req.params.id
    );

    if (!rental) {
      return res.status(404).json({
        status: 404,
        errorCode: "RENTAL_NOT_FOUND",
        message: "Rental not found.",
      });
    }

    if (
      rental.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 403,
        errorCode: "FORBIDDEN",
        message:
          "You are not allowed to cancel this rental.",
      });
    }

    if (rental.status !== "pending") {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_RENTAL_STATUS",
        message:
          "Only pending rentals can be cancelled.",
      });
    }

    rental.status = "cancelled";

    await rental.save();

    return res.status(200).json({
      status: 200,
      message: "Rental cancelled successfully.",
      data: rental,
    });
  } catch (error) {
    console.error(
      "Cancel rental error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "CANCEL_RENTAL_FAILED",
      message: "Failed to cancel rental.",
    });
  }
};

// ======================================================
// APPROVE RENTAL - ADMIN
// ======================================================

const approveRental = async (req, res) => {
  try {
    const rental = await Rental.findById(
      req.params.id
    );

    if (!rental) {
      return res.status(404).json({
        status: 404,
        errorCode: "RENTAL_NOT_FOUND",
        message: "Rental not found.",
      });
    }

    if (rental.status !== "pending") {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_RENTAL_STATUS",
        message:
          "Only pending rentals can be approved.",
      });
    }

    rental.status = "approved";

    await rental.save();

    return res.status(200).json({
      status: 200,
      message: "Rental approved successfully.",
      data: rental,
    });
  } catch (error) {
    console.error(
      "Approve rental error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "APPROVE_RENTAL_FAILED",
      message: "Failed to approve rental.",
    });
  }
};

// ======================================================
// COMPLETE RENTAL - ADMIN
// ======================================================

const completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(
      req.params.id
    );

    if (!rental) {
      return res.status(404).json({
        status: 404,
        errorCode: "RENTAL_NOT_FOUND",
        message: "Rental not found.",
      });
    }

    if (rental.status !== "approved") {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_RENTAL_STATUS",
        message:
          "Only approved rentals can be completed.",
      });
    }

    rental.status = "completed";

    await rental.save();

    return res.status(200).json({
      status: 200,
      message: "Rental completed successfully.",
      data: rental,
    });
  } catch (error) {
    console.error(
      "Complete rental error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "COMPLETE_RENTAL_FAILED",
      message: "Failed to complete rental.",
    });
  }
};

// ======================================================
// ADMIN CANCEL RENTAL
// ======================================================

const adminCancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(
      req.params.id
    );

    if (!rental) {
      return res.status(404).json({
        status: 404,
        errorCode: "RENTAL_NOT_FOUND",
        message: "Rental not found.",
      });
    }

    if (
      rental.status === "completed" ||
      rental.status === "cancelled"
    ) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_RENTAL_STATUS",
        message:
          "This rental cannot be cancelled.",
      });
    }

    rental.status = "cancelled";

    await rental.save();

    return res.status(200).json({
      status: 200,
      message:
        "Rental cancelled successfully by admin.",
      data: rental,
    });
  } catch (error) {
    console.error(
      "Admin cancel rental error:",
      error
    );

    return res.status(500).json({
      status: 500,
      errorCode: "ADMIN_CANCEL_RENTAL_FAILED",
      message:
        "Failed to cancel rental.",
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  createRental,
  getRentals,
  getMyRentals,
  cancelRental,
  approveRental,
  completeRental,
  adminCancelRental,
};