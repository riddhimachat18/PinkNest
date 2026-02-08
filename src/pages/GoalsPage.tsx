import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import { goalAPI } from "@/services/api";
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

const timeframes = [
  { key: "short-term", label: "Short-term Goals", subtitle: "Next 3 months" },
  { key: "medium-term", label: "Medium-term Goals", subtitle: "3-12 months" },
  { key: "long-term", label: "Long-term Goals", subtitle: "1+ years" },
];

const GoalsPage = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    timeframe: "short-term",
    progress: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getGoals({});
      setGoals(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalAPI.createGoal(formData);
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        targetDate: "",
        timeframe: "short-term",
        progress: 0,
      });
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create goal",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="font-heading text-2xl font-bold text-foreground">Goals</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <Plus size={16} /> Add Goal
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
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
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={formData.timeframe} onValueChange={(value) => setFormData({ ...formData, timeframe: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-term">Short-term (0-3 months)</SelectItem>
                    <SelectItem value="medium-term">Medium-term (3-12 months)</SelectItem>
                    <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="space-y-6">
        {timeframes.map((tf, i) => {
          const filteredGoals = goals.filter((g) => g.timeframe === tf.key);
          return (
            <motion.div
              key={tf.key}
              className="bg-card rounded-2xl p-6 shadow-warm-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">{tf.label}</h2>
                <span className="text-xs text-muted-foreground">({tf.subtitle})</span>
              </div>

              {filteredGoals.length > 0 ? (
                <div className="space-y-4">
                  {filteredGoals.map((goal) => (
                    <div key={goal._id} className="p-4 rounded-xl bg-background">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{goal.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full rounded-full gradient-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-xs font-bold text-primary">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-6">No goals yet. Set one!</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsPage;
