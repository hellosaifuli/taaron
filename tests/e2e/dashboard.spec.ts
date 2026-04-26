import { test, expect, Page } from "@playwright/test";

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/auth");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

test.describe("Dashboard (requires auth)", () => {
  test("redirects to /auth when not logged in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("dashboard renders hero banner with user initials", async ({ page }) => {
    // Skip if no test credentials configured
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      test.skip();
      return;
    }
    await signIn(page, email, password);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByText(/orders/i)).toBeVisible();
    await expect(page.getByText(/total spent/i)).toBeVisible();
  });

  test("dashboard shows 'No orders yet' empty state or order list", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      test.skip();
      return;
    }
    await signIn(page, email, password);
    const emptyState = page.getByText(/no orders yet/i);
    const orderList = page.locator("text=/ORD-/");
    // One of these should be visible
    const hasEmpty = await emptyState.isVisible();
    const hasOrders = await orderList.isVisible();
    expect(hasEmpty || hasOrders).toBe(true);
  });

  test("sign-out button logs user out and redirects", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      test.skip();
      return;
    }
    await signIn(page, email, password);
    await page.getByRole("button", { name: /sign out/i }).click();
    await page.waitForURL(/\//, { timeout: 5000 });
    // Try accessing dashboard — should redirect to auth
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("'View Details' link from order list opens order confirmation page", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      test.skip();
      return;
    }
    await signIn(page, email, password);
    const viewDetailsLink = page.getByRole("link", { name: /view details/i }).first();
    if (!(await viewDetailsLink.isVisible())) {
      test.skip(); // No orders to view
      return;
    }
    await viewDetailsLink.click();
    await page.waitForURL(/\/order-confirmation\//, { timeout: 8000 });
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  });
});
