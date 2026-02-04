# HonestlyMargoRetail™

> McGill's Shopify-killing beauty retail stack — **$3k/yr savings**

![HonestlyMargo Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)

## 🎯 What Is This?

A complete e-commerce stack that replaces Shopify for beauty/retail brands like [Honestly Margo](https://honestlymargo.com). Built with modern tech, zero monthly platform fees.

**Demo**: [honestlymargo-retail.vercel.app](https://honestlymargo-retail.vercel.app)

---

## 💰 Savings Calculator

| Monthly Sales | Shopify Cost | HonestlyMargoRetail™ | **Annual Savings** |
|--------------|--------------|----------------------|-------------------|
| $5,000/mo | $3,984/yr | $2,100/yr | **$1,884** |
| $10,000/mo | $6,396/yr | $4,560/yr | **$1,836** |
| $25,000/mo | $10,788/yr | $7,200/yr | **$3,588** |
| $50,000/mo | $18,588/yr | $14,400/yr | **$4,188** |

*Shopify costs include Basic plan ($39/mo) + 2.9% + $0.30 per transaction*
*HonestlyMargoRetail uses Stripe (2.9% + $0.30) + Vercel Pro ($20/mo) + Supabase Free*

---

## 🛒 Features

- **Product Catalog** — Supabase-powered with variants, images, inventory
- **Shopping Cart** — Persistent cart with localStorage + Supabase sync
- **Stripe Checkout** — One-time payments, no subscriptions needed
- **AI Descriptions** — Claude-generated product copy
- **Cart Recovery** — SendGrid abandoned cart emails
- **Mobile-First** — Responsive design, fast on any device

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/davidmcgilltech/honestlymargo-retail-stack.git
cd honestlymargo-retail-stack

# Install
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase + Stripe keys

# Run
npm run dev
```

---

## 🔧 Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 15 + Tailwind | Free |
| Database | Supabase (Postgres) | Free tier |
| Payments | Stripe | 2.9% + $0.30 |
| Hosting | Vercel | Free / $20 Pro |
| Email | SendGrid | Free tier |
| AI | Claude API | Pay-per-use |

---

## 📦 Product Data

Pre-seeded with Honestly Margo's catalog:

- **Tinted Lip Balms** — $7.95
- **Aromatherapy Balms** — $11.95  
- **Hand & Body Lotion** — $16.95
- **Goddess Body Lotion** — $22.95
- **Goddess Hair & Body Mist** — $22.95
- And more...

Free shipping on orders $99+

---

## 🏗️ Project Structure

```
├── app/
│   ├── page.tsx           # Homepage
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   └── api/               # API routes (Stripe, etc.)
├── components/
│   ├── ui/                # Buttons, inputs, etc.
│   ├── cart/              # Cart components
│   └── product/           # Product cards, gallery
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe helpers
│   └── utils.ts           # Utilities
├── supabase/
│   └── schema.sql         # Database schema + seed data
└── public/                # Static assets
```

---

## 🎨 Customization

1. **Branding** — Update `tailwind.config.js` colors
2. **Products** — Edit `supabase/schema.sql` seed data
3. **Checkout** — Customize Stripe checkout in `app/api/checkout/`
4. **Emails** — Configure SendGrid templates in `lib/email.ts`

---

## 📄 License

MIT — Use it, modify it, sell it.

---

<p align="center">
  <strong>HonestlyMargoRetail™</strong> | Powered by <a href="https://github.com/davidmcgilltech">davidmcgilltech</a><br>
  <em>McGill Technologies OKC</em>
</p>
