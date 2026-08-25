const express = require("express");

const {
    createRental,
    getRentals,
    getMyRentals,
    cancelRental,
    approveRental,
    completeRental,
    adminCancelRental
} = require("../controllers/rentalController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// USER ROUTES
// ======================================================

// Create a rental
router.post(
    "/",
    protect,
    createRental
);


// Get logged-in user's rentals
router.get(
    "/my",
    protect,
    getMyRentals
);


// User cancels their own pending rental
router.put(
    "/:id/cancel",
    protect,
    cancelRental
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Get all rentals
router.get(
    "/",
    protect,
    adminOnly,
    getRentals
);


// Admin approve rental
router.put(
    "/:id/approve",
    protect,
    adminOnly,
    approveRental
);


// Admin complete rental
router.put(
    "/:id/complete",
    protect,
    adminOnly,
    completeRental
);


// Admin cancel rental
router.put(
    "/:id/admin-cancel",
    protect,
    adminOnly,
    adminCancelRental
);


module.exports = router;