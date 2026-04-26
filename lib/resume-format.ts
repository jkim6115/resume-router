type ResumeRecord = Record<string, unknown>;

export const LABELS: Record<string, string> = {
  company: "회사",
  role: "직무",
  period: "기간",
  startDate: "시작 월",
  endDate: "종료 월",
  current: "재직 상태",
  summary: "담당 업무",
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

export function isRecord(value: unknown): value is ResumeRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function labelFor(key: string) {
  return LABELS[key] || key;
}

export function formatValue(value: unknown): string {
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
