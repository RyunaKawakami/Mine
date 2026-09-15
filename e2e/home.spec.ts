import { expect, test } from "@playwright/test";

test("shows the Mine foundation page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "ふたりでつくる、 旅と思い出の地図。" }),
  ).toBeVisible();
  await expect(page.getByText("Phase 1 ready")).toBeVisible();
});
