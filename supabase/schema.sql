-- Run this in your Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

create table if not exists public.onboarding_progress (
  user_id text primary key,
  current_step integer not null default 1,
  steps_completed jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voice_agents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  plan text not null,
  status text not null default 'active',
  business_summary text not null,
  tasks jsonb not null default '[]'::jsonb,
  personality jsonb not null default '[]'::jsonb,
  guardrails jsonb not null default '[]'::jsonb,
  opening_script text not null,
  system_prompt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voice_agents_user_id_idx on public.voice_agents(user_id);
create index if not exists voice_agents_status_idx on public.voice_agents(status);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at_timestamp();

drop trigger if exists onboarding_progress_set_updated_at on public.onboarding_progress;
create trigger onboarding_progress_set_updated_at
before update on public.onboarding_progress
for each row
execute function public.set_updated_at_timestamp();

drop trigger if exists voice_agents_set_updated_at on public.voice_agents;
create trigger voice_agents_set_updated_at
before update on public.voice_agents
for each row
execute function public.set_updated_at_timestamp();

-- Tighten these policies to your exact service model.
alter table public.subscriptions enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.voice_agents enable row level security;

create policy "Service role full access subscriptions"
on public.subscriptions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role full access onboarding_progress"
on public.onboarding_progress
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role full access voice_agents"
on public.voice_agents
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
