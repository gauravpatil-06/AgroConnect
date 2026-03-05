const express = require("express");
const {
  getAllFarmers,
  getFarmerProfile,
  getMyFarmerProfile,
  updateFarmerProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getFarmerDashboardStats,
  getConsumerDashboardStats,
} = require("../controllers/userController");
const { verifyToken, isAdmin, isFarmer, isConsumer } = require("../utils/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

// Dashboard routes MUST come first to avoid ID conflict
router.get("/farmers/dashboard-stats", verifyToken, isFarmer, getFarmerDashboardStats);
router.get("/consumers/dashboard-stats", verifyToken, isConsumer, getConsumerDashboardStats);

// Public routes
router.get("/farmers", getAllFarmers);
router.get("/farmers/:id", getFarmerProfile);

// Private routes
router.get("/farmers/profile/me", verifyToken, isFarmer, getMyFarmerProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.put("/farmers/profile", verifyToken, isFarmer, updateFarmerProfile);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
