import { motion } from "framer-motion";
import { Calendar, CheckSquare, Target, MessageCircle, ArrowRight, Star, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

const features = [
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Visualize deadlines with color-coded priorities and never miss a date.",
  },
  {
    icon: CheckSquare,
    title: "Collaborative Tasks",
    description: "Work seamlessly with your teammate on shared to-do lists.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Plan your short, medium, and long-term success together.",
  },
  {
    icon: MessageCircle,
    title: "Quick Messaging",
    description: "Stay connected and aligned with built-in team chat.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md shadow-warm-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-foreground">
            🌸 PinkNest
          </h1>
          <Link
            to="/auth"
            className="gradient-primary text-primary-foreground px-6 py-2 rounded-full font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero pt-28 pb-16 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-24 left-10 text-primary/30"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Star size={20} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 text-primary/20"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          <Cloud size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-primary/20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Star size={14} fill="currentColor" />
        </motion.div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={heroImage}
              alt="Two friends collaborating on a to-do list"
              className="mx-auto w-full max-w-lg mb-8 rounded-2xl"
            />
          </motion.div>

          <motion.h2
            className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Achieve Together, Succeed Together
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            A cozy space for you and your teammate to plan, track, and celebrate every win.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/auth"
              className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-full font-heading font-bold text-lg hover:opacity-90 transition-all hover:scale-[1.02] inline-flex items-center gap-2 shadow-warm-md"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            className="font-heading text-3xl font-bold text-center text-foreground mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything you need to stay on track
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-background rounded-2xl p-6 shadow-warm-sm hover:shadow-warm-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon size={22} className="text-primary-foreground" />
                </div>
                <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-6 gradient-bg">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            className="font-heading text-2xl font-semibold text-foreground italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            "Alone we can do so little; together we can do so much."
          </motion.p>
          <p className="text-muted-foreground mt-3 text-sm">— Helen Keller</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-10 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <h4 className="font-heading text-lg font-bold text-foreground mb-1">🌸 PinkNest</h4>
          <p className="text-muted-foreground text-sm">
            Your cozy corner for collaborative productivity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
