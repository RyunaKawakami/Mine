import { expect, test } from "@playwright/test";

test("redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("button", { name: "デモをはじめる" }),
  ).toBeVisible();
});

test("demo login opens the map and navigation works", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "デモをはじめる" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: /都道府県/ })).toBeVisible();

  await page.getByRole("link", { name: "思い出", exact: true }).first().click();
  await expect(page).toHaveURL(/\/memories/);
  await expect(page.getByRole("heading", { name: "思い出" })).toBeVisible();
});
