import os
from supabase import create_client, Client

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_KEY"]
        _client = create_client(url, key)
    return _client


def upsert_article(article: dict) -> None:
    """Insert or update an article. Idempotent — safe to run multiple times."""
    client = get_client()
    client.table("articles").upsert(article, on_conflict="id").execute()


def article_exists(article_id: str) -> bool:
    """Check if article already processed."""
    client = get_client()
    res = client.table("articles").select("id").eq("id", article_id).execute()
    return len(res.data) > 0
