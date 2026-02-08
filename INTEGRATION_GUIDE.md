# PinkNest - Frontend & Backend Integration Guide

## 🚀 Quick Start

### Backend Server (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### Frontend Server (Port 8081)
```bash
npm install
npm run dev
```

## ✅ What's Been Integrated

### 1. Authentication System
- **Login/Register**: Full JWT authentication with backend
- **Protected Routes**: All dashboard routes require authentication
- **User Context**: Global auth state management with React Context
- **Auto-redirect**: Unauthenticated users redirected to /auth

### 2. API Services (`src/services/api.js`)
- Axios instance with automatic JWT token injection
- API endpoints for:
  - Authentication (register, login, profile)
  - Tasks (CRUD operations)
  - Events (calendar management)
  - Goals (progress tracking)
  - Messages (team communication)

### 3. Pages Integrated with Backend

#### My To-Do Page
- Fetch personal tasks from API
- Create new tasks with dialog form
- Update task status (complete/incomplete)
- Delete tasks
- Filter by category
- Real-time color indicators based on due date

#### Team To-Do Page
- Fetch team tasks from API
- Create team tasks
- Filter by status (all/active/completed)
- Collaborative task management

#### Messages Page
- Real-time message fetching (polls every 5 seconds)
- Send messages to team
- Display sender information
- Auto-scroll to latest message

#### Dashboard Layout
- Display logged-in user name and initials
- Logout functionality
- Protected navigation

## 🔑 Key Features

### Authentication Flow
1. User registers/logs in at `/auth`
2. JWT token stored in localStorage
3. Token automatically attached to all API requests
4. User data loaded and stored in AuthContext
5. Protected routes check authentication status

### Task Management
- Color-coded priority indicators
- Due date tracking with visual feedback
- Personal vs Team task separation
- Category-based organization
- Complete/incomplete status tracking

### Real-time Updates
- Messages auto-refresh every 5 seconds
- Task lists refresh after create/update/delete operations
- Optimistic UI updates for better UX

## 📁 Project Structure

```
src/
├── services/
│   └── api.js                 # API service layer
├── context/
│   └── AuthContext.jsx        # Authentication context
├── components/
│   ├── ProtectedRoute.jsx     # Route protection
│   ├── TaskCard.tsx           # Task component with API integration
│   └── DashboardLayout.tsx    # Layout with user info
├── pages/
│   ├── AuthPage.tsx           # Login/Register
│   ├── MyTodosPage.tsx        # Personal tasks
│   ├── TeamTodoPage.tsx       # Team tasks
│   └── MessagesPage.tsx       # Team messaging
└── App.tsx                    # Main app with routing

backend/
├── models/                    # MongoDB schemas
├── controllers/               # Business logic
├── routes/                    # API endpoints
├── middleware/                # Auth & error handling
└── server.js                  # Express server
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend
API URL is configured in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 🧪 Testing the Integration

1. **Register a new user**:
   - Go to http://localhost:8081/auth
   - Click "Sign Up"
   - Enter name, email, password
   - Should redirect to dashboard

2. **Create a personal task**:
   - Go to "My To-Do"
   - Click "Add Task"
   - Fill in task details
   - Task should appear in the list

3. **Create a team task**:
   - Go to "Team To-Do"
   - Click "Add Task"
   - Task visible to all team members

4. **Send a message**:
   - Go to "Messages"
   - Type and send a message
   - Should appear in the chat

## 🎨 UI Components Used

- **shadcn/ui**: Dialog, Input, Button, Select, Textarea, Label
- **Framer Motion**: Animations and transitions
- **Lucide Icons**: Icon library
- **React Router**: Navigation
- **TanStack Query**: Data fetching (configured but not fully utilized yet)

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS enabled for frontend
- Input validation on backend
- Error handling middleware

## 📝 Next Steps (Optional Enhancements)

1. **Goals Page Integration**: Connect goals CRUD operations
2. **Calendar Page Integration**: Connect events API
3. **Profile Page**: Update user profile and password
4. **Real-time with Socket.io**: Replace polling with WebSocket
5. **File Uploads**: Add profile pictures and task attachments
6. **Notifications**: Toast notifications for task deadlines
7. **Search & Filters**: Advanced filtering and search
8. **Analytics Dashboard**: Task completion statistics

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB Atlas IP whitelist
- Verify connection string in .env
- Ensure MongoDB cluster is running

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure API_URL is correct in api.js

### Authentication not working
- Clear localStorage and try again
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in request headers

## 🎉 Success!

Your PinkNest app is now fully integrated with:
- ✅ User authentication
- ✅ Task management (personal & team)
- ✅ Real-time messaging
- ✅ MongoDB data persistence
- ✅ Protected routes
- ✅ Beautiful UI with animations

Access your app at: http://localhost:8081
