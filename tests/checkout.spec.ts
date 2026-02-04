import { test, expect } from '@playwright/test'

test('products page loads and checkout redirects to Stripe', async ({ page }) => {
  // Load products page
  await page.goto('https://honestlymargo-retail-stack.vercel.app/products')
  
  // Verify products load
  await expect(page.locator('button:has-text("Buy Now")').first()).toBeVisible({ timeout: 10000 })
  console.log('✓ Products page loaded')
  
  // Count products
  const buyButtons = await page.locator('button:has-text("Buy Now")').count()
  console.log(`✓ Found ${buyButtons} products with Buy Now buttons`)
  expect(buyButtons).toBeGreaterThan(0)
  
  // Click first Buy Now
  await page.click('button:has-text("Buy Now")')
  
  // Verify redirect to Stripe Checkout
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 })
  console.log('✓ Redirected to Stripe Checkout')
  
  // Verify Stripe checkout loaded (shows total due)
  await expect(page.locator('text=Total due')).toBeVisible({ timeout: 10000 })
  console.log('✓ Stripe Checkout loaded successfully')
  
  // Verify it's in test mode
  await expect(page.locator('text=TEST MODE')).toBeVisible()
  console.log('✓ Confirmed TEST MODE')
})
