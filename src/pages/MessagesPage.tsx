import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { messageAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MessagesPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages();
      setMessages(response.data.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    
    try {
      await messageAPI.sendMessage({ message: input.trim() });
      setInput("");
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
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
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
          TM
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground">Team Messages</h1>
          <span className="text-xs text-muted-foreground">{messages.length} messages</span>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto bg-card rounded-2xl p-4 shadow-warm-sm space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId._id === user?.id;
          return (
            <motion.div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  isMe
                    ? "gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-background text-foreground rounded-bl-md"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-semibold mb-1 opacity-70">{msg.senderId.name}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 bg-card rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
