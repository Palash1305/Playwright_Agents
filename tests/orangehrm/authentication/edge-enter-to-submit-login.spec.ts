// spec: specs/orangehrm-basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and navigation', () => {
  test('Edge - Submit login using the Enter key', async ({ page }) => {
    // 1. Open the login page for keyboard submission edge-case testing.
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // 2. Enter the published demo username while preparing to submit via keyboard.
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.keyboard.press('Enter');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
