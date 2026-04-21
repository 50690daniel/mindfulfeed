"use client";

const CATEGORIES = [
  { key: "all", label: "Todo", emoji: "🌐" },
  { key: "tech", label: "Tech", emoji: "💻" },
  { key: "programming", label: "Código", emoji: "🧑‍💻" },
  { key: "nutrition", label: "Nutrición", emoji: "🥗" },
  { key: "science", label: "Ciencia", emoji: "🔬" },
  { key: "productivity", label: "Foco", emoji: "🎯" },
  { key: "ia", label: "IA", emoji: "🤖" },
{ key: "news", label: "Noticias", emoji: "📰" },
];

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryBar({ active, onChange }: Props) {
  return (
    <div className="safe-top px-4 pt-2 pb-1 flex gap-2 overflow-x-auto scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
          style={{
            backgroundColor: active === cat.key ? "white" : "rgba(255,255,255,0.08)",
            color: active === cat.key ? "black" : "rgba(255,255,255,0.6)",
          }}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
