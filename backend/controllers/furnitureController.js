const Furniture = require("../models/Furniture");

// Get all furniture
const getFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      data: furniture,
    });
  } catch (error) {
    console.error("Get furniture error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "FETCH_FURNITURE_FAILED",
      message: "Failed to fetch furniture.",
    });
  }
};

// Get furniture by ID
const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        status: 404,
        errorCode: "FURNITURE_NOT_FOUND",
        message: "Furniture not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      data: furniture,
    });
  } catch (error) {
    console.error("Get furniture by ID error:", error);

    return res.status(400).json({
      status: 400,
      errorCode: "INVALID_FURNITURE_ID",
      message: "Invalid furniture ID.",
    });
  }
};

// Add furniture
const createFurniture = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerDay,
      image,
      available,
    } = req.body;

    if (!name || !description || !category || pricePerDay === undefined) {
      return res.status(400).json({
        status: 400,
        errorCode: "VALIDATION_ERROR",
        message:
          "Name, description, category and price per day are required.",
      });
    }

    if (Number(pricePerDay) <= 0) {
      return res.status(400).json({
        status: 400,
        errorCode: "INVALID_PRICE",
        message: "Price per day must be greater than 0.",
      });
    }

    const furniture = await Furniture.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      pricePerDay: Number(pricePerDay),
      image: image || "",
      available: available !== undefined ? available : true,
    });

    return res.status(201).json({
      status: 201,
      message: "Furniture added successfully.",
      data: furniture,
    });
  } catch (error) {
    console.error("Create furniture error:", error);

    return res.status(500).json({
      status: 500,
      errorCode: "CREATE_FURNITURE_FAILED",
      message: "Failed to add furniture.",
    });
  }
};

// Update furniture
const updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!furniture) {
      return res.status(404).json({
        status: 404,
        errorCode: "FURNITURE_NOT_FOUND",
        message: "Furniture not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Furniture updated successfully.",
      data: furniture,
    });
  } catch (error) {
    console.error("Update furniture error:", error);

    return res.status(400).json({
      status: 400,
      errorCode: "UPDATE_FURNITURE_FAILED",
      message: "Failed to update furniture.",
    });
  }
};

// Delete furniture
const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        status: 404,
        errorCode: "FURNITURE_NOT_FOUND",
        message: "Furniture not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Furniture deleted successfully.",
    });
  } catch (error) {
    console.error("Delete furniture error:", error);

    return res.status(400).json({
      status: 400,
      errorCode: "DELETE_FURNITURE_FAILED",
      message: "Failed to delete furniture.",
    });
  }
};

module.exports = {
  getFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};