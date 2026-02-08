const Message = require('../models/Message');

exports.sendMessage = async (req, res, next) => {
  try {
    req.body.senderId = req.user.id;

    const message = await Message.create(req.body);
    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name email profilePicture');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'name email profilePicture')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.read = true;
    await message.save();

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name email profilePicture');

    res.status(200).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};
