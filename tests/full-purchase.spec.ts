import { test, expect } from '@playwright/test'

test('complete full purchase flow', async ({ page }) => {
  test.setTimeout(180000)
  
  // Go to products
  await page.goto('https://honestlymargo-retail-stack.vercel.app/products')
  await page.waitForSelector('button:has-text("Buy Now")')
  console.log('✓ Products loaded')
  
  // Click Buy Now
  await page.click('button:has-text("Buy Now")')
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 })
  console.log('✓ On Stripe Checkout')
  
  // Wait for form
  await page.waitForSelector('#email', { timeout: 30000 })
  
  // Fill form
  await page.fill('#email', 'test@honestlymargo.com')
  await page.fill('#shippingName', 'Test Customer')
  await page.fill('#shippingAddressLine1', '123 Main St')
  await page.fill('#shippingLocality', 'Austin')
  await page.selectOption('#shippingAdministrativeArea', 'TX')
  await page.fill('#shippingPostalCode', '78701')
  console.log('✓ Filled shipping')

  // Select Card payment
  await page.click('text=Card')
  await page.waitForTimeout(2000)
  console.log('✓ Selected Card')

  // Fill card via Stripe's test helper
  // Card number field
  const cardFrame = page.frameLocator('iframe').first()
  await page.waitForTimeout(1000)
  
  // Use keyboard to type into focused card field
  await page.keyboard.type('4242424242424242')
  await page.keyboard.press('Tab')
  await page.keyboard.type('1230')
  await page.keyboard.press('Tab')
  await page.keyboard.type('123')
  await page.keyboard.press('Tab')
  await page.keyboard.type('78701')
  console.log('✓ Filled card')

  // Submit
  await page.click('button:has-text("Pay")')
  console.log('✓ Clicked Pay')

  // Wait for redirect to success
  await page.waitForURL(/success/, { timeout: 90000 })
  console.log('✓ SUCCESS! Order completed!')
})
