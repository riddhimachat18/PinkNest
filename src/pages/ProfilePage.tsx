import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, CalendarDays, CheckCircle2, ListTodo, Users, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    profilePicture: user?.profilePicture || "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks({});
      setTasks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = tasks.filter((t: any) => t.completed).length;
  const activeCount = tasks.filter((t: any) => !t.completed).length;
  const teamCount = tasks.filter((t: any) => t.type === "team").length;

  const stats = [
    { icon: CheckCircle2, label: "Completed", value: completedCount },
    { icon: ListTodo, label: "Active", value: activeCount },
    { icon: Users, label: "Team Tasks", value: teamCount },
  ];

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div
        className="bg-card rounded-2xl p-8 shadow-warm-sm text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
          {getUserInitials()}
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{user?.name}</h1>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-muted-foreground text-sm">
          <Mail size={14} />
          {user?.email}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1 text-muted-foreground text-sm">
          <CalendarDays size={14} />
          Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-warm-sm text-center">
            <s.icon size={20} className="mx-auto text-primary mb-1" />
            <p className="text-xl font-bold font-heading text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="w-full gradient-primary text-primary-foreground py-3 rounded-full font-heading font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Edit size={16} />
              Edit Profile
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                  id="profilePicture"
                  value={formData.profilePicture}
                  onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button className="w-full" onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Profile update feature will be available soon",
                });
                setDialogOpen(false);
              }}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
