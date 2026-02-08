const express = require('express');
const router = express.Router();
const { createGoal, getGoals, getGoal, updateGoal, deleteGoal, updateProgress } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createGoal)
  .get(protect, getGoals);

router.route('/:id')
  .get(protect, getGoal)
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

router.patch('/:id/progress', protect, updateProgress);

module.exports = router;
