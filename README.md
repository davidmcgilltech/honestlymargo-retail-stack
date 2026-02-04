# Honestly Margo Retail Stack

E-commerce platform for Honestly Margo's handcrafted beauty products.

**Live:** https://honestlymargo-retail-stack.vercel.app

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  Next.js 16 + React + Tailwind                                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Home   │  │ Products │  │ Success  │  │  Admin   │       │
│  │   /      │  │/products │  │/success  │  │  /admin  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API ROUTES                               │
│                                                                 │
│  POST /api/checkout ──────────► Stripe Checkout Session        │
│                                 (redirects to Stripe)          │
│                                                                 │
│  POST /api/webhooks/stripe ◄── Stripe Webhook                  │
│         │                      (checkout.session.completed)    │
│         ▼                                                       │
│  Creates order + customer in Supabase                          │
│                                                                 │
│  POST /api/admin/orders/update ── Update order status          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA STORES                              │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────┐         │
│  │      Supabase       │      │       Stripe        │         │
│  │                     │      │                     │         │
│  │  • products         │      │  • Checkout         │         │
│  │  • orders           │      │  • Payments         │         │
│  │  • customers        │      │  • Webhooks         │         │
│  └─────────────────────┘      └─────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Current Status

### ✅ Complete
- [x] Product catalog (fetches from Supabase)
- [x] Stripe Checkout integration (hosted checkout page)
- [x] Webhook handler creates orders in Supabase
- [x] Customer records created/updated on purchase
- [x] Admin dashboard with order list and stats
- [x] Order detail view
- [x] Order status updates (paid → processing → shipped → delivered)
- [x] Free shipping on orders $99+

### 🚧 In Progress
- [ ] (nothing currently)

### ❌ Not Started
- [ ] Automated tests
- [ ] Email confirmations
- [ ] Shipping label integration
- [ ] Inventory tracking
- [ ] Customer order lookup
- [ ] Real product data/images

## Data Models

### orders
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| stripe_session_id | text | Stripe checkout session ID |
| stripe_payment_intent | text | Stripe payment intent ID |
| customer_id | uuid | FK to customers |
| customer_email | text | |
| customer_name | text | |
| shipping_address | jsonb | {line1, line2, city, state, postal_code, country} |
| subtotal | numeric | |
| shipping | numeric | |
| total | numeric | |
| status | text | paid, processing, shipped, delivered, cancelled |
| line_items | jsonb | [{description, quantity, unit_price, total}] |
| created_at | timestamp | |

### customers
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Unique |
| name | text | |
| phone | text | |
| stripe_customer_id | text | |
| total_orders | int | |
| total_spent | numeric | |

### products
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | |
| slug | text | URL-friendly name |
| description | text | |
| price | numeric | |
| image_url | text | |
| is_active | boolean | |
| tags | text[] | e.g., ['best-seller'] |

## Environment Variables

### Required for Vercel
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ **Important:** When setting env vars via CLI, use `printf` not `echo` to avoid trailing newlines:
```bash
printf 'whsec_xxx' | vercel env add STRIPE_WEBHOOK_SECRET production
```

## Local Development

```bash
npm install
vercel env pull .env.local  # Pull env vars from Vercel
npm run dev
```

### Testing Webhooks Locally

```bash
# Terminal 1: Run the app
npm run dev

# Terminal 2: Forward Stripe events
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger test events
stripe trigger checkout.session.completed
```

## Deployment

Deployed on Vercel. Push to main triggers auto-deploy.

```bash
vercel --prod  # Manual deploy
```

## Key Files

```
app/
├── page.tsx                    # Homepage with featured products
├── products/page.tsx           # Product catalog
├── success/page.tsx            # Post-checkout success page
├── admin/
│   ├── page.tsx               # Order dashboard
│   └── orders/[id]/
│       ├── page.tsx           # Order detail
│       └── OrderActions.tsx   # Status update buttons
├── api/
│   ├── checkout/route.ts      # Creates Stripe checkout session
│   ├── webhooks/stripe/route.ts  # Handles Stripe webhooks
│   └── admin/orders/update/route.ts  # Updates order status
└── lib/
    └── supabase.ts            # Supabase client
```

## Webhook Flow

1. Customer completes Stripe Checkout
2. Stripe sends `checkout.session.completed` to `/api/webhooks/stripe`
3. Webhook handler:
   - Verifies signature
   - Fetches line items from Stripe
   - Creates/updates customer in Supabase
   - Creates order in Supabase
4. Order appears in admin dashboard

## Contributing

See [TODO.md](./TODO.md) for planned work.
