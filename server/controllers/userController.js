const User = require("../models/UserModel");
const FarmerProfile = require("../models/FarmerProfileModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const Message = require("../models/MessageModel");

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");

    res.json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer profile
// @route   GET /api/users/farmers/:id
// @access  Public
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findOne({
      _id: req.params.id,
      role: "farmer",
    }).select("-password");

    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    const farmerProfile = await FarmerProfile.findOne({ user: req.params.id });

    res.json({
      success: true,
      data: {
        farmer,
        profile: farmerProfile || {},
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update farmer profile
// @route   PUT /api/users/farmers/profile
// @access  Private (Farmer only)
exports.updateFarmerProfile = async (req, res) => {
  try {
    const {
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    } = req.body;

    const profileFields = {
      user: req.user._id,
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    };

    let farmerProfile = await FarmerProfile.findOne({ user: req.user._id });

    if (farmerProfile) {
      farmerProfile = await FarmerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      farmerProfile = await FarmerProfile.create(profileFields);
    }

    res.json({
      success: true,
      data: farmerProfile,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get current farmer profile
// @route   GET /api/users/farmers/profile/me
// @access  Private (Farmer only)
exports.getMyFarmerProfile = async (req, res) => {
  try {
    const farmerProfile = await FarmerProfile.findOne({ user: req.user._id });

    res.json({
      success: true,
      data: farmerProfile || {},
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;
    
    // Handle nested address string from FormData if needed
    let parsedAddress = address;
    if (typeof address === 'string') {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        // Fallback or leave as is if not JSON
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = parsedAddress || user.address;

      if (profileImage) {
        user.profileImage = profileImage;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
          profileImage: updatedUser.profileImage,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// @desc    Get farmer dashboard statistics
// @route   GET /api/users/farmers/dashboard-stats
// @access  Private (Farmer only)
exports.getFarmerDashboardStats = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Run all queries in parallel for maximum speed
    const [products, orders, messages] = await Promise.all([
      Product.find({ farmer: farmerId }).populate("category", "name").sort("-createdAt"),
      Order.find({ farmer: farmerId }).populate("consumer", "name").populate({
        path: "items.product",
        select: "name images unit price",
      }).sort("-createdAt"),
      Message.find({
        $or: [{ sender: farmerId }, { receiver: farmerId }],
        deletedBy: { $ne: farmerId },
      }).sort("-createdAt").populate("sender", "name role profileImage").populate("receiver", "name role profileImage")
    ]);

    // Calculate unread messages count
    const unreadMessagesCount = messages.filter(
      (m) => m.receiver.toString() === farmerId.toString() && !m.isRead
    ).length;

    // We can also extract conversation counts here if needed, but for the dashboard stats boxes:
    res.json({
      success: true,
      data: {
        products,
        orders,
        unreadMessagesCount,
        // we can add more pre-calculated stats here if needed
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get consumer dashboard statistics
// @route   GET /api/users/consumers/dashboard-stats
// @access  Private (Consumer only)
exports.getConsumerDashboardStats = async (req, res) => {
  try {
    const consumerId = req.user._id;
    console.log("Stats requested for Consumer:", consumerId);

    // Run all queries in parallel for maximum speed
    const [orders, messages] = await Promise.all([
      Order.find({ consumer: consumerId }).populate({
        path: "farmer",
        select: "name phone",
      }).populate({
        path: "items.product",
        select: "name images unit price",
      }).sort("-createdAt"),
      Message.find({
        $or: [{ sender: consumerId }, { receiver: consumerId }],
        deletedBy: { $ne: consumerId },
      }).sort("-createdAt").populate("sender", "name role profileImage").populate("receiver", "name role profileImage")
    ]);

    // Calculate unread messages count correctly (m.receiver can be object or ID)
    const unreadMessagesCount = messages.filter((m) => {
      const receiverId = m.receiver._id ? m.receiver._id.toString() : m.receiver.toString();
      return receiverId === consumerId.toString() && !m.isRead;
    }).length;

    res.json({
      success: true,
      data: {
        orders,
        unreadMessagesCount,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
