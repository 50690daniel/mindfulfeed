"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import ArticleCard from "./ArticleCard";
import { createClient } from "@/lib/supabase";

export default function FeedStack({ articles }: { articles: any[] }) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [exitDir, setExitDir] = useState<"up" | "right" | null>(null);

  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-150, 150], [-8, 8]);
  const opacity = useTransform(y, [-200, 0], [0, 1]);

  const next = useCallback(() => {
    setExitDir("up");
    setTimeout(() => {
      setIndex((i) => Math.min(i + 1, articles.length - 1));
      setExitDir(null);
      y.set(0);
      x.set(0);
    }, 300);
  }, [articles.length, y, x]);

  const handleSave = useCallback(async (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      const supabase = createClient();
      await supabase.rpc("toggle_saved", { article_id: id });
    } catch (_) {}
  }, []);

  const handleDragEnd = useCallback(
    (_: any, info: any) => {
      if (info.offset.y < -80) {
        next();
      } else if (info.offset.x > 100) {
        handleSave(articles[index]?.id);
        setExitDir("right");
        setTimeout(() => {
          setIndex((i) => Math.min(i + 1, articles.length - 1));
          setExitDir(null);
          y.set(0);
          x.set(0);
        }, 300);
      } else {
        y.set(0);
        x.set(0);
      }
    },
    [articles, index, next, handleSave, y, x]
  );

  if (index >= articles.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
        <div className="text-5xl">✨</div>
        <p className="text-white/60 text-sm">Has leído todo por ahora. Vuelve más tarde.</p>
      </div>
    );
  }

  const article = articles[index];

  return (
    <div className="flex-1 relative px-4 pb-4 overflow-hidden">
      {/* Progress dots */}
      <div className="flex gap-1 justify-center mb-3">
        {articles.slice(0, Math.min(articles.length, 8)).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all"
            style={{
              width: i === index ? 20 : 6,
              backgroundColor: i === index ? "white" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
        {articles.length > 8 && (
          <span className="text-white/30 text-xs ml-1">+{articles.length - 8}</span>
        )}
      </div>

      {/* Hint */}
      <p className="text-center text-white/20 text-xs mb-2">
        ↑ siguiente · → guardar
      </p>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={article.id}
          className="absolute inset-4 top-14"
          style={{ y, x, rotateZ, opacity }}
          drag
          dragConstraints={{ top: 0, bottom: 50, left: -50, right: 200 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: exitDir === "right" ? 400 : 0,
            y: exitDir === "up" ? -800 : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          whileTap={{ cursor: "grabbing" }}
        >
          <ArticleCard
            article={article}
            onSave={handleSave}
            isSaved={saved.has(article.id)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
