# TODO - Honestly Margo Retail Stack

## Current Sprint

### 🔴 Must Have (for launch)
- [ ] **Real product data** - Replace test products with actual Honestly Margo inventory
  - Product names, descriptions, prices
  - Product images (upload to Supabase storage or use CDN)
  - Categories (lip balms, lotions, aromatherapy)
- [ ] **Email confirmations** - Send order confirmation to customers
  - Consider: Resend, SendGrid, or Supabase Edge Functions + email provider

### 🟡 Should Have
- [ ] **Basic tests** - Prevent regressions
  - Unit test: checkout session creation
  - Unit test: webhook signature verification
  - Unit test: order creation logic
  - E2E test: full checkout flow (Playwright exists but needs work)

## Backlog

### Customer Experience
- [ ] **Order tracking page** - `/orders/[id]` public page where customers can check status
- [ ] **Cart persistence** - Save cart to localStorage or Supabase
- [ ] **Product detail pages** - `/products/[slug]` with full description, multiple images
- [ ] **Search/filter** - Filter products by category, price range
- [ ] **Reviews** - Customer reviews on products

### Operations
- [ ] **Shipping integration** - Generate labels via EasyPost or Shippo
  - Auto-update order status when shipped
  - Track package and update to delivered
- [ ] **Inventory tracking** - Stock levels, low stock alerts
- [ ] **Packing slips** - Printable packing slip from admin

### Admin
- [ ] **Authentication** - Protect admin routes (currently public!)
- [ ] **Sales dashboard** - Charts, revenue over time, top products
- [ ] **Customer list** - View all customers, order history
- [ ] **Bulk actions** - Mark multiple orders as shipped

### Polish
- [ ] **Custom domain** - honestlymargo.com or shop.honestlymargo.com
- [ ] **SEO** - Meta tags, OpenGraph images, sitemap
- [ ] **Mobile optimization** - Test and fix any mobile issues
- [ ] **Loading states** - Skeleton loaders, button loading states
- [ ] **Error handling** - User-friendly error messages

## Completed ✅

- [x] Product catalog page
- [x] Stripe Checkout integration
- [x] Webhook handler (checkout.session.completed)
- [x] Order creation in Supabase
- [x] Customer creation/update on purchase
- [x] Admin order list with stats
- [x] Order detail view
- [x] Order status updates
- [x] Free shipping threshold ($99)
- [x] Success page after checkout

## Technical Debt

- [ ] **Remove test endpoint** - `/api/test` should be removed before production
- [ ] **Webhook idempotency** - Handle duplicate webhook deliveries gracefully
- [ ] **Error monitoring** - Add Sentry or similar
- [ ] **Rate limiting** - Protect API routes from abuse
- [ ] **Input validation** - Validate checkout request body properly

## Notes

### Stripe Webhook Secret
When updating `STRIPE_WEBHOOK_SECRET` in Vercel, use `printf` to avoid trailing newlines:
```bash
printf 'whsec_xxx' | vercel env add STRIPE_WEBHOOK_SECRET production
```

### Testing Webhooks
```bash
# Trigger a test checkout event
stripe trigger checkout.session.completed

# Or resend a real event
stripe events resend evt_xxx --webhook-endpoint we_xxx
```
