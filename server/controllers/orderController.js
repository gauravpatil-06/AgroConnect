const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

// @desc    Create an order
// @route   POST /api/orders
// @access  Private (Consumer only)
exports.createOrder = async (req, res) => {
  try {
    const { farmer, items, pickupDetails, deliveryDetails, notes } = req.body;

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough quantity available for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;
      item.price = product.price;
    }

    const order = await Order.create({
      consumer: req.user._id,
      farmer,
      items,
      totalAmount,
      pickupDetails,
      deliveryDetails,
      notes,
    });

    // Deduct quantity from products
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantityAvailable: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get consumer orders
// @route   GET /api/orders/consumer
// @access  Private (Consumer only)
exports.getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate("farmer", "name")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name images unit",
        },
      })
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer only)
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate("consumer", "name")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name images unit",
        },
      })
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumer", "name email phone")
      .populate("farmer", "name email phone")
      .populate({
        path: "items.product",
        select: "name images",
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.consumer._id.toString() !== req.user._id.toString() &&
      order.farmer._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this order" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer or Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Identify roles correctly using string conversion
    const userId = String(req.user._id || req.user.id);
    const farmerId = String(order.farmer);
    const consumerId = String(order.consumer);
    const userRole = req.user.role;

    // Split logic by role for total clarity
    if (userRole === "admin") {
      // Admin is authorized for everything
    } else if (userId === farmerId) {
      // Farmer who owns the order is authorized for everything
    } else if (userId === consumerId) {
      // Consumer who placed the order - can ONLY cancel if order is pending
      if (status.toLowerCase() !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Consumers are only permitted to cancel their orders",
        });
      }
      if (order.status.toLowerCase() !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Orders can only be cancelled while they are in 'Pending' status",
        });
      }
      // Authorized to cancel
    } else {
      // Not authorized
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order (Account mismatch)",
      });
    }

    // Before status update, check if we need to refund stock
    const isRefundStatus = (status.toLowerCase() === "cancelled" || status.toLowerCase() === "rejected");
    const wasRefundStatus = (order.status.toLowerCase() === "cancelled" || order.status.toLowerCase() === "rejected");

    if (isRefundStatus && !wasRefundStatus) {
      // Refund stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantityAvailable: item.quantity },
        });
      }
    }

    // Apply the update
    order.status = status.toLowerCase();
    await order.save();

    // Populate roles for the frontend before sending response
    const updatedOrder = await Order.findById(order._id)
      .populate("consumer", "name email phone")
      .populate("farmer", "name email phone")
      .populate({
        path: "items.product",
        select: "name images",
      });

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("consumer", "name")
      .populate("farmer", "name")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name images unit",
        },
      })
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete order (admin only)
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Refund stock if order wasn't already cancelled or rejected
    const needsRefund = (order.status.toLowerCase() !== "cancelled" && order.status.toLowerCase() !== "rejected");

    if (needsRefund) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantityAvailable: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order removed successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
