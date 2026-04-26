import type { EducationItem } from "@/lib/resume-types";
import { EditableSection, Field, MonthField } from "./fields";

type Props = {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
};

function update(items: EducationItem[], index: number, patch: Partial<EducationItem>): EducationItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

const EMPTY: EducationItem = { school: "", major: "", period: "", startDate: "", endDate: "", currentlyEnrolled: false };

export function EducationSection({ items, onChange }: Props) {
  return (
    <EditableSection
      title="학력"
      description="학교명, 전공, 입학 월과 졸업 월을 입력하세요."
      addLabel="학력 추가"
      onAdd={() => onChange([...items, { ...EMPTY }])}
    >
      {items.map((item, index) => (
        <div className="form-card" key={`education-${index}`}>
          <div className="toolbar">
            <strong>학력 {index + 1}</strong>
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
              label="학교명"
              value={item.school}
              onChange={(value) => onChange(update(items, index, { school: value }))}
            />
            <Field
              label="전공"
              value={item.major}
              onChange={(value) => onChange(update(items, index, { major: value }))}
            />
          </div>
          <div className="grid two">
            <MonthField
              label="입학 월"
              value={item.startDate}
              onChange={(value) => onChange(update(items, index, { startDate: value }))}
            />
            <div>
              <MonthField
                label="졸업 월"
                value={item.endDate}
                disabled={item.currentlyEnrolled}
                onChange={(value) => onChange(update(items, index, { endDate: value }))}
              />
              <label className="label" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <input
                  type="checkbox"
                  checked={item.currentlyEnrolled}
                  onChange={(e) =>
                    onChange(update(items, index, {
                      currentlyEnrolled: e.target.checked,
                      endDate: e.target.checked ? "" : item.endDate,
                    }))
                  }
                />
                재학중
              </label>
            </div>
          </div>
        </div>
      ))}
    </EditableSection>
  );
}
