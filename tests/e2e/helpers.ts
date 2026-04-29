import { Page, expect } from "@playwright/test";

export async function addFirstProductToCart(page: Page) {
  await page.goto("/category/all");
  await page.waitForSelector('a[href^="/products/"]', { timeout: 15000 });
  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.click();
  await page.waitForURL(/\/products\//, { timeout: 15000 });

  // Select first available variant if the product has variants
  // "Select Variant" <p> is the indicator; its parent <div> contains the buttons
  const variantLabel = page.locator("p").filter({ hasText: "Select Variant" });
  if ((await variantLabel.count()) > 0) {
    const firstVariant = variantLabel
      .locator("..")                          // up to wrapping div
      .locator("button:not([disabled])")
      .first();
    if (await firstVariant.count() > 0) {
      await firstVariant.click();
      await page.waitForTimeout(300);
    }
  }

  const addBtn = page.getByRole("button", { name: /add to cart/i }).first();
  await addBtn.waitFor({ state: "visible", timeout: 10000 });
  await addBtn.click();
  await page.waitForTimeout(800);
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
  // City/District is a <select>
  const citySelect = page.getByLabel(/city/i);
  if (await citySelect.isVisible()) {
    await citySelect.selectOption({ index: 1 });
  }
}

export async function waitForOrderConfirmation(page: Page) {
  await page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });
  // Use heading role to avoid strict mode with Next.js route announcer
  await expect(
    page.getByRole("heading", { name: /order confirmed/i }),
  ).toBeVisible({ timeout: 10000 });
}
