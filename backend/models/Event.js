const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  type: {
    type: String,
    enum: ['personal', 'team'],
    required: true
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
  followUpTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.virtual('tag').get(function() {
  return this.type === 'team' ? 'Team Task' : `${this.createdBy.name}'s task`;
});

eventSchema.virtual('colorIndicator').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const hoursUntilEvent = Math.ceil((eventDate - now) / (1000 * 60 * 60));
  
  if (hoursUntilEvent < 0) return '#FF1744';
  if (hoursUntilEvent <= 24) return '#FF6F00';
  if (hoursUntilEvent <= 72) return '#FFC107';
  if (hoursUntilEvent <= 168) return '#66BB6A';
  return '#2E7D32';
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
