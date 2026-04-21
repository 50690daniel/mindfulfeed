import feedparser
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import hashlib
import httpx

def get_og_image(url: str) -> str | None:
    """Try to get og:image from article URL."""
    try:
        r = httpx.get(url, timeout=5, follow_redirects=True,
                      headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(r.text, "html.parser")
        tag = soup.find("meta", property="og:image") or soup.find("meta", attrs={"name": "twitter:image"})
        if tag:
            return tag.get("content")
    except Exception:
        pass
    return None

def fetch_feed(url: str, max_items: int = 5) -> list[dict]:
    feed = feedparser.parse(url)
    articles = []

    for entry in feed.entries[:max_items]:
        raw_html = entry.get("summary", entry.get("description", ""))
        soup = BeautifulSoup(raw_html, "html.parser")
        clean_text = soup.get_text(separator=" ", strip=True)[:2000]

        # Try RSS media first, then og:image scraping
        image_url = None
        if hasattr(entry, "media_content"):
            for media in entry.get("media_content", []):
                if media.get("type", "").startswith("image"):
                    image_url = media.get("url")
                    break
        if not image_url and hasattr(entry, "enclosures"):
            for enc in entry.get("enclosures", []):
                if enc.get("type", "").startswith("image"):
                    image_url = enc.get("url")
                    break
        if not image_url:
            image_url = get_og_image(entry.get("link", ""))

        article_id = hashlib.sha256(entry.get("link", entry.get("id", "")).encode()).hexdigest()[:16]
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        published_dt = datetime(*published[:6], tzinfo=timezone.utc).isoformat() if published else datetime.now(timezone.utc).isoformat()

        articles.append({
            "id": article_id,
            "title": entry.get("title", "Sin título")[:200],
            "raw_text": clean_text,
            "source_url": entry.get("link", ""),
            "image_url": image_url,
            "published_at": published_dt,
        })

    return articles
