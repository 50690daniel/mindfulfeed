from groq import Groq
import json
import os

client = Groq(api_key=os.environ["GROQ_API_KEY"])

SYSTEM_PROMPT = """Eres un editor experto que convierte artículos en resúmenes ultra-concisos y accionables.
Devuelves SOLO un objeto JSON válido con esta estructura exacta:
{
  "summary": "Resumen en máximo 60 palabras. Directo, sin relleno.",
  "actionable_tip": "Un tip concreto que el lector puede aplicar esta semana. Máximo 25 palabras.",
  "relevance_score": 7,
  "tags": ["tag1", "tag2", "tag3"]
}
Nada más. Solo el JSON. Sin markdown, sin explicaciones."""

def summarize_article(title: str, raw_text: str, category: str) -> dict:
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Categoría: {category}\nTítulo: {title}\nContenido: {raw_text[:1500]}"}
        ],
        max_tokens=400,
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())
