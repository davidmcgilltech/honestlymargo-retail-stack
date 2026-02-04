const { chromium } = require('@playwright/test');

(async () => {
  console.log('Starting checkout test...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Go to the site
    console.log('1. Loading homepage...');
    await page.goto('https://honestlymargo-retail-stack.vercel.app');
    await page.waitForLoadState('networkidle');
    console.log('   ✓ Homepage loaded');
    
    // Go to products page
    console.log('2. Going to products...');
    await page.click('text=Shop');
    await page.waitForLoadState('networkidle');
    console.log('   ✓ Products page loaded');
    
    // Click on first product
    console.log('3. Clicking first product...');
    const products = await page.locator('.product-card, a[href*="/products/"]').all();
    if (products.length > 0) {
      await products[0].click();
      await page.waitForLoadState('networkidle');
      console.log('   ✓ Product page loaded');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('   ✓ Screenshot saved');
    
    console.log('\n✅ Test completed successfully!');
    console.log('Note: Full checkout test requires cart functionality to be implemented');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
})();
