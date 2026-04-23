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
  await expect(page.getByText("2023-01 ~ 재직중")).toBeVisible();
  await expect(page.getByLabel("github")).toBeVisible();
  await expect(page.getByLabel("github").locator("img")).toBeVisible();
  await expect(page.getByRole("heading", { name: /외부 링크/ })).toHaveCount(0);
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

test("markdown exports require admin authentication", async ({ request }) => {
  const baseResponse = await request.get("/admin/resume/markdown");
  const targetResponse = await request.get("/admin/resumes/AB12CD/markdown");

  expect(baseResponse.status()).toBe(401);
  expect(targetResponse.status()).toBe(401);
});

test("old public markdown export paths are not available", async ({ request }) => {
  const baseResponse = await request.get("/resume/markdown");
  const targetResponse = await request.get("/resumes/AB12CD/markdown");

  expect(baseResponse.status()).toBe(404);
  expect(targetResponse.status()).toBe(404);
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

  test("saved notices are visible after redirects", async ({ page }) => {
    await page.goto("/admin/profile?saved=1");
    await expect(page.getByText("저장되었습니다.")).toBeVisible();

    await page.goto("/admin/resumes?saved=created");
    await expect(page.getByText("기업별 이력서가 생성되었습니다.")).toBeVisible();
  });

  test("admin can export markdown", async ({ request }) => {
    const baseResponse = await request.get("/admin/resume/markdown", {
      headers: { authorization: authHeader },
    });
    const targetResponse = await request.get("/admin/resumes/AB12CD/markdown", {
      headers: { authorization: authHeader },
    });

    expect(baseResponse.status()).toBe(200);
    expect(baseResponse.headers()["content-type"]).toContain("text/markdown");
    expect(targetResponse.status()).toBe(200);
    expect(targetResponse.headers()["content-type"]).toContain("text/markdown");
  });

  test("profile edit page keeps the square icon-only save button", async ({ page }) => {
    await page.goto("/admin/profile");
    const saveButton = page.getByRole("button", { name: "공통 이력서 저장" });

    await expect(page.getByLabel("대표 직무명")).toBeVisible();
    await expect(page.getByLabel("시작 월").first()).toHaveValue("2023-01");
    await expect(page.getByLabel("현재 재직중")).toBeVisible();
    await expect(page.getByText("종료 월")).toBeVisible();
    await expect(page.getByText("재직중", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "기술스택" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "프로젝트" })).toBeVisible();
    await expect(page.getByLabel("입학 월").first()).toHaveValue("2018-03");
    await expect(page.getByLabel("졸업 월").first()).toHaveValue("2022-02");
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
