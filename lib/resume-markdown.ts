import type { BaseResume, TargetResume } from "@prisma/client";
import { parseJsonArray, parseJsonObject } from "@/lib/resume";
import { isRecord, formatValue, labelFor } from "@/lib/resume-format";

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
