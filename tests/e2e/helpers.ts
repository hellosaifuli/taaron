import { Page, expect } from "@playwright/test";

export async function addFirstProductToCart(page: Page) {
  await page.goto("/category/all");
  await page.waitForSelector('a[href^="/products/"]', { timeout: 15000 });
  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.click();
  await page.waitForURL(/\/products\//, { timeout: 15000 });

  // Select first available variant if any exist
  const variantButtons = page.locator(
    'button:not([aria-label]):not([type="submit"]):not([disabled])',
  ).filter({ hasText: /^(?!Add to Cart|Buy Now|Please wait).+/i });
  const variantSection = page.getByText(/select variant/i);
  if (await variantSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    const firstVariant = page
      .locator("button")
      .filter({ hasNotText: /add to cart|buy now|please wait/i })
      .filter({ hasText: /./ })
      .first();
    await firstVariant.click().catch(() => {});
  }

  const addBtn = page.getByRole("button", { name: /add to cart/i });
  await addBtn.waitFor({ state: "visible", timeout: 10000 });
  await addBtn.click();
  // Give cart state time to update
  await page.waitForTimeout(500);
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
  // City/District is a <select> — use selectOption not fill
  const citySelect = page.getByLabel(/city/i);
  if (await citySelect.isVisible()) {
    await citySelect.selectOption({ index: 1 }); // pick first real option
  }
}

export async function waitForOrderConfirmation(page: Page) {
  await page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });
  await expect(page.getByText(/order confirmed/i)).toBeVisible({ timeout: 10000 });
}
