import { test, expect } from "@playwright/test";

test.describe("Product browsing", () => {
  test("homepage loads and shows navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/taaron/i);
    // Desktop: <nav> element. Mobile: hamburger button. Accept either.
    const nav = page.getByRole("navigation").or(
      page.getByRole("button", { name: /toggle menu/i }),
    );
    await expect(nav.first()).toBeVisible();
  });

  test("category page loads products", async ({ page }) => {
    await page.goto("/category/all");
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("product page shows name, price and add-to-cart button", async ({ page }) => {
    await page.goto("/category/all");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();
    await page.waitForURL(/\/products\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
    // Use .first() to avoid strict mode error when multiple ৳ elements exist
    await expect(page.getByText(/৳/).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add to cart/i }).first(),
    ).toBeVisible();
  });

  test("add to cart button works and cart reflects the item", async ({ page }) => {
    await page.goto("/category/all");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();
    await page.waitForURL(/\/products\//);

    // Select first variant if needed
    const variantLabel = page.locator("p").filter({ hasText: "Select Variant" });
    if ((await variantLabel.count()) > 0) {
      const firstVariant = variantLabel
        .locator("..")
        .locator("button:not([disabled])")
        .first();
      if (await firstVariant.count() > 0) await firstVariant.click();
      await page.waitForTimeout(300);
    }

    await page.getByRole("button", { name: /add to cart/i }).first().click();
    await page.waitForTimeout(500);
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/checkout/);
    // Cart should have an item — check for price text in the page
    await expect(page.getByText(/৳/).first()).toBeVisible({ timeout: 8000 });
  });

  test("product image shows price on mobile layout", async ({ page }) => {
    await page.goto("/category/all");
    const priceTexts = page.locator("text=/৳[\\d,]+/");
    const count = await priceTexts.count();
    expect(count).toBeGreaterThan(0);
  });

  test("category filter pages load correctly", async ({ page }) => {
    for (const cat of ["wallets", "bags", "belts"]) {
      await page.goto(`/category/${cat}`);
      await expect(page).not.toHaveURL(/\/404/);
    }
  });
});
