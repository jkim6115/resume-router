const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.baseResume.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-0000-0000",
      position: "Frontend Engineer",
      selfIntroduction:
        "사용자의 문제를 제품 관점에서 해석하고, 안정적인 웹 경험으로 구현하는 개발자입니다.",
      motivation:
        "프론트엔드와 제품 개발 역량을 바탕으로 서비스 품질과 사용자 경험 개선에 기여하고자 합니다.",
      experienceJson: JSON.stringify(
        [
          {
            company: "Example Corp",
            role: "Frontend Engineer",
            period: "2023-01 ~ 2025-03",
            summary: "사내 대시보드와 지원자 관리 UI를 개발했습니다.",
            achievements: "지원자 정보 탐색 시간을 줄이고 반복 입력을 줄이는 화면 흐름을 개선했습니다.",
            technologies: "React, TypeScript, Next.js"
          }
        ],
        null,
        2
      ),
      skillsJson: JSON.stringify(
        [
          {
            category: "Programming Languages",
            items: "JavaScript, TypeScript, Python"
          },
          {
            category: "Framework / Library",
            items: "React, Next.js, Spring Boot"
          },
          {
            category: "Tooling / DevOps",
            items: "Git, Docker, SQLite"
          }
        ],
        null,
        2
      ),
      projectsJson: JSON.stringify(
        [
          {
            name: "Resume Router",
            period: "2026-04",
            role: "Full-stack",
            summary: "기업별 이력서를 공개 URL과 Markdown으로 관리하는 Next.js 애플리케이션입니다.",
            technologies: "Next.js, Prisma, SQLite, Docker",
            link: "https://example.dev"
          }
        ],
        null,
        2
      ),
      educationJson: JSON.stringify(
        [
          {
            school: "Example University",
            major: "Computer Science",
            period: "2018-03 ~ 2022-02"
          }
        ],
        null,
        2
      ),
      trainingJson: JSON.stringify(
        [
          {
            name: "Advanced Web Development Bootcamp",
            period: "2022-03 ~ 2022-08"
          }
        ],
        null,
        2
      ),
      linksJson: JSON.stringify(
        {
          github: "https://github.com/example",
          portfolio: "https://example.dev"
        },
        null,
        2
      )
    }
  });

  await prisma.targetResume.upsert({
    where: { id: "AB12CD" },
    update: {},
    create: {
      id: "AB12CD",
      companyName: "샘플컴퍼니",
      selfIntroduction:
        "사용자 관점에서 문제를 정의하고 제품 품질로 연결하는 개발자입니다.",
      motivation:
        "채용공고와 홈페이지를 분석한 뒤, 서비스의 사용자 경험 개선에 기여할 수 있다고 판단해 지원했습니다.",
      notes: "초기 데모 데이터"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
