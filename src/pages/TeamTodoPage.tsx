import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskCard from "@/components/TaskCard";
import { Plus } from "lucide-react";
import { taskAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamTodoPage = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks({ type: "team" });
      setTasks(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...formData,
        type: "team",
      });
      toast({
        title: "Success",
        description: "Team task created successfully",
      });
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const filtered = tasks.filter((t: any) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const filters = ["all", "active", "completed"] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Team To-Do</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <Plus size={16} /> Add Task
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
              filter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-accent/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-warm-sm">
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((task: any) => <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-heading text-lg font-bold text-foreground">You're all caught up!</p>
              <p className="text-muted-foreground text-sm mt-1">No tasks here. Time to celebrate!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamTodoPage;
