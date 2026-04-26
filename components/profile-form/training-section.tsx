import type { TrainingItem } from "@/lib/resume-types";
import { EditableSection, Field, MonthField, TextAreaField } from "./fields";

type Props = {
  items: TrainingItem[];
  onChange: (items: TrainingItem[]) => void;
};

function update(items: TrainingItem[], index: number, patch: Partial<TrainingItem>): TrainingItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

const EMPTY: TrainingItem = { name: "", period: "", startDate: "", endDate: "", summary: "" };

export function TrainingSection({ items, onChange }: Props) {
  return (
    <EditableSection
      title="교육"
      description="교육명, 기간, 주요 내용을 입력하세요."
      addLabel="교육 추가"
      onAdd={() => onChange([...items, { ...EMPTY }])}
    >
      {items.map((item, index) => (
        <div className="form-card" key={`training-${index}`}>
          <div className="toolbar">
            <strong>교육 {index + 1}</strong>
            <button
              className="button"
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              삭제
            </button>
          </div>
          <Field
            label="교육명"
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
          <TextAreaField
            label="주요 내용"
            value={item.summary}
            onChange={(value) => onChange(update(items, index, { summary: value }))}
          />
        </div>
      ))}
    </EditableSection>
  );
}
