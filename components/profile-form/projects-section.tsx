import type { ProjectItem } from "@/lib/resume-types";
import { EditableSection, Field, MonthField, TextAreaField } from "./fields";

type Props = {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
};

function update(items: ProjectItem[], index: number, patch: Partial<ProjectItem>): ProjectItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

const EMPTY: ProjectItem = { name: "", period: "", startDate: "", endDate: "", role: "", summary: "", technologies: "", link: "" };

export function ProjectsSection({ items, onChange }: Props) {
  return (
    <EditableSection
      title="프로젝트"
      description="개인 프로젝트, 포트폴리오, 주요 사이드 프로젝트를 입력하세요."
      addLabel="프로젝트 추가"
      onAdd={() => onChange([...items, { ...EMPTY }])}
    >
      {items.map((item, index) => (
        <div className="form-card" key={`project-${index}`}>
          <div className="toolbar">
            <strong>프로젝트 {index + 1}</strong>
            <button
              className="button"
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              삭제
            </button>
          </div>
          <Field
            label="프로젝트명"
            value={item.name}
            onChange={(value) => onChange(update(items, index, { name: value }))}
          />
          <div className="grid two">
            <MonthField
              label="시작 월"
              value={item.startDate}
              onChange={(value) => onChange(update(items, index, { startDate: value }))}
            />
            <MonthField
              label="종료 월"
              value={item.endDate}
              onChange={(value) => onChange(update(items, index, { endDate: value }))}
            />
          </div>
          <Field
            label="역할"
            value={item.role}
            placeholder="예: Frontend / Full-stack"
            onChange={(value) => onChange(update(items, index, { role: value }))}
          />
          <TextAreaField
            label="설명"
            value={item.summary}
            onChange={(value) => onChange(update(items, index, { summary: value }))}
          />
          <div className="grid two">
            <Field
              label="기술스택"
              value={item.technologies}
              placeholder="예: Next.js, SQLite, Docker"
              onChange={(value) => onChange(update(items, index, { technologies: value }))}
            />
            <Field
              label="링크"
              value={item.link}
              placeholder="https://..."
              onChange={(value) => onChange(update(items, index, { link: value }))}
            />
          </div>
        </div>
      ))}
    </EditableSection>
  );
}
