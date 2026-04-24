# Taaron Store - Ecommerce Platform

Modern, minimal ecommerce platform built on Next.js 15 with Supabase backend. Designed for luxury leather goods market in Bangladesh with COD & bKash payments.

**Tagline:** "Shine with Every Step"

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** COD (Cash on Delivery), bKash mobile payment
- **Hosting:** Vercel
- **Domain:** taaron.bd

## Quick Start

### 1. Supabase Setup

1. Visit [supabase.com](https://supabase.com)
2. Create account and new project
3. Copy project URL and anon key
4. Create `.env.local` in root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Create Database

1. Supabase Dashboard → SQL Editor
2. Copy entire content from `lib/supabase/schema.sql`
3. Run query → All tables + RLS created

### 3. Install & Run

```bash
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx                 # Home + product listing
├── products/[id]/           # Product detail page
├── checkout/                # Checkout flow
├── order-confirmation/[id]/ # Order status
├── auth/                    # Login/signup
├── dashboard/               # Order history
├── admin/products/          # Admin add products
├── api/
│   ├── auth/               # Login/signup endpoints
│   ├── products/           # Product CRUD
│   └── orders/             # Order creation

components/
├── header.tsx              # Navigation header
├── add-to-cart.tsx         # Add to cart logic
└── ...

lib/supabase/
├── client.ts               # Browser client
├── server.ts               # Server client
└── schema.sql              # Database schema
```

## Pages & Features

### Customer Flow

| Page | Path | Features |
|------|------|----------|
| Home | `/` | Product grid, categories, hero |
| Product | `/products/[id]` | Images, variants, description |
| Checkout | `/checkout` | Cart, address, payment method |
| Order Confirm | `/order-confirmation/[id]` | Status timeline, details |
| Dashboard | `/dashboard` | Order history |
| Auth | `/auth` | Login/signup |

### Admin Flow

| Page | Path | Features |
|------|------|----------|
| Add Product | `/admin/products` | Create products with images |

## API Routes

```
POST   /api/auth/sign-up          # Register
POST   /api/auth/sign-in          # Login
GET    /api/products              # List products (paginated)
POST   /api/products              # Create product
GET    /api/orders                # Get user orders
POST   /api/orders                # Create order
```

## Database Schema

**Tables:**
- `user_profiles` - Customer info (name, email, address)
- `products` - Products with price, description, images
- `product_variants` - Size/color options with stock
- `orders` - Orders with status (pending → delivered)
- `order_items` - Line items in each order
- `payments` - Payment tracking (COD/bKash)

**RLS Policies:**
- Users see only own orders, payments
- Everyone sees active products
- Admin create products (no RLS limit)

## Design System

### Colors
- **Primary:** Gray 900 (#111827)
- **Background:** White
- **Borders:** Gray 200 (#e5e7eb)
- **Text:** Gray 900 (dark), Gray 600 (secondary)

### Typography
- Font: System sans-serif (Tailwind default)
- Headings: Font-light, tracking-wider
- Body: Regular, text-sm to text-base

### Layout
- Full-width responsive
- Max-width: 7xl container (1280px)
- Grid: 2 cols mobile, 4 cols desktop
- Spacing: Consistent 4px grid

## Payment Methods

### Cash on Delivery (COD)
- No integration needed
- Order status: pending (payment pending until delivery)
- Customer pays on delivery

### bKash
- Placeholder structure in place
- To enable:
  1. Get merchant credentials
  2. Add to `.env.local`
  3. Implement webhook in `/api/payments/bkash`
  4. Set `payment_status = 'completed'` on callback

## Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy
1. Visit [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Add environment variables
4. Deploy

### Step 3: Custom Domain (taaron.bd)
1. Vercel Dashboard → Domains
2. Add `taaron.bd`
3. Update registrar nameservers to Vercel's
4. Wait 24-48 hours for DNS propagation

## Admin Operations

### Add Product
1. Visit `/admin/products`
2. Fill form (name, price, description, SKU)
3. Add image URL
4. Create
5. Product appears on home page

### Add Product Variants
1. Via Supabase UI or API
2. Insert into `product_variants` table
3. Link to product_id
4. Add variant names, prices, stock

### View Orders
1. Visit Supabase Dashboard
2. Go to `orders` table
3. See all orders with status
4. Update order status manually

## Development Tips

### Local Testing

**Test signup/login:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test product creation:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Wallet","price":1500,"description":"Leather wallet"}'
```

### Environment Variables
See `.env.example` for all required variables.

## Next Steps

- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Add test products via `/admin/products`
- [ ] Test signup/checkout flow
- [ ] Upload product images
- [ ] Test with real data
- [ ] Set up bKash (optional)
- [ ] Deploy to Vercel
- [ ] Point taaron.bd to Vercel
- [ ] Monitor orders & payments

## Support

For questions or issues:
- Check Supabase docs: https://supabase.com/docs
- Check Next.js docs: https://nextjs.org/docs
- Visit taaron.bd

---

Built with ❤️ for Bangladesh market. "Shine with Every Step."
