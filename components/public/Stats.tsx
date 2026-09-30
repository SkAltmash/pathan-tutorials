"use client";
import { useState, useEffect, useRef } from "react";
import { Clock, Users, TrendingUp, Trophy } from "lucide-react";

const STATS = [
  { icon: Clock,       number: "10+",  suffix: "",  title: "Years of Experience" },
  { icon: Users,       number: "500+", suffix: "",  title: "Students Taught"     },
  { icon: TrendingUp,  number: "95",   suffix: "%", title: "Success Rate"        },
  { icon: Trophy,      number: "100+", suffix: "",  title: "Top Scorers"         },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  icon: Icon, number, suffix, title, index, visible,
}: { icon: React.ComponentType<{ size?: number; className?: string }>; number: string; suffix: string; title: string; index: number; visible: boolean }) {
  const num = parseInt(number.replace(/\D/g, "")) || 0;
  const count = useCountUp(num, 2000, visible);

  return (
    <div
      className="flex flex-col items-center text-center p-6 card-glass animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Icon size={26} className="text-primary" />
      </div>
      <p className="font-display text-4xl font-900 gradient-text mb-1">
        {visible ? count : 0}{suffix}
      </p>
      <p className="text-sm font-600 text-[var(--text-secondary)]">{title}</p>
    </div>
  );
}

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="section-padding-sm bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.title} {...stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
