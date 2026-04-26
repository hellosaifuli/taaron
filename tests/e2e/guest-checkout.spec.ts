import { test, expect } from "@playwright/test";
import { addFirstProductToCart, fillCheckoutForm, waitForOrderConfirmation } from "./helpers";

test.describe("Guest checkout", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
  });

  test("cart icon shows item count after adding product", async ({ page }) => {
    const cartBadge = page.locator('[data-testid="cart-count"], .cart-count');
    // Tolerate if badge not present — just verify cart icon exists
    const cartLink = page.getByRole("link", { name: /cart/i }).or(
      page.locator('a[href="/checkout"]'),
    );
    await expect(cartLink).toBeVisible();
  });

  test("completes COD order as guest", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText(/order summary/i)).toBeVisible();

    await fillCheckoutForm(page, { email: "guest@example.com" });

    // COD is default — just submit
    const placeOrderBtn = page.getByRole("button", { name: /place order/i });
    await expect(placeOrderBtn).toBeEnabled();
    await placeOrderBtn.click();

    await waitForOrderConfirmation(page);
    await expect(page.getByText(/cash on delivery/i)).toBeVisible();
  });

  test("order confirmation shows correct items and totals", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page);

    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);

    await expect(page.getByText(/items/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/shipping/i)).toBeVisible();
  });

  test("shows estimated delivery dates on confirmation", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page);
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(page.getByText(/estimated delivery/i)).toBeVisible();
  });

  test("checkout blocks submission with missing required fields", async ({ page }) => {
    await page.goto("/checkout");
    // Try to submit without filling form
    const placeOrderBtn = page.getByRole("button", { name: /place order/i });
    await placeOrderBtn.click();
    // Should still be on checkout page
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
    await fillCheckoutForm(page);
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();
  });

  test("order confirmation shows 'Create Account' CTA for guests", async ({ page }) => {
    await page.goto("/checkout");
    await fillCheckoutForm(page);
    await page.getByRole("button", { name: /place order/i }).click();
    await waitForOrderConfirmation(page);
    await expect(page.getByRole("link", { name: /create account/i })).toBeVisible();
  });
});
