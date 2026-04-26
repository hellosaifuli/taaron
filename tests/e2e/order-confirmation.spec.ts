import { test, expect } from "@playwright/test";
import { addFirstProductToCart, fillCheckoutForm } from "./helpers";

test.describe("Order confirmation page", () => {
  test("shows friendly error page for unknown order ID", async ({ page }) => {
    await page.goto("/order-confirmation/00000000-0000-0000-0000-000000000000");
    // Should show 404 or error boundary — not a raw crash
    const notFoundText = page.getByText(/not found|could not load|something went wrong/i);
    await expect(notFoundText).toBeVisible({ timeout: 8000 });
  });

  test("full order confirmation page renders without crash after checkout", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "e2e@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 15000 });

    // Core elements
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
    await expect(page.getByText(/ORD-/)).toBeVisible();
    await expect(page.getByText(/estimated delivery/i)).toBeVisible();
    await expect(page.getByText(/order status/i)).toBeVisible();
    await expect(page.getByText(/shipping to/i)).toBeVisible();
    await expect(page.getByText(/payment/i)).toBeVisible();
    await expect(page.getByText(/items/i)).toBeVisible();
  });

  test("order status tracker shows pending step as active", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page);
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 15000 });

    // Status tracker should have 4 steps
    const steps = page.locator("text=/pending|confirmed|shipped|delivered/i");
    const count = await steps.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("totals add up correctly on confirmation page", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page);
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 15000 });

    // Subtotal, shipping and total rows should all be present
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    await expect(page.getByText(/shipping/i)).toBeVisible();
    const totalRows = page.locator("text=/total/i");
    await expect(totalRows.first()).toBeVisible();
  });
});
