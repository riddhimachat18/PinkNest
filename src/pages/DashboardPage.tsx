import { useState, useEffect } from "react";
import { CheckSquare, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import TaskCard from "@/components/TaskCard";
import { taskAPI, eventAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, eventsRes] = await Promise.all([
        taskAPI.getTasks({}),
        eventAPI.getEvents({})
      ]);
      setTasks(tasksRes.data.data);
      setEvents(eventsRes.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todaysTasks = tasks.filter((t: any) => !t.completed).slice(0, 4);
  const upcomingEvents = events.filter((e: any) => !e.completed);
  const teamTasksCount = tasks.filter((t: any) => t.type === "team").length;

  const stats = [
    { icon: CheckSquare, label: "Tasks Today", value: todaysTasks.length, color: "bg-primary/10 text-primary" },
    { icon: Clock, label: "Upcoming", value: upcomingEvents.length, color: "bg-accent/20 text-accent-foreground" },
    { icon: Users, label: "Team Tasks", value: teamTasksCount, color: "bg-secondary text-foreground" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {getGreeting()}, {user?.name}! ✨
        </h1>
        <p className="text-muted-foreground mt-1">{today}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-2xl p-5 shadow-warm-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-card rounded-2xl p-6 shadow-warm-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Today's Focus</h2>
        <div className="space-y-3">
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task: any) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchData} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No tasks for today. Great job! 🎉</p>
          )}
        </div>
      </motion.div>

      <motion.div
        className="bg-card rounded-2xl p-6 shadow-warm-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 5).map((event: any) => (
              <div
                key={event._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-background hover:shadow-warm-sm transition-shadow"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    event.type === "team" ? "bg-primary" : "bg-accent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-foreground/70">
                  {event.type === "team" ? "Team" : "Personal"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No upcoming events</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
