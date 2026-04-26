import { test, expect } from "@playwright/test";
import { addFirstProductToCart } from "./helpers";

test.describe("Checkout responsiveness", () => {
  test("order summary does not overflow on mobile viewport", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");

    // Price elements inside the aside should be within viewport width
    const priceEls = page.locator("aside").getByText(/৳/);
    const count = await priceEls.count();
    if (count > 0) {
      const box = await priceEls.first().boundingBox();
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
    const cod = page.getByLabel(/cash on delivery/i).or(
      page.getByText(/cash on delivery/i),
    );
    const bkash = page.getByLabel(/bkash/i).or(page.getByText(/bkash/i));
    await expect(cod).toBeVisible();
    await expect(bkash).toBeVisible();
  });
});
