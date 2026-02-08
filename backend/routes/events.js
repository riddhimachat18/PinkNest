const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, completeEvent, addFollowUpTask } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createEvent)
  .get(protect, getEvents);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.patch('/:id/complete', protect, completeEvent);
router.post('/:id/followup', protect, addFollowUpTask);

module.exports = router;
