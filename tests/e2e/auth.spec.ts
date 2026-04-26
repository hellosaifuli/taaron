import { test, expect } from "@playwright/test";

const timestamp = Date.now();
const testEmail = `test+${timestamp}@taaron-test.com`;
const testPassword = "TestPass123!";

test.describe("Authentication", () => {
  test("sign-up page renders all fields", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("sign-up with valid credentials creates account and redirects", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: /sign up/i }).click();
    await page.getByLabel(/full name/i).fill("Test User");
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole("button", { name: /create account/i }).click();
    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("sign-in with wrong password shows error", async ({ page }) => {
    await page.goto("/auth");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(
      page.getByText(/invalid|incorrect|authentication failed/i),
    ).toBeVisible({ timeout: 8000 });
  });

  test("forgot password sends reset link and clears email field", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: /forgot/i }).click();
    await expect(page.getByRole("heading", { name: /reset password/i })).toBeVisible();
    await page.getByLabel(/email/i).fill("someone@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    // Success message should appear
    await expect(page.getByText(/reset link sent|check your email/i)).toBeVisible({
      timeout: 8000,
    });
    // Email field should be cleared after success
    await expect(page.getByLabel(/email/i)).toHaveValue("");
  });

  test("sign-in redirects unauthenticated user from dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("back to shop link navigates home", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("link", { name: /back to shop/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("switching between modes clears error state", async ({ page }) => {
    await page.goto("/auth");
    // Trigger an error
    await page.getByLabel(/email/i).fill("bad");
    await page.getByLabel(/password/i).fill("bad");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Switch to sign-up — error should clear
    await page.getByRole("button", { name: /sign up/i }).click();
    const errorBox = page.locator(".bg-red-50");
    await expect(errorBox).not.toBeVisible();
  });
});
