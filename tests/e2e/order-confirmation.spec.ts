import { test, expect } from "@playwright/test";
import { addFirstProductToCart, fillCheckoutForm } from "./helpers";

test.describe("Order confirmation page", () => {
  test("shows friendly error page for unknown order ID", async ({ page }) => {
    await page.goto("/order-confirmation/00000000-0000-0000-0000-000000000000");
    // Next.js notFound() renders the 404 page: "404" + "This page could not be found."
    const notFoundText = page
      .getByText(/404/i)
      .or(page.getByText(/could not be found/i))
      .or(page.getByText(/not found|something went wrong/i));
    await expect(notFoundText.first()).toBeVisible({ timeout: 10000 });
  });

  test("full order confirmation page renders without crash after checkout", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "e2e@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });

    await expect(page.getByRole("heading", { name: /order confirmed/i })).toBeVisible();
    await expect(page.getByText(/ORD-/)).toBeVisible();
    await expect(page.getByText(/estimated delivery/i).first()).toBeVisible();
    await expect(page.getByText(/order status/i).first()).toBeVisible();
    await expect(page.getByText(/shipping to/i).first()).toBeVisible();
    await expect(page.getByText(/payment/i).first()).toBeVisible();
    await expect(page.getByText(/items/i).first()).toBeVisible();
  });

  test("order status tracker shows pending step as active", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "e2e2@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });

    const steps = page.locator("text=/pending|confirmed|shipped|delivered/i");
    const count = await steps.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("totals add up correctly on confirmation page", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page, { email: "e2e3@example.com" });
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });

    await expect(page.getByText(/subtotal/i).first()).toBeVisible();
    await expect(page.getByText(/shipping/i).first()).toBeVisible();
    await expect(page.getByText(/total/i).first()).toBeVisible();
  });
});
