# Kiro Prompt: Backend Integration for Collaborative To-Do List App

## Project Overview
Build a Node.js backend with MongoDB integration for a collaborative to-do list application for two team members. The backend should handle authentication, data persistence, and real-time updates for tasks, events, goals, and messaging.

## Technology Stack
- **Runtime**: Node.js (v18+ recommended)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator or Joi
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## Project Structure
```
backend/
├── server.js                 # Entry point
├── .env                      # Environment variables
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Task.js              # Task schema (personal & team)
│   ├── Event.js             # Calendar event schema
│   ├── Goal.js              # Goal schema
│   └── Message.js           # Message schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── tasks.js             # Task CRUD routes
│   ├── events.js            # Event CRUD routes
│   ├── goals.js             # Goal CRUD routes
│   └── messages.js          # Messaging routes
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   ├── eventController.js
│   ├── goalController.js
│   └── messageController.js
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
└── package.json
```

## Database Setup

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-collab-app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-collab-app
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### MongoDB Connection (config/db.js)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Data Models (Mongoose Schemas)

### 1. User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  profilePicture: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 2. Task Model (models/Task.js)
```javascript
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
    default: 'General' // e.g., 'Academics', 'Skill Building', 'DSA'
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

// Update the updatedAt field on save
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field for color indicator based on time remaining
taskSchema.virtual('colorIndicator').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return '#FF1744'; // Overdue - Red
  if (daysUntilDue <= 2) return '#FF6F00'; // 2 days or less - Deep Orange
  if (daysUntilDue <= 7) return '#FFC107'; // Within a week - Amber
  if (daysUntilDue <= 14) return '#66BB6A'; // 2 weeks - Green
  return '#2E7D32'; // More than 2 weeks - Dark Green
});

// Ensure virtuals are included when converting to JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
```

### 3. Event Model (models/Event.js)
```javascript
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
    type: Date // For multi-day events
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

// Virtual field for tag display
eventSchema.virtual('tag').get(function() {
  return this.type === 'team' ? 'Team Task' : `${this.createdBy.name}'s task`;
});

// Virtual field for color indicator
eventSchema.virtual('colorIndicator').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const hoursUntilEvent = Math.ceil((eventDate - now) / (1000 * 60 * 60));
  
  if (hoursUntilEvent < 0) return '#FF1744'; // Past - Red
  if (hoursUntilEvent <= 24) return '#FF6F00'; // Within 24 hours - Deep Orange
  if (hoursUntilEvent <= 72) return '#FFC107'; // Within 3 days - Amber
  if (hoursUntilEvent <= 168) return '#66BB6A'; // Within a week - Green
  return '#2E7D32'; // More than a week - Dark Green
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
```

### 4. Goal Model (models/Goal.js)
```javascript
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  timeframe: {
    type: String,
    enum: ['short-term', 'medium-term', 'long-term'],
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
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

goalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
```

### 5. Message Model (models/Message.js)
```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
```

## API Routes & Controllers

### Authentication Routes (routes/auth.js)
**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/updateprofile` - Update user profile (protected)
- `PUT /api/auth/updatepassword` - Change password (protected)

**Controller Logic (controllers/authController.js):**
```javascript
// Register User
- Validate input (name, email, password)
- Check if user already exists
- Create user with hashed password
- Generate JWT token
- Return user data and token

// Login User
- Validate email and password
- Check if user exists
- Verify password using bcrypt
- Generate JWT token
- Return user data and token

// Get Current User
- Verify JWT from request header
- Return user data (exclude password)

// Update Profile
- Allow updating name, profile picture
- Validate input
- Update user in database
- Return updated user

// Update Password
- Verify current password
- Hash new password
- Update in database
```

### Task Routes (routes/tasks.js)
**Endpoints:**
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks` - Get all tasks (filtered by user/team) (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/complete` - Mark task as complete (protected)

**Query Parameters for GET /api/tasks:**
- `type` - Filter by personal or team
- `listCategory` - Filter by category (Academics, DSA, etc.)
- `status` - Filter by status (to-do, in-progress, done)
- `priority` - Filter by priority
- `completed` - Filter completed/incomplete

**Controller Logic:**
```javascript
// Create Task
- Validate input
- Set createdBy to current user
- If type is 'team', allow both users to access
- Save to database
- Return created task with colorIndicator

// Get Tasks
- Apply filters based on query params
- If type is 'personal', return only current user's tasks
- If type is 'team', return all team tasks
- Populate createdBy and assignedTo fields
- Return tasks with colorIndicator

// Update Task
- Verify user has permission (creator or team task)
- Update fields
- Return updated task

// Delete Task
- Verify user has permission
- Delete from database

// Complete Task
- Set completed to true
- Set completedAt to current date
- Return updated task
```

### Event Routes (routes/events.js)
**Endpoints:**
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get all events (protected)
- `GET /api/events/:id` - Get single event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `PATCH /api/events/:id/complete` - Mark event as complete (protected)
- `POST /api/events/:id/followup` - Add follow-up task (protected)

**Query Parameters:**
- `type` - personal or team
- `startDate` - Filter events from date
- `endDate` - Filter events to date
- `completed` - Filter by completion status

**Controller Logic:**
```javascript
// Create Event
- Validate input
- Save event
- Return with colorIndicator and tag

// Get Events
- Filter by date range if provided
- Filter by type (personal/team)
- Populate createdBy for tag generation
- Return events with virtual fields

// Complete Event
- Mark as completed
- Set completedAt

// Add Follow-up Task
- Create a new task linked to the event
- Add task ID to followUpTasks array
```

### Goal Routes (routes/goals.js)
**Endpoints:**
- `POST /api/goals` - Create goal (protected)
- `GET /api/goals` - Get all user's goals (protected)
- `GET /api/goals/:id` - Get single goal (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)
- `PATCH /api/goals/:id/progress` - Update progress (protected)

**Query Parameters:**
- `timeframe` - Filter by short-term, medium-term, long-term

**Controller Logic:**
```javascript
// Create Goal
- Validate input
- Determine timeframe based on targetDate
- Save goal linked to current user

// Get Goals
- Return only current user's goals
- Filter by timeframe if specified
- Sort by targetDate

// Update Progress
- Update progress percentage
- If progress reaches 100, set completed to true
```

### Message Routes (routes/messages.js)
**Endpoints:**
- `POST /api/messages` - Send message (protected)
- `GET /api/messages` - Get all messages (protected)
- `PATCH /api/messages/:id/read` - Mark message as read (protected)

**Controller Logic:**
```javascript
// Send Message
- Validate message content
- Save with senderId as current user
- Populate sender info
- Return message

// Get Messages
- Return all messages (both users can see all)
- Populate sender information
- Sort by createdAt (newest first or oldest first)
- Return with sender name

// Mark as Read
- Update read status to true
```

## Middleware

### Authentication Middleware (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
```

### Error Handler Middleware (middleware/errorHandler.js)
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging
  console.error(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

## Server Setup (server.js)
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/events', require('./routes/events'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/messages', require('./routes/messages'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Package.json Dependencies
```json
{
  "name": "todo-collab-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Installation & Setup Instructions

### 1. Initialize Project
```bash
mkdir todo-collab-backend
cd todo-collab-backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator
npm install --save-dev nodemon
```

### 3. MongoDB Setup
**Option A: Local MongoDB**
- Install MongoDB on your machine
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/todo-collab-app`

**Option B: MongoDB Atlas (Cloud)**
- Create account at mongodb.com/atlas
- Create a cluster
- Get connection string
- Add to .env file

### 4. Create Folder Structure
Create all folders and files as per the structure above.

### 5. Environment Variables
Create `.env` file with necessary variables.

### 6. Run Server
```bash
npm run dev
```

## Testing the API

### Using Postman/Thunder Client:

**1. Register User**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**2. Login User**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
Response includes: token
```

**3. Create Task (with token)**
```
POST http://localhost:5000/api/tasks
Headers:
Authorization: Bearer <your_token_here>
Body (JSON):
{
  "title": "Complete React project",
  "description": "Build the to-do app frontend",
  "dueDate": "2024-02-20",
  "priority": "high",
  "type": "personal",
  "listCategory": "Academics"
}
```

**4. Get Tasks**
```
GET http://localhost:5000/api/tasks?type=personal
Headers:
Authorization: Bearer <your_token_here>
```

## Frontend Integration Guide

### 1. API Service Setup (Frontend)
Create an API service file:

```javascript
// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data)
};

// Task API
export const taskAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.patch(`/tasks/${id}/complete`)
};

// Event API
export const eventAPI = {
  createEvent: (eventData) => api.post('/events', eventData),
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  completeEvent: (id) => api.patch(`/events/${id}/complete`),
  addFollowUp: (id, taskData) => api.post(`/events/${id}/followup`, taskData)
};

// Goal API
export const goalAPI = {
  createGoal: (goalData) => api.post('/goals', goalData),
  getGoals: (params) => api.get('/goals', { params }),
  getGoal: (id) => api.get(`/goals/${id}`),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  updateProgress: (id, progress) => api.patch(`/goals/${id}/progress`, { progress })
};

// Message API
export const messageAPI = {
  sendMessage: (messageData) => api.post('/messages', messageData),
  getMessages: () => api.get('/messages'),
  markAsRead: (id) => api.patch(`/messages/${id}/read`)
};

export default api;
```

### 2. Authentication Context (Frontend)
```javascript
// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to load user', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt before storing
2. **JWT Tokens**: Use secure, random JWT_SECRET in production
3. **CORS**: Configure CORS to allow only your frontend domain in production
4. **Input Validation**: Validate all inputs using express-validator
5. **Rate Limiting**: Consider adding rate limiting for login/register endpoints
6. **HTTPS**: Use HTTPS in production
7. **Environment Variables**: Never commit .env to version control

## Deployment Considerations

### For Production:
1. Use MongoDB Atlas for database hosting
2. Deploy backend to Heroku, Railway, or DigitalOcean
3. Set production environment variables
4. Enable CORS only for your frontend domain
5. Use process.env.NODE_ENV to differentiate dev/prod
6. Add logging (Winston or Morgan)
7. Set up error monitoring (Sentry)

## Additional Features to Implement (Optional)

1. **Email Verification**: Send verification email on registration
2. **Password Reset**: Forgot password functionality
3. **Profile Picture Upload**: Integrate with AWS S3 or Cloudinary
4. **Real-time Updates**: Implement Socket.io for live messaging
5. **Notifications**: Email or push notifications for deadlines
6. **Task Attachments**: Allow file uploads with tasks
7. **Activity Log**: Track all user actions
8. **Task Comments**: Allow commenting on team tasks
9. **Search Functionality**: Full-text search across tasks/events
10. **Analytics**: Dashboard with statistics and charts

## Summary

This backend provides:
✅ User authentication with JWT
✅ CRUD operations for tasks, events, goals, messages
✅ Color-coded priority/urgency indicators
✅ Personal and team task separation
✅ MongoDB data persistence
✅ Secure password hashing
✅ Protected routes
✅ Error handling
✅ Easy frontend integration

Start by setting up the basic server, models, and authentication. Then progressively add task, event, goal, and message functionality. Test each endpoint before integrating with the frontend.
