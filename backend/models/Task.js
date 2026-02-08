const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'done'],
    default: 'to-do'
  },
  type: {
    type: String,
    enum: ['personal', 'team'],
    required: true
  },
  listCategory: {
    type: String,
    default: 'General'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

taskSchema.virtual('colorIndicator').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return '#FF1744';
  if (daysUntilDue <= 2) return '#FF6F00';
  if (daysUntilDue <= 7) return '#FFC107';
  if (daysUntilDue <= 14) return '#66BB6A';
  return '#2E7D32';
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
