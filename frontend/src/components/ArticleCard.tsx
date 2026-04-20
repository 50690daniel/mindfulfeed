"use client";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  summary: string;
  actionable_tip: string;
  relevance_score: number;
  tags: string[];
  category_label: string;
  category_color: string;
  category_emoji: string;
  source_name: string;
  source_url: string;
  image_url?: string;
  published_at: string;
}

interface Props {
  article: Article;
  onSave: (id: string) => void;
  isSaved: boolean;
}

export default function ArticleCard({ article, onSave, isSaved }: Props) {
  const readTime = Math.max(1, Math.ceil((article.summary?.length || 0) / 200));

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{
          background: article.image_url
            ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 60%), url(${article.image_url}) center/cover no-repeat`
            : `linear-gradient(135deg, ${article.category_color}22 0%, #000 100%)`,
        }}
      />

      {/* Colored top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: article.category_color }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-auto pt-2">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${article.category_color}33`, color: article.category_color }}
          >
            {article.category_emoji} {article.category_label}
          </span>
          <span className="text-white/40 text-xs">{readTime} min</span>
        </div>

        {/* Main content — pushed to bottom */}
        <div className="mt-auto space-y-4">
          {/* Relevance bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${article.relevance_score * 10}%`,
                  backgroundColor: article.category_color,
                }}
              />
            </div>
            <span className="text-white/40 text-xs">{article.relevance_score}/10</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight text-white line-clamp-3">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="text-white/75 text-sm leading-relaxed line-clamp-4">
            {article.summary}
          </p>

          {/* Actionable tip */}
          {article.actionable_tip && (
            <div
              className="rounded-xl p-3 backdrop-blur-sm"
              style={{ backgroundColor: `${article.category_color}20`, borderLeft: `3px solid ${article.category_color}` }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: article.category_color }}>
                💡 Tip accionable
              </p>
              <p className="text-white/80 text-sm">{article.actionable_tip}</p>
            </div>
          )}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 safe-bottom pb-4">
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-xl text-sm font-medium bg-white/10 text-white backdrop-blur-sm active:scale-95 transition-transform"
            >
              Leer completo →
            </a>
            <button
              onClick={() => onSave(article.id)}
              className="px-5 py-3 rounded-xl text-sm font-medium backdrop-blur-sm active:scale-95 transition-transform"
              style={{
                backgroundColor: isSaved ? article.category_color : "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
