# Taaron Store - Setup Guide

Minimal ecommerce for Bangladesh. COD + bKash. Supabase backend. Next.js 15.

## 🚀 Quick Start

### 1. Supabase Setup

1. Visit [supabase.com](https://supabase.com)
2. Create account → Create project
3. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. Database Schema

1. Supabase Dashboard → SQL Editor
2. Paste entire `lib/supabase/schema.sql`
3. Click "Run"
4. Done! Tables + RLS policies created

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📋 Pages & Features

### Customer Flow

- **`/`** - Product listing (grid layout)
- **`/products/[id]`** - Product detail + variants
- **`/checkout`** - Cart → Address → Payment method
- **`/order-confirmation/[id]`** - Order status & timeline
- **`/auth`** - Login/Signup (email/password)
- **`/dashboard`** - My orders history

### Admin

- **`/admin/products`** - Add products, view list

## 🗄️ Database

**Tables:**

- `user_profiles` - Customer info
- `products` - Name, price, description, images
- `product_variants` - Size/color/options with stock
- `orders` - Order records with status (pending → delivered)
- `order_items` - Products in each order
- `payments` - Payment tracking (COD/bKash)

## 🔌 API Routes

```
POST   /api/auth/sign-up           - Create account
POST   /api/auth/sign-in           - Login
GET    /api/products               - List products (paginated)
POST   /api/products               - Add product (admin)
GET    /api/orders                 - Get user's orders
POST   /api/orders                 - Create order
```

## 💳 Payment Methods

Currently configured:

- **COD** (Cash on Delivery) - No integration needed
- **bKash** (placeholder) - Needs webhook integration

For bKash production:

1. Get merchant credentials
2. Add to `.env.local`
3. Implement webhook in `/api/payments/bkash`
4. Set payment_status = 'completed' on successful callback

## 🎨 Design

- Full-width layouts
- Gray/white minimal colors
- Tailwind CSS
- Mobile responsive

## 📦 Tech Stack

- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Server Components & Actions

## 🚢 Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → Import repo
3. Add environment variables
4. Deploy

## 🌍 Custom Domain (taaron.bd)

1. Buy domain
2. Vercel dashboard → Domains
3. Add `taaron.bd`
4. Update domain registrar nameservers to Vercel's
5. Done!

## 📝 Next Steps

- [ ] Test product creation (/admin/products)
- [ ] Test signup/login
- [ ] Add products with images
- [ ] Test checkout flow
- [ ] Integrate bKash webhook
- [ ] Deploy to Vercel
- [ ] Point taaron.bd to Vercel
- [ ] Add product variants
- [ ] Build order management dashboard
