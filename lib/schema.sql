-- ============================================================
-- ENCORE MVP — SUPABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- Project Settings → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────
-- Auto-created when a user signs up via Supabase Auth
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  email       text,
  countries   text[]    default '{}',   -- e.g. ['MY','SG']
  show_count  int       default 0,
  review_count int      default 0,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── SHOWS ──────────────────────────────────────────────────
create table public.shows (
  id              uuid default uuid_generate_v4() primary key,
  artist          text not null,
  venue           text not null,
  city            text not null,
  country         text not null,               -- MY, SG, TH, ID, PH
  date            date not null,
  date_display    text not null,               -- human readable
  price           text,
  genre           text,
  type            text not null check (type in ('gig','concert','festival','multi-night')),
  promoter        text,
  promoter_slug   text,
  description     text,
  venue_address   text,
  venue_maps_url  text,
  venue_transport text,
  ticket_url      text,
  is_published    boolean default false,
  review_count    int default 0,
  going_count     int default 0,
  comment_count   int default 0,
  avg_rating      numeric(3,2) default 0,
  created_at      timestamptz default now()
);

alter table public.shows enable row level security;

create policy "Anyone can view published shows"
  on public.shows for select
  using (is_published = true);

-- ─── REVIEWS ────────────────────────────────────────────────
create table public.reviews (
  id                uuid default uuid_generate_v4() primary key,
  show_id           uuid references public.shows(id) on delete cascade not null,
  user_id           uuid references public.profiles(id) on delete cascade not null,
  rating            int not null check (rating between 1 and 5),
  headline          text not null,
  body              text,
  sound             int check (sound between 1 and 5),
  visuals           int check (visuals between 1 and 5),
  setlist           int check (setlist between 1 and 5),
  crowd             int check (crowd between 1 and 5),
  event_management  int check (event_management between 1 and 5),
  vibes             text[]   default '{}',
  photos            text[]   default '{}',     -- Supabase Storage URLs
  est_attendance    int,
  created_at        timestamptz default now(),
  unique (show_id, user_id)                    -- one review per user per show
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Keep show avg_rating + review_count in sync
create or replace function public.update_show_rating()
returns trigger as $$
begin
  update public.shows
  set
    avg_rating   = (select round(avg(rating)::numeric, 2) from public.reviews where show_id = coalesce(new.show_id, old.show_id)),
    review_count = (select count(*) from public.reviews where show_id = coalesce(new.show_id, old.show_id))
  where id = coalesce(new.show_id, old.show_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.update_show_rating();

-- ─── COMMENTS ───────────────────────────────────────────────
create table public.comments (
  id          uuid default uuid_generate_v4() primary key,
  target_id   text not null,    -- show id OR blog post slug
  target_type text not null check (target_type in ('show','post')),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  parent_id   uuid references public.comments(id) on delete cascade, -- null = top-level
  body        text not null,
  likes       int default 0,
  created_at  timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Anyone can read comments"
  on public.comments for select using (true);

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ─── COMMENT LIKES ──────────────────────────────────────────
create table public.comment_likes (
  comment_id  uuid references public.comments(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete cascade,
  primary key (comment_id, user_id)
);

alter table public.comment_likes enable row level security;

create policy "Anyone can view likes"
  on public.comment_likes for select using (true);

create policy "Authenticated users can like"
  on public.comment_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.comment_likes for delete
  using (auth.uid() = user_id);

-- Sync comment likes count
create or replace function public.update_comment_likes()
returns trigger as $$
begin
  update public.comments
  set likes = (select count(*) from public.comment_likes where comment_id = coalesce(new.comment_id, old.comment_id))
  where id = coalesce(new.comment_id, old.comment_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_comment_like_change
  after insert or delete on public.comment_likes
  for each row execute function public.update_comment_likes();

-- ─── SAVED SHOWS ────────────────────────────────────────────
create table public.saved_shows (
  user_id   uuid references public.profiles(id) on delete cascade,
  show_id   uuid references public.shows(id) on delete cascade,
  saved_at  timestamptz default now(),
  primary key (user_id, show_id)
);

alter table public.saved_shows enable row level security;

create policy "Users can view their own saved shows"
  on public.saved_shows for select
  using (auth.uid() = user_id);

create policy "Users can save shows"
  on public.saved_shows for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave shows"
  on public.saved_shows for delete
  using (auth.uid() = user_id);

-- ─── SHOW SUBMISSIONS ───────────────────────────────────────
create table public.show_submissions (
  id          uuid default uuid_generate_v4() primary key,
  artist      text not null,
  venue       text not null,
  city        text not null,
  date        text not null,
  price       text,
  ticket_url  text,
  type        text,
  description text,
  name        text not null,
  company     text,
  email       text not null,
  status      text default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz default now()
);

alter table public.show_submissions enable row level security;

create policy "Anyone can submit a show"
  on public.show_submissions for insert
  with check (true);

-- ─── PROMOTER REGISTRATIONS ─────────────────────────────────
create table public.promoter_registrations (
  id           uuid default uuid_generate_v4() primary key,
  full_name    text not null,
  email        text not null unique,
  company      text not null,
  url          text,
  updates      boolean default true,
  registered_at timestamptz default now()
);

alter table public.promoter_registrations enable row level security;

create policy "Anyone can register as a promoter"
  on public.promoter_registrations for insert
  with check (true);

-- ─── BLOG POSTS ─────────────────────────────────────────────
create table public.blog_posts (
  id          uuid default uuid_generate_v4() primary key,
  slug        text unique not null,
  title       text not null,
  category    text not null,
  author      text not null,
  deck        text,
  body        text,
  read_time   text,
  likes       int default 0,
  show_id     uuid references public.shows(id),
  is_published boolean default false,
  published_at timestamptz,
  created_at  timestamptz default now()
);

alter table public.blog_posts enable row level security;

create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (is_published = true);

-- ─── STORAGE BUCKETS ────────────────────────────────────────
-- Run these separately in Supabase Dashboard → Storage
-- Or uncomment and run here if your project supports it:

-- insert into storage.buckets (id, name, public)
-- values ('review-photos', 'review-photos', true);

-- create policy "Anyone can view review photos"
--   on storage.objects for select
--   using (bucket_id = 'review-photos');

-- create policy "Authenticated users can upload review photos"
--   on storage.objects for insert
--   with check (bucket_id = 'review-photos' and auth.role() = 'authenticated');

-- ─── INDEXES ────────────────────────────────────────────────
create index on public.shows (country);
create index on public.shows (type);
create index on public.shows (date);
create index on public.shows (is_published);
create index on public.reviews (show_id);
create index on public.reviews (user_id);
create index on public.comments (target_id, target_type);
create index on public.comments (parent_id);
create index on public.saved_shows (user_id);
