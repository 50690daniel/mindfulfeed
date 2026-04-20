import yaml
import time
import logging
from pathlib import Path
from fetcher.rss_reader import fetch_feed
from fetcher.summarizer import summarize_article
from fetcher.supabase_client import upsert_article, article_exists

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

FEEDS_PATH = Path(__file__).parent / "feeds.yaml"


def run():
    with open(FEEDS_PATH) as f:
        config = yaml.safe_load(f)

    total_processed = 0

    for category_key, category_data in config["categories"].items():
        label = category_data["label"]
        color = category_data["color"]
        emoji = category_data["emoji"]

        for feed_cfg in category_data["feeds"]:
            log.info(f"Fetching {feed_cfg['name']}...")
            try:
                articles = fetch_feed(feed_cfg["url"], max_items=5)
            except Exception as e:
                log.error(f"Failed to fetch {feed_cfg['url']}: {e}")
                continue

            for article in articles:
                if article_exists(article["id"]):
                    log.info(f"  Skip (exists): {article['title'][:50]}")
                    continue

                try:
                    ai_data = summarize_article(article["title"], article["raw_text"], label)
                except Exception as e:
                    log.error(f"  Claude error: {e}")
                    continue

                row = {
                    "id": article["id"],
                    "title": article["title"],
                    "summary": ai_data.get("summary", ""),
                    "actionable_tip": ai_data.get("actionable_tip", ""),
                    "relevance_score": ai_data.get("relevance_score", 5),
                    "tags": ai_data.get("tags", []),
                    "category": category_key,
                    "category_label": label,
                    "category_color": color,
                    "category_emoji": emoji,
                    "source_url": article["source_url"],
                    "source_name": feed_cfg["name"],
                    "image_url": article.get("image_url"),
                    "published_at": article["published_at"],
                }

                upsert_article(row)
                log.info(f"  ✓ Saved: {article['title'][:50]}")
                total_processed += 1
                time.sleep(0.5)  # Rate limit gentleness

    log.info(f"Done. {total_processed} new articles processed.")


if __name__ == "__main__":
    run()
