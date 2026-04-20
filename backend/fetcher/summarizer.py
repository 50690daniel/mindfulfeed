import google.genai as genai
import json
import os

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

PROMPT_TEMPLATE = """Eres un editor experto que convierte artículos en resúmenes ultra-concisos y accionables.
Para cada artículo devuelves SOLO un objeto JSON válido con esta estructura exacta:
{{
  "summary": "Resumen en máximo 60 palabras. Directo, sin relleno.",
  "actionable_tip": "Un tip concreto que el lector puede aplicar esta semana. Máximo 25 palabras.",
  "relevance_score": 7,
  "tags": ["tag1", "tag2", "tag3"]
}}
Nada más. Solo el JSON. Sin markdown, sin explicaciones.

Categoría: {category}
Título: {title}
Contenido: {text}"""


def summarize_article(title: str, raw_text: str, category: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        category=category,
        title=title,
        text=raw_text[:1500]
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())
