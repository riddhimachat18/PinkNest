const Event = require('../models/Event');
const Task = require('../models/Task');

exports.createEvent = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const event = await Event.create(req.body);
    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const { type, startDate, endDate, completed } = req.query;

    let query = {};

    if (type === 'personal') {
      query.createdBy = req.user.id;
      query.type = 'personal';
    } else if (type === 'team') {
      query.type = 'team';
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (completed !== undefined) query.completed = completed === 'true';

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('followUpTasks')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('followUpTasks');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.type === 'personal' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email').populate('followUpTasks');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.type === 'personal' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.completeEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.completed = true;
    event.completedAt = Date.now();
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('followUpTasks');

    res.status(200).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};

exports.addFollowUpTask = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    req.body.createdBy = req.user.id;
    const task = await Task.create(req.body);

    event.followUpTasks.push(task._id);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('followUpTasks');

    res.status(201).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};
