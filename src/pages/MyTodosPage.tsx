import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskCard from "@/components/TaskCard";
import { Plus, FolderOpen } from "lucide-react";
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

const categories = ["All", "Academics", "Skill Building", "DSA Practice", "General"];

const MyTodosPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    listCategory: "General",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks({ type: "personal" });
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
        type: "personal",
      });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        listCategory: "General",
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

  const filtered = activeCategory === "All"
    ? tasks
    : tasks.filter((t: any) => t.listCategory === activeCategory);

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
        <h1 className="font-heading text-2xl font-bold text-foreground">My To-Do Lists</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <Plus size={16} /> Add Task
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
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
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.listCategory} onValueChange={(value) => setFormData({ ...formData, listCategory: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-accent/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-warm-sm">
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((task: any) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading text-lg font-bold text-foreground">No tasks yet</p>
            <p className="text-muted-foreground text-sm mt-1">Add your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTodosPage;
