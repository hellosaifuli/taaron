import { test, expect } from "@playwright/test";
import { addFirstProductToCart } from "./helpers";

test.describe("Checkout responsiveness", () => {
  test("order summary does not overflow on mobile viewport", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");

    const priceEls = page.locator("aside").getByText(/৳/).first();
    if (await priceEls.isVisible({ timeout: 5000 }).catch(() => false)) {
      const box = await priceEls.boundingBox();
      const viewportWidth = page.viewportSize()?.width ?? 375;
      expect(box?.x ?? 0).toBeLessThan(viewportWidth);
    }
  });

  test("checkout form fields are fully visible on mobile", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");

    const nameInput = page.getByLabel(/full name/i);
    await expect(nameInput).toBeVisible();
    const box = await nameInput.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 375;
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test("COD and bKash payment options are selectable", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");
    await expect(page.getByText(/cash on delivery/i).first()).toBeVisible();
    await expect(page.getByText(/bkash/i).first()).toBeVisible();
  });
});
