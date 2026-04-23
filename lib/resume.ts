import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export function isResumeId(value: string) {
  return /^[A-Za-z0-9]{6}$/.test(value);
}

export async function getBaseResume() {
  const baseResume = await prisma.baseResume.findFirst();

  if (baseResume) {
    return baseResume;
  }

  return prisma.baseResume.create({
    data: {
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-0000-0000",
      position: "Developer",
      selfIntroduction: "일반 지원용 자기소개를 입력하세요.",
      motivation: "직무와 성장 방향에 맞춘 기본 지원동기를 입력하세요.",
      experienceJson: "[]",
      skillsJson: "[]",
      projectsJson: "[]",
      educationJson: "[]",
      trainingJson: "[]",
      linksJson: "{\"github\":\"https://github.com/example\"}",
    },
  });
}

export async function getTargetResumeOrThrow(id: string) {
  if (!isResumeId(id)) {
    notFound();
  }

  const item = await prisma.targetResume.findUnique({
    where: { id: id.toUpperCase() },
  });

  if (!item) {
    notFound();
  }

  return item;
}

export function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function buildResumeUrl(id: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/resumes/${id}`;
}

export function buildBaseResumeUrl() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/resume`;
}

export function buildResumeMarkdownUrl(id: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/admin/resumes/${id}/markdown`;
}

export function buildBaseResumeMarkdownUrl() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/admin/resume/markdown`;
}
