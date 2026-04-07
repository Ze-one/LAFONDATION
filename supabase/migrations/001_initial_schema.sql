-- LAFONDATION — PostgreSQL schema for Supabase
-- Run in Supabase SQL editor or via supabase db push

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
  country text not null default 'FR',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (lower(email));

-- -----------------------------------------------------------------------------
-- Encrypted financial vault (application-level AES-256-GCM; no plaintext here)
-- -----------------------------------------------------------------------------
create table public.financial_vault (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  ciphertext text not null,
  iv text not null,
  auth_tag text not null,
  algorithm text not null default 'aes-256-gcm',
  key_version smallint not null default 1,
  created_at timestamptz not null default now()
);

create index financial_vault_user_id_idx on public.financial_vault (user_id);

-- -----------------------------------------------------------------------------
-- Registration receipts / transaction log
-- -----------------------------------------------------------------------------
create table public.registration_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  transaction_id text not null unique,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index registration_receipts_user_id_idx on public.registration_receipts (user_id);

-- -----------------------------------------------------------------------------
-- User documents (Phase 2+)
-- -----------------------------------------------------------------------------
create table public.user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  doc_type text not null,
  storage_path text,
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index user_documents_user_id_idx on public.user_documents (user_id);

-- -----------------------------------------------------------------------------
-- In-app notifications
-- -----------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);

-- -----------------------------------------------------------------------------
-- Admin: extra required document types per user
-- -----------------------------------------------------------------------------
create table public.admin_document_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  description text,
  required boolean not null default true,
  fulfilled_document_id uuid references public.user_documents (id),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index admin_document_requests_user_id_idx
  on public.admin_document_requests (user_id);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.financial_vault enable row level security;
alter table public.registration_receipts enable row level security;
alter table public.user_documents enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_document_requests enable row level security;

-- Profiles: users manage their own row (no insert via anon — use service role or trigger)
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Financial vault: deny all direct client access (service role bypasses RLS)
create policy "No direct vault access for authenticated"
  on public.financial_vault for all
  using (false);

-- Receipts: own rows only
create policy "Users read own receipts"
  on public.registration_receipts for select
  using (auth.uid() = user_id);

-- Documents: own rows
create policy "Users read own documents"
  on public.user_documents for select
  using (auth.uid() = user_id);

create policy "Users insert own documents"
  on public.user_documents for insert
  with check (auth.uid() = user_id);

create policy "Users update own pending documents"
  on public.user_documents for update
  using (auth.uid() = user_id and status = 'pending');

-- Notifications: own rows
create policy "Users read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Admin requests: visible to target user
create policy "Users read own document requests"
  on public.admin_document_requests for select
  using (auth.uid() = user_id);

-- Profile rows are created by the registration API (service role). If you prefer
-- client-side signUp only, add a trigger on auth.users to insert into profiles.

comment on table public.financial_vault is
  'PCI-style data must use tokenization in production; ciphertext is AES-256-GCM.';
