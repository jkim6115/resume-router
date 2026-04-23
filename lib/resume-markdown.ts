import type { BaseResume, TargetResume } from "@prisma/client";
import { parseJsonArray, parseJsonObject } from "@/lib/resume";

type ResumeRecord = Record<string, unknown>;

const LABELS: Record<string, string> = {
  company: "회사",
  role: "직무",
  period: "기간",
  startDate: "시작 월",
  endDate: "종료 월",
  current: "재직 상태",
  summary: "요약",
  achievements: "주요 성과",
  technologies: "사용 기술",
  link: "링크",
  school: "학교",
  major: "전공",
  name: "이름",
  title: "제목",
  project: "프로젝트",
  category: "분류",
  items: "기술",
  date: "일자",
  location: "위치",
  description: "설명",
  details: "상세",
};

function isRecord(value: unknown): value is ResumeRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function labelFor(key: string) {
  return LABELS[key] || key;
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "재직중" : "";
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${labelFor(key)}: ${formatValue(nestedValue)}`)
      .filter(Boolean)
      .join(" / ");
  }

  return String(value ?? "").trim();
}

function formatSection(title: string, items: unknown[]) {
  if (items.length === 0) {
    return `## ${title}\n\n등록된 항목이 없습니다.`;
  }

  const body = items
    .map((item) => {
      if (!isRecord(item)) {
        return `- ${formatValue(item)}`;
      }

      const entries = Object.entries(item).filter(
        ([key, value]) => key !== "startDate" && key !== "endDate" && formatValue(value)
      );
      return entries.map(([key, value]) => `- ${labelFor(key)}: ${formatValue(value)}`).join("\n");
    })
    .join("\n\n");

  return `## ${title}\n\n${body}`;
}

function buildCommonMarkdown({
  baseResume,
  selfIntroduction,
  motivation,
  motivationTitle,
}: {
  baseResume: BaseResume;
  selfIntroduction: string;
  motivation: string;
  motivationTitle: string;
}) {
  const experience = parseJsonArray(baseResume.experienceJson);
  const skills = parseJsonArray(baseResume.skillsJson);
  const projects = parseJsonArray(baseResume.projectsJson);
  const education = parseJsonArray(baseResume.educationJson);
  const training = parseJsonArray(baseResume.trainingJson);
  const links = parseJsonObject(baseResume.linksJson) as Record<string, string>;
  const linkSection =
    Object.entries(links).length === 0
      ? "## 링크\n\n등록된 링크가 없습니다."
      : `## 링크\n\n${Object.entries(links)
          .map(([label, url]) => `- ${label}: ${url}`)
          .join("\n")}`;

  return [
    `# ${baseResume.name}`,
    `- 대표 직무: ${baseResume.position || "Developer"}`,
    `- 이메일: ${baseResume.email}`,
    `- 연락처: ${baseResume.phone}`,
    "## 자기소개",
    selfIntroduction || "등록된 자기소개가 없습니다.",
    `## ${motivationTitle}`,
    motivation || "등록된 내용이 없습니다.",
    formatSection("경력사항", experience),
    formatSection("기술스택", skills),
    formatSection("프로젝트", projects),
    formatSection("학력", education),
    formatSection("교육", training),
    linkSection,
  ].join("\n\n");
}

export function buildBaseResumeMarkdown(baseResume: BaseResume) {
  return [
    "아래 이력서를 개발자 채용 담당자 관점에서 구체적으로 피드백해주세요. 강점, 부족한 점, 문장 개선안, 기술스택 표현 개선안을 나눠서 알려주세요.",
    buildCommonMarkdown({
      baseResume,
      selfIntroduction: baseResume.selfIntroduction,
      motivation: baseResume.motivation,
      motivationTitle: "지원동기",
    }),
  ].join("\n\n");
}

export function buildTargetResumeMarkdown(baseResume: BaseResume, targetResume: TargetResume) {
  return [
    "아래 이력서를 개발자 채용 담당자 관점에서 구체적으로 피드백해주세요. 회사 맞춤 자기소개와 지원동기가 설득력 있는지도 함께 평가해주세요.",
    `<!-- company: ${targetResume.companyName} / id: ${targetResume.id} -->`,
    buildCommonMarkdown({
      baseResume,
      selfIntroduction: targetResume.selfIntroduction,
      motivation: targetResume.motivation,
      motivationTitle: "지원동기",
    }),
  ].join("\n\n");
}
