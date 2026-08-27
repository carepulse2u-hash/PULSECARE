-- Run this once in your Supabase project's SQL Editor
-- (Supabase dashboard -> SQL Editor -> New query -> paste -> Run)
-- before deploying. Creates the three tables PulseCare now stores its
-- data in, replacing orders.json / product.json / secure_auth.json.

create table if not exists orders (
  id bigint generated always as identity primary key,
  order_id text unique not null,
  name text not null,
  phone text not null,
  address text not null,
  pincode text not null,
  city text,
  state text,
  qty integer not null,
  total_price numeric not null,
  payment_method text,
  payment_status text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists product_config (
  id integer primary key,
  data jsonb not null
);

create table if not exists auth_store (
  id integer primary key,
  owner_email text not null,
  admin_password text not null,
  verification_code jsonb
);

-- Row Level Security: enabled with no policies, so only requests using
-- the service_role key (which the app's server-side API routes use) can
-- read or write these tables. The anon/public key (if you ever add it
-- elsewhere) would be blocked from touching this data entirely.
alter table orders enable row level security;
alter table product_config enable row level security;
alter table auth_store enable row level security;
