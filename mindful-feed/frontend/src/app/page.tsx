"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import FeedStack from "@/components/FeedStack";
import CategoryBar from "@/components/CategoryBar";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from("articles")
        .select("*")
        .order("relevance_score", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(30);

      if (category !== "all") query = query.eq("category", category);

      const { data } = await query;
      setArticles(data || []);
      setLoading(false);
    };
    load();
  }, [category]);

  return (
    <main className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      <CategoryBar active={category} onChange={setCategory} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/40 text-sm animate-pulse">Cargando tu feed…</div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <div className="text-5xl">🔮</div>
          <p className="text-white/60 text-sm">
            No hay artículos aún. Ejecuta el workflow de GitHub Actions para poblar el feed.
          </p>
        </div>
      ) : (
        <FeedStack articles={articles} />
      )}
    </main>
  );
}
