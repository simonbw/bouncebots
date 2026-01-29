import { test, expect } from '@playwright/test';

test.describe('BounceBots smoke tests', () => {
  test('page loads without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Navigate to the app
    await page.goto('/');

    // Wait for the app to render
    await page.waitForLoadState('networkidle');

    // Verify no console or page errors
    expect(errors).toEqual([]);

    // Verify key elements are present
    await expect(page.getByRole('heading', { name: 'Moves' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Goal' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'How To Play' })).toBeVisible();
  });

  test('app renders game board', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForLoadState('networkidle');

    // Check that SVG game board exists
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Verify board has rendered (check for grid cells)
    const gridElements = await svg.locator('rect').count();
    expect(gridElements).toBeGreaterThan(0);
  });
});
