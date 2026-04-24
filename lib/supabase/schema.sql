-- Users (managed by Supabase Auth, but extend with custom data)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text default 'Bangladesh',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  cost numeric,
  sku text unique,
  image_url text,
  thumbnail_url text,
  status text default 'active', -- active, draft, archived
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Product Variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- e.g., "Red - Small"
  sku text unique,
  price_adjustment numeric default 0,
  stock_quantity integer default 0,
  image_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number text unique not null,
  status text default 'pending', -- pending, confirmed, shipped, delivered, cancelled
  payment_method text not null, -- 'cod', 'bkash'
  payment_status text default 'pending', -- pending, completed, failed
  subtotal numeric not null,
  shipping_cost numeric default 0,
  tax numeric default 0,
  total numeric not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text default 'Bangladesh',
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  quantity integer not null,
  price numeric not null, -- price at time of order
  created_at timestamp default now()
);

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric not null,
  currency text default 'BDT',
  payment_method text not null, -- 'bkash', 'cod'
  transaction_id text unique,
  bkash_trx_id text unique, -- for bKash
  status text default 'pending', -- pending, completed, failed
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create indexes
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_product_variants_product_id on public.product_variants(product_id);
create index idx_payments_order_id on public.payments(order_id);

-- Enable RLS
alter table public.user_profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- RLS Policies

-- Users can read own profile
create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Users can update own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Everyone can read products
create policy "Products are readable by everyone"
  on public.products for select
  using (status = 'active');

-- Everyone can read product variants
create policy "Product variants are readable by everyone"
  on public.product_variants for select
  using (true);

-- Users can read own orders
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Users can read own order items
create policy "Users can read own order items"
  on public.order_items for select
  using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Users can read own payments
create policy "Users can read own payments"
  on public.payments for select
  using (exists (select 1 from public.orders where orders.id = payments.order_id and orders.user_id = auth.uid()));
