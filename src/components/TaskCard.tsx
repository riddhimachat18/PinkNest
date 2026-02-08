import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { taskAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: any;
  onUpdate?: () => void;
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-accent/20 text-accent-foreground",
  low: "bg-secondary text-foreground/60",
};

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [completed, setCompleted] = useState(task.completed);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      if (!completed) {
        await taskAPI.completeTask(task._id);
      } else {
        await taskAPI.updateTask(task._id, { completed: false, status: 'to-do' });
      }
      setCompleted(!completed);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskAPI.deleteTask(task._id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      layout
      className={`flex items-start gap-3 p-3 rounded-xl bg-background hover:shadow-warm-sm transition-all ${
        completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={handleToggleComplete}
        disabled={loading}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
      >
        {completed && <Check size={12} className="text-primary-foreground" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-foreground ${completed ? "line-through" : ""}`}>
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <button
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
