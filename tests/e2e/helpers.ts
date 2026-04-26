import { Page, expect } from "@playwright/test";

export async function addFirstProductToCart(page: Page) {
  await page.goto("/category/all");
  await page.waitForSelector('[data-testid="product-card"], a[href^="/products/"]');
  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.click();
  await page.waitForURL(/\/products\//);
  const addBtn = page.getByRole("button", { name: /add to cart/i });
  await addBtn.click();
}

export async function fillCheckoutForm(
  page: Page,
  opts: { email?: string } = {},
) {
  await page.getByLabel(/full name/i).fill("Test User");
  if (opts.email !== undefined) {
    const emailField = page.getByLabel(/email/i);
    if (await emailField.isVisible()) await emailField.fill(opts.email);
  }
  await page.getByLabel(/phone/i).fill("01700000000");
  await page.getByLabel(/address/i).fill("123 Test Street");
  await page.getByLabel(/city/i).fill("Dhaka");
}

export async function waitForOrderConfirmation(page: Page) {
  await page.waitForURL(/\/order-confirmation\//, { timeout: 15000 });
  await expect(page.getByText(/order confirmed/i)).toBeVisible();
}
