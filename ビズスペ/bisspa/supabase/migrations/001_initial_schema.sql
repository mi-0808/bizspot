-- BisSpa initial schema migration
-- Run this in Supabase SQL Editor

-- ─────────────────────────────────────────────────────────────
-- space_scores: ユーザーが投稿したスペース評価スコア
-- ─────────────────────────────────────────────────────────────
create table if not exists public.space_scores (
  id            uuid primary key default gen_random_uuid(),
  place_id      text not null,
  user_id       uuid not null references auth.users(id) on delete cascade,
  quietness     smallint check (quietness between 1 and 5),      -- 静粛性
  wifi_quality  smallint check (wifi_quality between 1 and 5),   -- Wi-Fi品質
  power_outlet  smallint check (power_outlet between 1 and 5),   -- 電源の有無
  congestion    smallint check (congestion between 1 and 5),     -- 混雑度
  price_score   smallint check (price_score between 1 and 5),    -- 料金
  stay_friendly smallint check (stay_friendly between 1 and 5),  -- 長居しやすさ
  note          text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (place_id, user_id)
);

-- 平均スコアのビュー
create or replace view public.space_score_averages as
  select
    place_id,
    count(*)                          as score_count,
    round(avg(quietness)::numeric, 2) as avg_quietness,
    round(avg(wifi_quality)::numeric, 2) as avg_wifi_quality,
    round(avg(power_outlet)::numeric, 2) as avg_power_outlet,
    round(avg(congestion)::numeric, 2)   as avg_congestion,
    round(avg(price_score)::numeric, 2)  as avg_price_score,
    round(avg(stay_friendly)::numeric, 2) as avg_stay_friendly
  from public.space_scores
  group by place_id;

-- RLS
alter table public.space_scores enable row level security;

create policy "誰でもスコアを閲覧できる"
  on public.space_scores for select using (true);

create policy "ログイン済みユーザーは自分のスコアを投稿できる"
  on public.space_scores for insert
  with check (auth.uid() = user_id);

create policy "ログイン済みユーザーは自分のスコアを更新できる"
  on public.space_scores for update
  using (auth.uid() = user_id);

create policy "ログイン済みユーザーは自分のスコアを削除できる"
  on public.space_scores for delete
  using (auth.uid() = user_id);

-- updated_at 自動更新トリガー
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger space_scores_updated_at
  before update on public.space_scores
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- favorites: お気に入りスペース
-- ─────────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  place_id   text not null,
  place_name text not null,
  place_type text,
  added_at   timestamptz default now(),
  unique (user_id, place_id)
);

alter table public.favorites enable row level security;

create policy "ユーザーは自分のお気に入りのみ操作できる"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- history: 閲覧・訪問履歴
-- ─────────────────────────────────────────────────────────────
create table if not exists public.history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  place_id    text not null,
  place_name  text not null,
  place_type  text,
  action      text not null check (action in ('viewed', 'visited')),
  occurred_at timestamptz default now()
);

create index if not exists history_user_idx on public.history (user_id, occurred_at desc);

alter table public.history enable row level security;

create policy "ユーザーは自分の履歴のみ操作できる"
  on public.history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
