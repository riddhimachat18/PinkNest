const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask, completeTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/complete', protect, completeTask);

module.exports = router;
