import { expect, test } from "@playwright/test";

const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
const authHeader = `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64")}`;

test.describe("public visual stability", () => {
  test("home page", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot(`home-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("base resume page", async ({ page }, testInfo) => {
    await page.goto("/resume");
    await expect(page).toHaveScreenshot(`base-resume-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("target resume page", async ({ page }, testInfo) => {
    await page.goto("/resumes/AB12CD");
    await expect(page).toHaveScreenshot(`target-resume-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
});

test.describe("admin visual stability", () => {
  test.use({
    extraHTTPHeaders: {
      authorization: authHeader,
    },
  });

  test("admin resume list", async ({ page }, testInfo) => {
    await page.goto("/admin/resumes");
    await expect(page).toHaveScreenshot(`admin-resumes-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("admin profile form", async ({ page }, testInfo) => {
    await page.goto("/admin/profile");
    await expect(page).toHaveScreenshot(`admin-profile-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("admin new target resume form", async ({ page }, testInfo) => {
    await page.goto("/admin/resumes/new");
    await expect(page).toHaveScreenshot(`admin-resume-new-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("admin edit target resume form", async ({ page }, testInfo) => {
    await page.goto("/admin/resumes/AB12CD/edit");
    await expect(page).toHaveScreenshot(`admin-resume-edit-${testInfo.project.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
});
