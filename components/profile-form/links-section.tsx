import type { LinkItem } from "@/lib/resume-types";
import { EditableSection, Field } from "./fields";

type Props = {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
};

function update(items: LinkItem[], index: number, patch: Partial<LinkItem>): LinkItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export function LinksSection({ items, onChange }: Props) {
  return (
    <EditableSection
      title="링크"
      description="GitHub, 블로그, 포트폴리오, SNS 등 이력서 헤더에 표시할 링크를 입력하세요."
      addLabel="링크 추가"
      onAdd={() => onChange([...items, { label: "", url: "" }])}
    >
      {items.map((item, index) => (
        <div className="form-card" key={`link-${index}`}>
          <div className="toolbar">
            <strong>링크 {index + 1}</strong>
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
              label="이름"
              value={item.label}
              placeholder="예: github, blog, portfolio, linkedin"
              onChange={(value) => onChange(update(items, index, { label: value }))}
            />
            <Field
              label="URL"
              value={item.url}
              placeholder="https://..."
              onChange={(value) => onChange(update(items, index, { url: value }))}
            />
          </div>
        </div>
      ))}
    </EditableSection>
  );
}
