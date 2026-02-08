export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "to-do" | "in-progress" | "done";
  type: "personal" | "team";
  listCategory?: string;
  assignedTo: string;
  createdBy: string;
  completed: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "personal" | "team";
  tag: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  timeframe: "short-term" | "medium-term" | "long-term";
  progress: number;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}
