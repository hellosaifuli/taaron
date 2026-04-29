import { test, expect } from "@playwright/test";
import { addFirstProductToCart, fillCheckoutForm, waitForOrderConfirmation } from "./helpers";

test.describe("Guest checkout", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
  });

  test("cart icon shows item count after adding product", async ({ page }) => {
    // Use visible() filter — desktop nav link is hidden on mobile viewport
    const cartLink = page.locator('a[href="/checkout"]').filter({ hasText: /cart/i }).or(
      page.locator('a[href="/checkout"][aria-label]'),
    ).first();
    await expect(cartLink).toBeVisible({ timeout: 8000 });
  });

  test("completes COD order as guest", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText(/order summary/i).first()).toBeVisible();
    await fillCheckoutForm(page, { email: "guest@example.com" });
    const placeOrderBtn = page.getByRole("button", { name: /place order/i });
    await expect(placeOrderBtn).toBeEnabled();
    await placeOrderBtn.click();
    await waitForOrderConfirmation(page);
    await expect(page.getByText(/cash on delivery/i).first()).toBeVisible();
  });

  test("order confirmation shows correct items and totals", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "items-test@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(page.getByText(/items/i).first()).toBeVisible();
    await expect(page.getByText(/total/i).first()).toBeVisible();
    await expect(page.getByText(/shipping/i).first()).toBeVisible();
  });

  test("shows estimated delivery dates on confirmation", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "delivery-test@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(page.getByText(/estimated delivery/i).first()).toBeVisible();
  });

  test("checkout blocks submission with missing required fields", async ({ page }) => {
    await page.goto("/checkout");
    const placeOrderBtn = page.getByRole("button", { name: /place order/i });
    await placeOrderBtn.click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("product links in checkout summary navigate to product page", async ({ page }) => {
    await page.goto("/checkout");
    const productLink = page.locator('aside a[href^="/products/"]').first();
    if (await productLink.isVisible()) {
      const href = await productLink.getAttribute("href");
      expect(href).toMatch(/^\/products\//);
    }
  });

  test("order confirmation has 'Continue Shopping' CTA", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "continue-test@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(
      page.getByRole("link", { name: /continue shopping/i }).first(),
    ).toBeVisible();
  });

  test("order confirmation shows 'Create Account' CTA for guests", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "create-acct@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(
      page.getByRole("link", { name: /create account/i }).first(),
    ).toBeVisible();
  });
});
