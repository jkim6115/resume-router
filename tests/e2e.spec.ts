import { expect, test } from "@playwright/test";

const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
const authHeader = `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64")}`;

test("home links to the admin resume list", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "기업별 이력서를 링크 하나로 관리합니다." })).toBeVisible();
  await expect(page.getByRole("link", { name: "관리자 페이지" })).toHaveAttribute("href", "/admin/resumes");
});

test("base resume renders the document layout", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.getByRole("heading", { name: "김요한" })).toBeVisible();
  await expect(page.getByText("Frontend Engineer").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /소개/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /프로젝트/ })).toBeVisible();
});

test("target resume renders and hides the company name", async ({ page }) => {
  await page.goto("/resumes/AB12CD");
  await expect(page.getByRole("heading", { name: "김요한" })).toBeVisible();
  await expect(page.getByText("샘플컴퍼니에 맞춘 자기소개입니다.")).toBeVisible();
  await expect(page.getByText("샘플컴퍼니", { exact: true })).toHaveCount(0);
});

test("invalid resume IDs return the not found page", async ({ page }) => {
  const response = await page.goto("/resumes/NOPE");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "이력서를 찾을 수 없습니다." })).toBeVisible();
});

test.describe("admin", () => {
  test.use({
    extraHTTPHeaders: {
      authorization: authHeader,
    },
  });

  test("resume list exposes the critical actions", async ({ page }) => {
    await page.goto("/admin/resumes");
    await expect(page.getByRole("heading", { name: "기업별 이력서 관리" })).toBeVisible();
    await expect(page.getByText("샘플컴퍼니")).toBeVisible();
    await expect(page.getByLabel("공개 페이지 보기").first()).toBeVisible();
    await expect(page.getByLabel("마크다운 내보내기").first()).toBeVisible();
    await expect(page.getByLabel("수정").first()).toBeVisible();
    await expect(page.getByLabel("새 항목 추가")).toBeVisible();
  });

  test("profile edit page keeps the square icon-only save button", async ({ page }) => {
    await page.goto("/admin/profile");
    const saveButton = page.getByRole("button", { name: "공통 이력서 저장" });

    await expect(page.getByLabel("대표 직무명")).toBeVisible();
    await expect(page.getByRole("heading", { name: "프로젝트" })).toBeVisible();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toHaveCSS("width", "48px");
    await expect(saveButton).toHaveCSS("height", "48px");
  });

  test("create and edit pages render without layout-critical controls missing", async ({ page }) => {
    await page.goto("/admin/resumes/new");
    await expect(page.getByRole("heading", { name: "기업별 이력서 생성" })).toBeVisible();
    await expect(page.getByRole("button", { name: "자동 ID로 생성하기" })).toBeVisible();

    await page.goto("/admin/resumes/AB12CD/edit");
    await expect(page.getByRole("heading", { name: "샘플컴퍼니 수정" })).toBeVisible();
    await expect(page.getByRole("button", { name: "수정 저장" })).toBeVisible();
  });
});
