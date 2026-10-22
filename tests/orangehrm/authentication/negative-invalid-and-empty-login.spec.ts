// spec: specs/orangehrm-basic-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and navigation', () => {
  test('Negative - Reject incorrect and missing credentials', async ({ page }) => {
    // 1. Open the login page for the negative authentication scenarios.
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // 2. Enter the valid demo username with an invalid password to check authentication rejection.
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // 3. Clear both fields and select Login.
    await page.getByRole('textbox', { name: 'Username' }).fill('');
    await page.getByRole('textbox', { name: 'Password' }).fill('');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Required').first()).toBeVisible();
    await expect(page.getByText('Required')).toHaveCount(2);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});
