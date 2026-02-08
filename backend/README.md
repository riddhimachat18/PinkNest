# Todo Collaboration Backend

Node.js backend with MongoDB for a collaborative to-do list application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)
- PUT `/api/auth/updateprofile` - Update profile (protected)
- PUT `/api/auth/updatepassword` - Update password (protected)

### Tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks` - Get all tasks (with filters)
- GET `/api/tasks/:id` - Get single task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- PATCH `/api/tasks/:id/complete` - Mark complete

### Events
- POST `/api/events` - Create event
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event
- PATCH `/api/events/:id/complete` - Mark complete
- POST `/api/events/:id/followup` - Add follow-up task

### Goals
- POST `/api/goals` - Create goal
- GET `/api/goals` - Get all goals
- GET `/api/goals/:id` - Get single goal
- PUT `/api/goals/:id` - Update goal
- DELETE `/api/goals/:id` - Delete goal
- PATCH `/api/goals/:id/progress` - Update progress

### Messages
- POST `/api/messages` - Send message
- GET `/api/messages` - Get all messages
- PATCH `/api/messages/:id/read` - Mark as read
