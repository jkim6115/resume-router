import type { ExperienceItem } from "@/lib/resume-types";
import { EditableSection, Field, MonthField, TextAreaField } from "./fields";

type Props = {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
};

function update(items: ExperienceItem[], index: number, patch: Partial<ExperienceItem>): ExperienceItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

const EMPTY: ExperienceItem = {
  company: "",
  role: "",
  period: "",
  startDate: "",
  endDate: "",
  current: false,
  summary: "",
  achievements: "",
  technologies: "",
};

export function ExperienceSection({ items, onChange }: Props) {
  return (
    <EditableSection
      title="경력사항"
      description="회사명, 직무, 기간, 주요 내용을 입력하세요."
      addLabel="경력 추가"
      onAdd={() => onChange([...items, { ...EMPTY }])}
    >
      {items.map((item, index) => (
        <div className="form-card" key={`experience-${index}`}>
          <div className="toolbar">
            <strong>경력 {index + 1}</strong>
            <button
              className="button"
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              삭제
            </button>
          </div>
          <div className="grid two">
            <Field
              label="회사명"
              value={item.company}
              onChange={(value) => onChange(update(items, index, { company: value }))}
            />
            <Field
              label="직무"
              value={item.role}
              onChange={(value) => onChange(update(items, index, { role: value }))}
            />
          </div>
          <div className="grid two">
            <MonthField
              label="시작 월"
              value={item.startDate}
              onChange={(value) => onChange(update(items, index, { startDate: value }))}
            />
            {item.current ? (
              <label className="label">
                종료 월
                <span className="static-field">재직중</span>
              </label>
            ) : (
              <MonthField
                label="종료 월"
                value={item.endDate}
                onChange={(value) => onChange(update(items, index, { endDate: value }))}
              />
            )}
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(event) =>
                onChange(
                  update(items, index, {
                    current: event.target.checked,
                    endDate: event.target.checked ? "" : item.endDate,
                  })
                )
              }
            />
            현재 재직중
          </label>
          <TextAreaField
            label="담당 업무"
            value={item.summary}
            onChange={(value) => onChange(update(items, index, { summary: value }))}
          />
          <TextAreaField
            label="주요 성과"
            value={item.achievements}
            onChange={(value) => onChange(update(items, index, { achievements: value }))}
          />
          <Field
            label="사용 기술"
            value={item.technologies}
            placeholder="예: Next.js, Prisma, Docker"
            onChange={(value) => onChange(update(items, index, { technologies: value }))}
          />
        </div>
      ))}
    </EditableSection>
  );
}
