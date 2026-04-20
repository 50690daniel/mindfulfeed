-- Mindful Feed - Supabase Schema
-- Ejecuta esto en: Supabase Dashboard → SQL Editor → New query

create table if not exists articles (
  id                text primary key,
  title             text not null,
  summary           text,
  actionable_tip    text,
  relevance_score   smallint default 5 check (relevance_score between 1 and 10),
  tags              text[] default '{}',
  category          text not null,
  category_label    text,
  category_color    text,
  category_emoji    text,
  source_url        text,
  source_name       text,
  image_url         text,
  published_at      timestamptz,
  created_at        timestamptz default now(),
  is_saved          boolean default false,
  is_read           boolean default false
);

-- Índices para queries frecuentes
create index if not exists articles_category_idx    on articles(category);
create index if not exists articles_created_at_idx  on articles(created_at desc);
create index if not exists articles_relevance_idx   on articles(relevance_score desc);
create index if not exists articles_saved_idx       on articles(is_saved) where is_saved = true;

-- Row Level Security (datos públicos de lectura, escritura solo desde backend)
alter table articles enable row level security;

create policy "Anyone can read articles"
  on articles for select using (true);

-- RPC: marcar como leído
create or replace function mark_read(article_id text)
returns void language sql security definer as $$
  update articles set is_read = true where id = article_id;
$$;

-- RPC: toggle guardado
create or replace function toggle_saved(article_id text)
returns boolean language plpgsql security definer as $$
declare
  new_val boolean;
begin
  update articles
    set is_saved = not is_saved
    where id = article_id
    returning is_saved into new_val;
  return new_val;
end;
$$;
