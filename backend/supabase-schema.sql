-- Run this in Supabase SQL Editor (one time setup)

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  username text not null,
  created_at timestamptz default now()
);

create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  year integer,
  color text,
  notes text,
  owner_id uuid references users(id) on delete cascade not null,
  created_at timestamptz default now()
);

create table if not exists mods (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'WISHLIST',
  estimated_cost numeric,
  actual_cost numeric,
  vendor text,
  sort_order integer default 0,
  car_id uuid references cars(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Disable RLS since we handle auth ourselves
alter table users disable row level security;
alter table cars disable row level security;
alter table mods disable row level security;
