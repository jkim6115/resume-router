import { EditableSection, TextAreaField } from "./fields";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SkillsSection({ value, onChange }: Props) {
  return (
    <EditableSection
      title="기술스택"
      description="언어, 프레임워크, 도구 등 개발 역량을 한 줄 또는 쉼표로 구분해 입력하세요."
    >
      <TextAreaField label="기술스택" value={value} onChange={onChange} />
    </EditableSection>
  );
}
