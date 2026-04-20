import google.generativeai as genai
import json
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_PROMPT = """Eres un editor experto que convierte artículos en resúmenes ultra-concisos y accionables.
Para cada artículo devuelves SOLO un objeto JSON válido con esta estructura exacta:
{
  "summary": "Resumen en máximo 60 palabras. Directo, sin relleno.",
  "actionable_tip": "Un tip concreto que el lector puede aplicar esta semana. Máximo 25 palabras.",
  "relevance_score": 7,
  "tags": ["tag1", "tag2", "tag3"]
}
Nada más. Solo el JSON. Sin markdown, sin explicaciones."""


def summarize_article(title: str, raw_text: str, category: str) -> dict:
    """Call Gemini to summarize an article. Returns parsed JSON dict."""
    prompt = f"""{SYSTEM_PROMPT}

Categoría: {category}
Título: {title}
Contenido: {raw_text[:1500]}"""

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw.strip())
