import { execFileSync } from "node:child_process";
import { closeSync, openSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.PLAYWRIGHT_DATABASE_URL || "file:./test.db";

async function globalSetup() {
  process.env.DATABASE_URL = databaseUrl;
  process.env.BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
  process.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";

  closeSync(openSync("prisma/test.db", "a"));

  execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
    env: process.env,
    stdio: "inherit",
  });

  const prisma = new PrismaClient();

  await prisma.targetResume.deleteMany();
  await prisma.baseResume.deleteMany();

  await prisma.baseResume.create({
    data: {
      name: "김요한",
      email: "yohan@example.com",
      phone: "010-1234-5678",
      position: "Frontend Engineer",
      selfIntroduction: "사용자 경험과 유지보수성을 함께 고려하는 개발자입니다.",
      motivation: "제품 문제를 기술로 명확하게 해결하는 방향을 지향합니다.",
      experienceJson: JSON.stringify([
        {
          company: "Example Corp",
          role: "Frontend Engineer",
          period: "2023-01",
          startDate: "2023-01",
          endDate: "",
          current: true,
          summary: "사내 대시보드와 지원자 관리 UI를 개발했습니다.",
          achievements: "반복 입력을 줄이고 주요 조회 흐름을 단축했습니다.",
          technologies: "Next.js, TypeScript, Prisma",
        },
      ]),
      skillsJson: JSON.stringify([
        { items: "React" },
        { items: "Next.js" },
        { items: "TypeScript" },
      ]),
      projectsJson: JSON.stringify([
        {
          name: "Resume Router",
          period: "2026-04",
          role: "Full-stack",
          summary: "기업별 이력서 URL과 마크다운 내보내기를 제공하는 도구입니다.",
          technologies: "Next.js, Prisma, SQLite",
          link: "https://example.com/resume-router",
        },
      ]),
      educationJson: JSON.stringify([
        {
          school: "Example University",
          major: "Computer Science",
          period: "2018-03 ~ 2022-02",
          startDate: "2018-03",
          endDate: "2022-02",
        },
      ]),
      trainingJson: JSON.stringify([
        {
          name: "Web Development Course",
          period: "2022-03 ~ 2022-08",
          summary: "웹 애플리케이션 개발 과정을 수료했습니다.",
        },
      ]),
      linksJson: JSON.stringify({
        github: "https://github.com/example",
      }),
    },
  });

  await prisma.targetResume.create({
    data: {
      id: "AB12CD",
      companyName: "샘플컴퍼니",
      selfIntroduction: "샘플컴퍼니에 맞춘 자기소개입니다.",
      motivation: "샘플컴퍼니의 제품 문제 해결에 기여하고 싶습니다.",
      notes: "Playwright 테스트용 샘플 데이터",
    },
  });

  await prisma.$disconnect();
}

export default globalSetup;
