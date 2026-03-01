const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, relatedOrder } = req.body;

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content,
      relatedOrder,
    });

    // Populate sender and receiver for consistent frontend handling
    await message.populate("sender", "name role profileImage");
    await message.populate("receiver", "name role profileImage");

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
      deletedBy: { $ne: req.user._id }, // Filter out messages deleted by this user
    })
      .sort("createdAt")
      .populate("sender", "name role profileImage")
      .populate("receiver", "name role profileImage");

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      deletedBy: { $ne: req.user._id }, // Filter out messages deleted by this user
    })
      .sort("-createdAt")
      .populate("sender", "name role profileImage")
      .populate("receiver", "name role profileImage");

    const conversationsMap = {};

    messages.forEach((message) => {
      const otherUser =
        message.sender._id.toString() === req.user._id.toString()
          ? message.receiver
          : message.sender;

      const conversationId = otherUser._id.toString();

      if (!conversationsMap[conversationId]) {
        conversationsMap[conversationId] = {
          user: {
            _id: otherUser._id,
            name: otherUser.name,
            role: otherUser.role,
            profileImage: otherUser.profileImage,
          },
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            isRead: message.isRead,
          },
          unreadCount:
            message.receiver._id.toString() === req.user._id.toString() &&
            !message.isRead
              ? 1
              : 0,
        };
      } else if (
        message.receiver._id.toString() === req.user._id.toString() &&
        !message.isRead
      ) {
        conversationsMap[conversationId].unreadCount += 1;
      }
    });

    res.json({
      success: true,
      count: Object.keys(conversationsMap).length,
      data: Object.values(conversationsMap),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:userId
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Clear conversation for the current user
// @route   DELETE /api/messages/conversation/:userId
// @access  Private
exports.clearConversation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user._id;

    // Add current user to deletedBy array for all messages in this conversation
    await Message.updateMany(
      {
        $or: [
          { sender: currentUserId, receiver: userId },
          { sender: userId, receiver: currentUserId },
        ],
        deletedBy: { $ne: currentUserId },
      },
      {
        $push: { deletedBy: currentUserId },
      }
    );

    res.json({
      success: true,
      message: "Conversation cleared for you",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
